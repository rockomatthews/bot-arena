// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal USDC betting arena for 1-minute rounds.
/// - Users bet variable USDC amount on UP/DOWN for a round.
/// - A 1% fee is charged per bet and immediately paid to treasury.
/// - Remaining stake goes into the pool and is paid to winners pro-rata.
/// - Draw refunds stake (fee is not refunded).
contract BotsTurnArena is Ownable {
  using SafeERC20 for IERC20;

  enum Side {
    NONE,
    UP,
    DOWN
  }

  enum Result {
    UNSET,
    UP,
    DOWN,
    DRAW
  }

  struct Round {
    uint64 startTs;
    uint64 bettingEndsTs;
    uint64 endTs;
    bool settled;
    Result result;
    uint256 totalUp;
    uint256 totalDown;
  }

  struct Bet {
    Side side;
    uint256 stake; // net stake after fee
    bool claimed;
  }

  IERC20 public immutable usdc;
  address public treasury;

  uint16 public feeBps; // 100 = 1%
  uint256 public maxBetPerUserPerRound; // in USDC decimals

  mapping(uint256 => Round) public rounds;
  mapping(uint256 => mapping(address => Bet)) public bets; // roundId => user => bet

  event TreasurySet(address indexed treasury);
  event FeeSet(uint16 feeBps);
  event MaxBetSet(uint256 maxBet);

  event RoundSet(uint256 indexed roundId, uint64 startTs, uint64 bettingEndsTs, uint64 endTs);
  event BetPlaced(uint256 indexed roundId, address indexed user, Side side, uint256 amountIn, uint256 fee, uint256 stake);
  event RoundSettled(uint256 indexed roundId, Result result);
  event Claimed(uint256 indexed roundId, address indexed user, uint256 payout);

  constructor(address _usdc, address _treasury, uint16 _feeBps, uint256 _maxBet) Ownable(msg.sender) {
    require(_usdc != address(0), "USDC=0");
    require(_treasury != address(0), "TREASURY=0");
    require(_feeBps <= 1000, "FEE_TOO_HIGH");
    usdc = IERC20(_usdc);
    treasury = _treasury;
    feeBps = _feeBps;
    maxBetPerUserPerRound = _maxBet;
  }

  function setTreasury(address _treasury) external onlyOwner {
    require(_treasury != address(0), "TREASURY=0");
    treasury = _treasury;
    emit TreasurySet(_treasury);
  }

  function setFeeBps(uint16 _feeBps) external onlyOwner {
    require(_feeBps <= 1000, "FEE_TOO_HIGH");
    feeBps = _feeBps;
    emit FeeSet(_feeBps);
  }

  function setMaxBetPerUserPerRound(uint256 _maxBet) external onlyOwner {
    maxBetPerUserPerRound = _maxBet;
    emit MaxBetSet(_maxBet);
  }

  /// @notice optional: record round timing onchain (not strictly required for payouts)
  function setRound(uint256 roundId, uint64 startTs, uint64 bettingEndsTs, uint64 endTs) external onlyOwner {
    Round storage r = rounds[roundId];
    require(!r.settled, "SETTLED");
    r.startTs = startTs;
    r.bettingEndsTs = bettingEndsTs;
    r.endTs = endTs;
    emit RoundSet(roundId, startTs, bettingEndsTs, endTs);
  }

  function placeBet(uint256 roundId, Side side, uint256 amountIn) external {
    require(side == Side.UP || side == Side.DOWN, "BAD_SIDE");
    require(amountIn > 0, "AMOUNT=0");

    Round storage r = rounds[roundId];
    if (r.bettingEndsTs != 0) {
      require(block.timestamp < r.bettingEndsTs, "BETTING_CLOSED");
    }
    require(!r.settled, "SETTLED");

    Bet storage b = bets[roundId][msg.sender];
    if (b.side == Side.NONE) {
      b.side = side;
    } else {
      require(b.side == side, "ONE_SIDE_ONLY");
    }

    // enforce per-user cap (net stake + new net stake <= max)
    uint256 fee = (amountIn * feeBps) / 10_000;
    uint256 stake = amountIn - fee;

    require(b.stake + stake <= maxBetPerUserPerRound, "MAX_BET");

    usdc.safeTransferFrom(msg.sender, address(this), amountIn);
    if (fee > 0) usdc.safeTransfer(treasury, fee);

    b.stake += stake;

    if (side == Side.UP) r.totalUp += stake;
    else r.totalDown += stake;

    emit BetPlaced(roundId, msg.sender, side, amountIn, fee, stake);
  }

  function settleRound(uint256 roundId, Result result) external onlyOwner {
    require(result == Result.UP || result == Result.DOWN || result == Result.DRAW, "BAD_RESULT");
    Round storage r = rounds[roundId];
    require(!r.settled, "SETTLED");
    r.settled = true;
    r.result = result;
    emit RoundSettled(roundId, result);
  }

  function claim(uint256 roundId) external {
    Round storage r = rounds[roundId];
    require(r.settled, "NOT_SETTLED");
    Bet storage b = bets[roundId][msg.sender];
    require(!b.claimed, "CLAIMED");
    require(b.side != Side.NONE, "NO_BET");

    b.claimed = true;

    uint256 payout = 0;

    if (r.result == Result.DRAW) {
      payout = b.stake;
    } else {
      uint256 totalPool = r.totalUp + r.totalDown;
      uint256 totalWinning = (r.result == Result.UP) ? r.totalUp : r.totalDown;
      if (totalWinning == 0) {
        payout = 0;
      } else {
        // pro-rata
        payout = (b.stake * totalPool) / totalWinning;
      }
    }

    if (payout > 0) {
      usdc.safeTransfer(msg.sender, payout);
    }

    emit Claimed(roundId, msg.sender, payout);
  }

  function getRound(uint256 roundId) external view returns (Round memory) {
    return rounds[roundId];
  }

  function getBet(uint256 roundId, address user) external view returns (Bet memory) {
    return bets[roundId][user];
  }
}
