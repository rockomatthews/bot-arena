export const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_usdc",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_treasury",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "_feeBps",
        "type": "uint16"
      },
      {
        "internalType": "uint256",
        "name": "_maxBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum BotsTurnArenaDeposit.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "feeBps",
        "type": "uint16"
      }
    ],
    "name": "FeeSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxBet",
        "type": "uint256"
      }
    ],
    "name": "MaxBetSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxDeposit",
        "type": "uint256"
      }
    ],
    "name": "MaxDepositSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "startTs",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "bettingEndsTs",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "endTs",
        "type": "uint64"
      }
    ],
    "name": "RoundSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum BotsTurnArenaDeposit.Result",
        "name": "result",
        "type": "uint8"
      }
    ],
    "name": "RoundSettled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "treasury",
        "type": "address"
      }
    ],
    "name": "TreasurySet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "bets",
    "outputs": [
      {
        "internalType": "enum BotsTurnArenaDeposit.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "claimToBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeBps",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getBet",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum BotsTurnArenaDeposit.Side",
            "name": "side",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "stake",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "claimed",
            "type": "bool"
          }
        ],
        "internalType": "struct BotsTurnArenaDeposit.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "getRound",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "startTs",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "bettingEndsTs",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "endTs",
            "type": "uint64"
          },
          {
            "internalType": "bool",
            "name": "settled",
            "type": "bool"
          },
          {
            "internalType": "enum BotsTurnArenaDeposit.Result",
            "name": "result",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "totalUp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDown",
            "type": "uint256"
          }
        ],
        "internalType": "struct BotsTurnArenaDeposit.Round",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxBetPerUserPerRound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxDepositPerUser",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "enum BotsTurnArenaDeposit.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "name": "placeBetFromBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "rounds",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "startTs",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "bettingEndsTs",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "endTs",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "settled",
        "type": "bool"
      },
      {
        "internalType": "enum BotsTurnArenaDeposit.Result",
        "name": "result",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "totalUp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalDown",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_feeBps",
        "type": "uint16"
      }
    ],
    "name": "setFeeBps",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_maxBet",
        "type": "uint256"
      }
    ],
    "name": "setMaxBetPerUserPerRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_maxDeposit",
        "type": "uint256"
      }
    ],
    "name": "setMaxDepositPerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "startTs",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "bettingEndsTs",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "endTs",
        "type": "uint64"
      }
    ],
    "name": "setRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_treasury",
        "type": "address"
      }
    ],
    "name": "setTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "enum BotsTurnArenaDeposit.Result",
        "name": "result",
        "type": "uint8"
      }
    ],
    "name": "settleRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdc",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
