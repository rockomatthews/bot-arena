export const ARENA_ABI = [
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
        "internalType": "enum BotsTurnArena.Side",
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
        "internalType": "enum BotsTurnArena.Result",
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
        "internalType": "enum BotsTurnArena.Side",
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
    "name": "claim",
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
            "internalType": "enum BotsTurnArena.Side",
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
        "internalType": "struct BotsTurnArena.Bet",
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
            "internalType": "enum BotsTurnArena.Result",
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
        "internalType": "struct BotsTurnArena.Round",
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
        "internalType": "enum BotsTurnArena.Side",
        "name": "side",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "name": "placeBet",
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
        "internalType": "enum BotsTurnArena.Result",
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
        "internalType": "enum BotsTurnArena.Result",
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
  }
] as const;
export const ARENA_BYTECODE = "0x60a060405234801561000f575f5ffd5b5060405161165438038061165483398101604081905261002e916101cd565b338061005457604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61005d81610163565b506001600160a01b03841661009d5760405162461bcd60e51b81526020600482015260066024820152650555344433d360d41b604482015260640161004b565b6001600160a01b0383166100e05760405162461bcd60e51b815260206004820152600a602482015269054524541535552593d360b41b604482015260640161004b565b6103e88261ffff1611156101255760405162461bcd60e51b815260206004820152600c60248201526b08c8a8abea89e9ebe90928e960a31b604482015260640161004b565b6001600160a01b039384166080526001805461ffff909316600160a01b026001600160b01b031990931693909416929092171790915560025561021d565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146101c8575f5ffd5b919050565b5f5f5f5f608085870312156101e0575f5ffd5b6101e9856101b2565b93506101f7602086016101b2565b9250604085015161ffff8116811461020d575f5ffd5b6060959095015193969295505050565b60805161140a61024a5f395f8181610186015281816105d001528181610c140152610c53015261140a5ff3fe608060405234801561000f575f5ffd5b5060043610610111575f3560e01c80638c65c81f1161009e578063da866c481161006e578063da866c48146102ba578063e0950ddf146102cd578063f0f44260146102ed578063f2fde38b14610300578063f644b3bb14610313575f5ffd5b80638c65c81f146102015780638da5cb5b146102775780638f1327c014610287578063aa28306a146102a7575f5ffd5b80633e413bee116100e45780633e413bee1461018157806348308388146101c05780634845be71146101d357806361d027b3146101e6578063715018a6146101f9575f5ffd5b8063023b1fc91461011557806309e872871461012a57806324a9d85314610146578063379607f51461016e575b5f5ffd5b61012861012336600461105a565b610360565b005b61013360025481565b6040519081526020015b60405180910390f35b60015461015b90600160a01b900461ffff1681565b60405161ffff909116815260200161013d565b61012861017c366004611082565b610409565b6101a87f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161013d565b6101286101ce366004611082565b610634565b6101286101e13660046110b5565b610671565b6001546101a8906001600160a01b031681565b610128610747565b61026461020f366004611082565b60036020525f908152604090208054600182015460029092015467ffffffffffffffff80831693600160401b8404821693600160801b81049092169260ff600160c01b8404811693600160c81b900416919087565b60405161013d9796959493929190611127565b5f546001600160a01b03166101a8565b61029a610295366004611082565b61075a565b60405161013d9190611172565b6101286102b53660046111e8565b610843565b6101286102c8366004611219565b610982565b6102e06102db366004611267565b610d36565b60405161013d91906112a1565b6101286102fb3660046112cf565b610dc9565b61012861030e3660046112cf565b610e5d565b610351610321366004611267565b600460209081525f928352604080842090915290825290208054600182015460029092015460ff91821692911683565b60405161013d939291906112e8565b610368610e9a565b6103e88161ffff1611156103b25760405162461bcd60e51b815260206004820152600c60248201526b08c8a8abea89e9ebe90928e960a31b60448201526064015b60405180910390fd5b6001805461ffff60a01b1916600160a01b61ffff8416908102919091179091556040519081527faab062e3faf62b6c9a0f8e62af66e0310e27127a8c871a67be7dd4d93de6da53906020015b60405180910390a150565b5f8181526003602052604090208054600160c01b900460ff1661045c5760405162461bcd60e51b815260206004820152600b60248201526a1393d517d4d1551513115160aa1b60448201526064016103a9565b5f8281526004602090815260408083203384529091529020600281015460ff16156104b35760405162461bcd60e51b815260206004820152600760248201526610d3105253515160ca1b60448201526064016103a9565b5f815460ff1660028111156104ca576104ca6110ff565b036105005760405162461bcd60e51b81526020600482015260066024820152651393d7d0915560d21b60448201526064016103a9565b60028101805460ff191660011790555f60038354600160c81b900460ff16600381111561052f5761052f6110ff565b0361053f575060018101546105bd565b5f836002015484600101546105549190611320565b90505f60018554600160c81b900460ff166003811115610576576105766110ff565b1461058557846002015461058b565b84600101545b9050805f0361059c575f92506105ba565b808285600101546105ad9190611333565b6105b7919061134a565b92505b50505b80156105f7576105f76001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163383610ec6565b604051818152339085907f4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed0269060200160405180910390a350505050565b61063c610e9a565b60028190556040518181527faa2f425a28b31745998cd65ef6efddb75a7bb49ea01fe71f5dd9164667f17485906020016103fe565b610679610e9a565b5f8481526003602052604090208054600160c01b900460ff16156106af5760405162461bcd60e51b81526004016103a990611369565b805467ffffffffffffffff8581166fffffffffffffffffffffffffffffffff199092168217600160401b8683169081029190911767ffffffffffffffff60801b1916600160801b92861692830217845560408051938452602084019190915282015285907fb80b023898f2bd1493fd13a35ac76d1bc9b8cc5f0152f66c1766e12e70ef4c859060600160405180910390a25050505050565b61074f610e9a565b6107585f610f00565b565b6107976040805160e0810182525f808252602082018190529181018290526060810182905290608082019081526020015f81526020015f81525090565b5f82815260036020818152604092839020835160e081018552815467ffffffffffffffff8082168352600160401b8204811694830194909452600160801b81049093169481019490945260ff600160c01b830481161515606086015290926080850192600160c81b900490911690811115610814576108146110ff565b6003811115610825576108256110ff565b81526001820154602082015260029091015460409091015292915050565b61084b610e9a565b600181600381111561085f5761085f6110ff565b148061087c5750600281600381111561087a5761087a6110ff565b145b8061089857506003816003811115610896576108966110ff565b145b6108d15760405162461bcd60e51b815260206004820152600a60248201526910905117d49154d5531560b21b60448201526064016103a9565b5f8281526003602052604090208054600160c01b900460ff16156109075760405162461bcd60e51b81526004016103a990611369565b8054600160c01b60ff60c01b198216811783558391839161ffff60c01b1990911617600160c81b836003811115610940576109406110ff565b0217905550827f22697572ca2feb298c3278a751e187a8ecf2a81b95f67fb4059c6e7e9c5e7ff183604051610975919061138a565b60405180910390a2505050565b6001826002811115610996576109966110ff565b14806109b3575060028260028111156109b1576109b16110ff565b145b6109ea5760405162461bcd60e51b81526020600482015260086024820152674241445f5349444560c01b60448201526064016103a9565b5f8111610a245760405162461bcd60e51b81526020600482015260086024820152670414d4f554e543d360c41b60448201526064016103a9565b5f8381526003602052604090208054600160401b900467ffffffffffffffff1615610a9b578054600160401b900467ffffffffffffffff164210610a9b5760405162461bcd60e51b815260206004820152600e60248201526d10915515125391d7d0d313d4d15160921b60448201526064016103a9565b8054600160c01b900460ff1615610ac45760405162461bcd60e51b81526004016103a990611369565b5f848152600460209081526040808320338452909152812090815460ff166002811115610af357610af36110ff565b03610b205780548490829060ff19166001836002811115610b1657610b166110ff565b0217905550610b85565b836002811115610b3257610b326110ff565b815460ff166002811115610b4857610b486110ff565b14610b855760405162461bcd60e51b815260206004820152600d60248201526c4f4e455f534944455f4f4e4c5960981b60448201526064016103a9565b6001545f9061271090610ba390600160a01b900461ffff1686611333565b610bad919061134a565b90505f610bba8286611398565b9050600254818460010154610bcf9190611320565b1115610c075760405162461bcd60e51b815260206004820152600760248201526613505617d0915560ca1b60448201526064016103a9565b610c3c6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016333088610f4f565b8115610c7c57600154610c7c906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116911684610ec6565b80836001015f828254610c8f9190611320565b9091555060019050866002811115610ca957610ca96110ff565b03610ccc5780846001015f828254610cc19190611320565b90915550610ce59050565b80846002015f828254610cdf9190611320565b90915550505b336001600160a01b0316877f5b70029c2661c4a9199ccdd6b370f084615aa3e33d2327ed901579b698ab5a3288888686604051610d2594939291906113ab565b60405180910390a350505050505050565b60408051606080820183525f8083526020808401829052838501829052868252600481528482206001600160a01b038716835290528390208351918201909352825491929091829060ff166002811115610d9257610d926110ff565b6002811115610da357610da36110ff565b81526001820154602082015260029091015460ff16151560409091015290505b92915050565b610dd1610e9a565b6001600160a01b038116610e145760405162461bcd60e51b815260206004820152600a602482015269054524541535552593d360b41b60448201526064016103a9565b600180546001600160a01b0319166001600160a01b0383169081179091556040517f3c864541ef71378c6229510ed90f376565ee42d9c5e0904a984a9e863e6db44f905f90a250565b610e65610e9a565b6001600160a01b038116610e8e57604051631e4fbdf760e01b81525f60048201526024016103a9565b610e9781610f00565b50565b5f546001600160a01b031633146107585760405163118cdaa760e01b81523360048201526024016103a9565b610ed38383836001610f8b565b610efb57604051635274afe760e01b81526001600160a01b03841660048201526024016103a9565b505050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610f5d848484846001610fed565b610f8557604051635274afe760e01b81526001600160a01b03851660048201526024016103a9565b50505050565b60405163a9059cbb60e01b5f8181526001600160a01b038616600452602485905291602083604481808b5af1925060015f51148316610fe1578383151615610fd5573d5f823e3d81fd5b5f873b113d1516831692505b60405250949350505050565b6040516323b872dd60e01b5f8181526001600160a01b038781166004528616602452604485905291602083606481808c5af1925060015f5114831661104957838315161561103d573d5f823e3d81fd5b5f883b113d1516831692505b604052505f60605295945050505050565b5f6020828403121561106a575f5ffd5b813561ffff8116811461107b575f5ffd5b9392505050565b5f60208284031215611092575f5ffd5b5035919050565b803567ffffffffffffffff811681146110b0575f5ffd5b919050565b5f5f5f5f608085870312156110c8575f5ffd5b843593506110d860208601611099565b92506110e660408601611099565b91506110f460608601611099565b905092959194509250565b634e487b7160e01b5f52602160045260245ffd5b60048110611123576111236110ff565b9052565b67ffffffffffffffff8881168252878116602083015286166040820152841515606082015260e0810161115d6080830186611113565b60a082019390935260c0015295945050505050565b5f60e08201905067ffffffffffffffff835116825267ffffffffffffffff602084015116602083015267ffffffffffffffff604084015116604083015260608301511515606083015260808301516111cd6080840182611113565b5060a083015160a083015260c083015160c083015292915050565b5f5f604083850312156111f9575f5ffd5b8235915060208301356004811061120e575f5ffd5b809150509250929050565b5f5f5f6060848603121561122b575f5ffd5b83359250602084013560038110611240575f5ffd5b929592945050506040919091013590565b80356001600160a01b03811681146110b0575f5ffd5b5f5f60408385031215611278575f5ffd5b8235915061128860208401611251565b90509250929050565b60038110611123576111236110ff565b5f6060820190506112b3828451611291565b6020830151602083015260408301511515604083015292915050565b5f602082840312156112df575f5ffd5b61107b82611251565b606081016112f68286611291565b8360208301528215156040830152949350505050565b634e487b7160e01b5f52601160045260245ffd5b80820180821115610dc357610dc361130c565b8082028115828204841417610dc357610dc361130c565b5f8261136457634e487b7160e01b5f52601260045260245ffd5b500490565b60208082526007908201526614d1551513115160ca1b604082015260600190565b60208101610dc38284611113565b81810381811115610dc357610dc361130c565b608081016113b98287611291565b8460208301528360408301528260608301529594505050505056fea26469706673582212200ff5953d7ce17d23e609d6a21ef2f93ae35e1c0994024330a2121e6c6671c7a064736f6c63430008220033" as const;