export const BYTECODE = "0x60a060405234801561000f575f5ffd5b5060405161196438038061196483398101604081905261002e916101d6565b338061005457604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61005d8161016c565b506001600160a01b03851661009d5760405162461bcd60e51b81526020600482015260066024820152650555344433d360d41b604482015260640161004b565b6001600160a01b0384166100e05760405162461bcd60e51b815260206004820152600a602482015269054524541535552593d360b41b604482015260640161004b565b6103e88361ffff1611156101255760405162461bcd60e51b815260206004820152600c60248201526b08c8a8abea89e9ebe90928e960a31b604482015260640161004b565b6001600160a01b039485166080526001805461ffff909416600160a01b026001600160b01b0319909416949095169390931791909117909255600291909155600355610230565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146101d1575f5ffd5b919050565b5f5f5f5f5f60a086880312156101ea575f5ffd5b6101f3866101bb565b9450610201602087016101bb565b9350604086015161ffff81168114610217575f5ffd5b6060870151608090970151959894975095949392505050565b60805161170761025d5f395f81816101d00152818161057b01528181610c1a0152610d8201526117075ff3fe608060405234801561000f575f5ffd5b5060043610610148575f3560e01c806382e5310c116100bf578063b6b55f2511610079578063b6b55f251461033f578063e0950ddf14610352578063e5bfc3aa14610372578063f0f4426014610385578063f2fde38b14610398578063f644b3bb146103ab575f5ffd5b806382e5310c1461026a5780638c65c81f146102735780638da5cb5b146102e95780638f1327c0146102f9578063aa28306a14610319578063af84c5dd1461032c575f5ffd5b80633e413bee116101105780633e413bee146101cb578063483083881461020a5780634845be711461021d57806361d027b31461023057806370a0823114610243578063715018a614610262575f5ffd5b8063023b1fc91461014c57806309e872871461016157806323ee76e41461017d57806324a9d853146101905780632e1a7d4d146101b8575b5f5ffd5b61015f61015a366004611335565b6103f8565b005b61016a60025481565b6040519081526020015b60405180910390f35b61015f61018b36600461135d565b6104a1565b6001546101a590600160a01b900461ffff1681565b60405161ffff9091168152602001610174565b61015f6101c636600461135d565b6104de565b6101f27f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610174565b61015f61021836600461135d565b6105db565b61015f61022b366004611390565b610618565b6001546101f2906001600160a01b031681565b61016a6102513660046113f0565b60046020525f908152604090205481565b61015f6106ee565b61016a60035481565b6102d661028136600461135d565b60056020525f908152604090208054600182015460029092015467ffffffffffffffff80831693600160401b8404821693600160801b81049092169260ff600160c01b8404811693600160c81b900416919087565b6040516101749796959493929190611431565b5f546001600160a01b03166101f2565b61030c61030736600461135d565b610701565b604051610174919061147c565b61015f6103273660046114f2565b6107ea565b61015f61033a366004611523565b610929565b61015f61034d36600461135d565b610cfd565b61036561036036600461155b565b610dff565b6040516101749190611595565b61015f61038036600461135d565b610e92565b61015f6103933660046113f0565b6110a4565b61015f6103a63660046113f0565b611138565b6103e96103b936600461155b565b600660209081525f928352604080842090915290825290208054600182015460029092015460ff91821692911683565b604051610174939291906115c3565b610400611175565b6103e88161ffff16111561044a5760405162461bcd60e51b815260206004820152600c60248201526b08c8a8abea89e9ebe90928e960a31b60448201526064015b60405180910390fd5b6001805461ffff60a01b1916600160a01b61ffff8416908102919091179091556040519081527faab062e3faf62b6c9a0f8e62af66e0310e27127a8c871a67be7dd4d93de6da53906020015b60405180910390a150565b6104a9611175565b60038190556040518181527f9e90992d436d86d95875a61f93f8ae77454d4bb11f27434d7c7f88cd005fb39c90602001610496565b5f81116104fd5760405162461bcd60e51b8152600401610441906115e7565b335f9081526004602052604090205481111561054a5760405162461bcd60e51b815260206004820152600c60248201526b125394d551919250d251539560a21b6044820152606401610441565b335f908152600460205260408120805483929061056890849061161d565b909155506105a290506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633836111a1565b60405181815233907f7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5906020015b60405180910390a250565b6105e3611175565b60028190556040518181527faa2f425a28b31745998cd65ef6efddb75a7bb49ea01fe71f5dd9164667f1748590602001610496565b610620611175565b5f8481526005602052604090208054600160c01b900460ff16156106565760405162461bcd60e51b815260040161044190611630565b805467ffffffffffffffff8581166fffffffffffffffffffffffffffffffff199092168217600160401b8683169081029190911767ffffffffffffffff60801b1916600160801b92861692830217845560408051938452602084019190915282015285907fb80b023898f2bd1493fd13a35ac76d1bc9b8cc5f0152f66c1766e12e70ef4c859060600160405180910390a25050505050565b6106f6611175565b6106ff5f6111db565b565b61073e6040805160e0810182525f808252602082018190529181018290526060810182905290608082019081526020015f81526020015f81525090565b5f82815260056020908152604091829020825160e081018452815467ffffffffffffffff8082168352600160401b8204811694830194909452600160801b81049093169381019390935260ff600160c01b830481161515606085015290916080840191600160c81b9091041660038111156107bb576107bb611409565b60038111156107cc576107cc611409565b81526001820154602082015260029091015460409091015292915050565b6107f2611175565b600181600381111561080657610806611409565b14806108235750600281600381111561082157610821611409565b145b8061083f5750600381600381111561083d5761083d611409565b145b6108785760405162461bcd60e51b815260206004820152600a60248201526910905117d49154d5531560b21b6044820152606401610441565b5f8281526005602052604090208054600160c01b900460ff16156108ae5760405162461bcd60e51b815260040161044190611630565b8054600160c01b60ff60c01b198216811783558391839161ffff60c01b1990911617600160c81b8360038111156108e7576108e7611409565b0217905550827f22697572ca2feb298c3278a751e187a8ecf2a81b95f67fb4059c6e7e9c5e7ff18360405161091c9190611651565b60405180910390a2505050565b600182600281111561093d5761093d611409565b148061095a5750600282600281111561095857610958611409565b145b6109915760405162461bcd60e51b81526020600482015260086024820152674241445f5349444560c01b6044820152606401610441565b5f81116109b05760405162461bcd60e51b8152600401610441906115e7565b335f908152600460205260409020548111156109fd5760405162461bcd60e51b815260206004820152600c60248201526b125394d551919250d251539560a21b6044820152606401610441565b5f8381526005602052604090208054600160401b900467ffffffffffffffff1615610a74578054600160401b900467ffffffffffffffff164210610a745760405162461bcd60e51b815260206004820152600e60248201526d10915515125391d7d0d313d4d15160921b6044820152606401610441565b8054600160c01b900460ff1615610a9d5760405162461bcd60e51b815260040161044190611630565b5f848152600660209081526040808320338452909152812090815460ff166002811115610acc57610acc611409565b03610af95780548490829060ff19166001836002811115610aef57610aef611409565b0217905550610b5e565b836002811115610b0b57610b0b611409565b815460ff166002811115610b2157610b21611409565b14610b5e5760405162461bcd60e51b815260206004820152600d60248201526c4f4e455f534944455f4f4e4c5960981b6044820152606401610441565b6001545f9061271090610b7c90600160a01b900461ffff168661165f565b610b869190611676565b90505f610b93828661161d565b9050600254818460010154610ba89190611695565b1115610be05760405162461bcd60e51b815260206004820152600760248201526613505617d0915560ca1b6044820152606401610441565b335f9081526004602052604081208054879290610bfe90849061161d565b90915550508115610c4357600154610c43906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169116846111a1565b80836001015f828254610c569190611695565b9091555060019050866002811115610c7057610c70611409565b03610c935780846001015f828254610c889190611695565b90915550610cac9050565b80846002015f828254610ca69190611695565b90915550505b336001600160a01b0316877f5b70029c2661c4a9199ccdd6b370f084615aa3e33d2327ed901579b698ab5a3288888686604051610cec94939291906116a8565b60405180910390a350505050505050565b5f8111610d1c5760405162461bcd60e51b8152600401610441906115e7565b600354335f90815260046020526040902054610d39908390611695565b1115610d755760405162461bcd60e51b815260206004820152600b60248201526a13505617d1115413d4d25560aa1b6044820152606401610441565b610daa6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001633308461122a565b335f9081526004602052604081208054839290610dc8908490611695565b909155505060405181815233907f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c4906020016105d0565b60408051606080820183525f8083526020808401829052838501829052868252600681528482206001600160a01b038716835290528390208351918201909352825491929091829060ff166002811115610e5b57610e5b611409565b6002811115610e6c57610e6c611409565b81526001820154602082015260029091015460ff16151560409091015290505b92915050565b5f8181526005602052604090208054600160c01b900460ff16610ee55760405162461bcd60e51b815260206004820152600b60248201526a1393d517d4d1551513115160aa1b6044820152606401610441565b5f8281526006602090815260408083203384529091529020600281015460ff1615610f3c5760405162461bcd60e51b815260206004820152600760248201526610d3105253515160ca1b6044820152606401610441565b5f815460ff166002811115610f5357610f53611409565b03610f895760405162461bcd60e51b81526020600482015260066024820152651393d7d0915560d21b6044820152606401610441565b60028101805460ff191660011790555f60038354600160c81b900460ff166003811115610fb857610fb8611409565b03610fc85750600181015461103d565b5f83600201548460010154610fdd9190611695565b90505f60018554600160c81b900460ff166003811115610fff57610fff611409565b1461100e578460020154611014565b84600101545b9050801561103a578082856001015461102d919061165f565b6110379190611676565b92505b50505b801561106757335f9081526004602052604081208054839290611061908490611695565b90915550505b604051818152339085907f4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed0269060200160405180910390a350505050565b6110ac611175565b6001600160a01b0381166110ef5760405162461bcd60e51b815260206004820152600a602482015269054524541535552593d360b41b6044820152606401610441565b600180546001600160a01b0319166001600160a01b0383169081179091556040517f3c864541ef71378c6229510ed90f376565ee42d9c5e0904a984a9e863e6db44f905f90a250565b611140611175565b6001600160a01b03811661116957604051631e4fbdf760e01b81525f6004820152602401610441565b611172816111db565b50565b5f546001600160a01b031633146106ff5760405163118cdaa760e01b8152336004820152602401610441565b6111ae8383836001611266565b6111d657604051635274afe760e01b81526001600160a01b0384166004820152602401610441565b505050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6112388484848460016112c8565b61126057604051635274afe760e01b81526001600160a01b0385166004820152602401610441565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f511483166112bc5783831516156112b0573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f51148316611324578383151615611318573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f60208284031215611345575f5ffd5b813561ffff81168114611356575f5ffd5b9392505050565b5f6020828403121561136d575f5ffd5b5035919050565b803567ffffffffffffffff8116811461138b575f5ffd5b919050565b5f5f5f5f608085870312156113a3575f5ffd5b843593506113b360208601611374565b92506113c160408601611374565b91506113cf60608601611374565b905092959194509250565b80356001600160a01b038116811461138b575f5ffd5b5f60208284031215611400575f5ffd5b611356826113da565b634e487b7160e01b5f52602160045260245ffd5b6004811061142d5761142d611409565b9052565b67ffffffffffffffff8881168252878116602083015286166040820152841515606082015260e08101611467608083018661141d565b60a082019390935260c0015295945050505050565b5f60e08201905067ffffffffffffffff835116825267ffffffffffffffff602084015116602083015267ffffffffffffffff604084015116604083015260608301511515606083015260808301516114d7608084018261141d565b5060a083015160a083015260c083015160c083015292915050565b5f5f60408385031215611503575f5ffd5b82359150602083013560048110611518575f5ffd5b809150509250929050565b5f5f5f60608486031215611535575f5ffd5b8335925060208401356003811061154a575f5ffd5b929592945050506040919091013590565b5f5f6040838503121561156c575f5ffd5b8235915061157c602084016113da565b90509250929050565b6003811061142d5761142d611409565b5f6060820190506115a7828451611585565b6020830151602083015260408301511515604083015292915050565b606081016115d18286611585565b8360208301528215156040830152949350505050565b6020808252600890820152670414d4f554e543d360c41b604082015260600190565b634e487b7160e01b5f52601160045260245ffd5b81810381811115610e8c57610e8c611609565b60208082526007908201526614d1551513115160ca1b604082015260600190565b60208101610e8c828461141d565b8082028115828204841417610e8c57610e8c611609565b5f8261169057634e487b7160e01b5f52601260045260245ffd5b500490565b80820180821115610e8c57610e8c611609565b608081016116b68287611585565b8460208301528360408301528260608301529594505050505056fea26469706673582212205fc0ae1761271a69201aed053e4f880b79f02c16eb00714128d8492c56db058164736f6c63430008220033" as const;
