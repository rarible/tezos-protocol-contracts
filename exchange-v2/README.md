# Rarible's exchange contract on Tezos

This is the port of the [Rarible ExchangeV2](https://github.com/rarible/protocol-contracts/tree/master/exchange-v2)  contract on Tezos.

Its main entry point is `matchOrders` which takes two *orders* and execute the corresponding transfers if orders match.

An order represents its issuer's will to exchange an *asset* A (*make* part of the order) against an *asset* B (*take* part of the order).

An asset represents an amount of an *asset type*. For example :
* 110 XTZ
* 50 fungible tokens stored in a FA 1.2 or FA 2 contract
* 7 parts of a NFT stored in a FA 2 contract

The following orders match :

| order | Make aseset type | Make amount | Take asset type | Take amount |
| -- | -- | -- | -- | -- |
| Left | XTZ | 100 | FA 1.2 at `KT1xx` | 50 |
| Right | FA 1.2 at `KT1xx` | 50 | XTZ | 100 |

An order may be partially *filled* by another. In the example below, *left* order is filled up to 80 by *right* order which is fully filled.

| order | Make aseset type | Make amount | Take asset type | Take amount |
| -- | -- | -- | -- | -- |
| Left | XTZ | 100 | FA 1.2 at `KT1xx` | 50 |
| Right | FA 1.2 at `KT1xx` | 40 | XTZ | 80 |

The contract keeps track of order's fill data. A new (or never matched) order is associated to 0. In the example above, after transfers, it associates left order with 80.

Besides fill data, the contract is a state-less process, the order book being maintained off-chain.


Order matching is refused if prices (exchange rates) do not match, as in:
| order | Make aseset type | Make amount | Take asset type | Take amount |
| -- | -- | -- | -- | -- |
| Left | XTZ | 100 | FA 1.2 at `KT1xx` | 200 |
| Right | FA 1.2 at `KT1xx` | 99 | XTZ | 50 |

When order match, exchange of assets (2 transfer operations) is executed.

The contract applies fees and royalties to the exchange :
* protocol fee (set with `setProtocol` entry, in bps, taken on both left and right sides)
* origin fees
* royalties, as provided by the [royalties](./contracts/royalties.arl) contract

From an eagle eye view, the exchange process is two-steps:
1. decide whether left and right orders match (matching of asset types, amounts, fill data, ...)
2. execute transfers, and apply fees and royalties (if any)

## Implementation

The diagram below presents the process flow between contracts:

```
     ┌──────────────────┬──────────────────┬──────────────────┐
     │    Exchange      │  TransferManager │     Royalties    │
     ├──────────────────┼──────────────────┼──────────────────┤
     │                  │                  │                  │
─────┼─► matchOrders    │                  │                  │
     │        │         │                  │                  │
     │        │         │                  │                  │
     │        │         │                  │                  │
     │        ▼         │                  │                  │
     │ matchAndTransfer─┼──► doTransfers ──┼──► getRoyalties  │
     │                  │        ▲         │         │        │
     │                  │        │         │         │        │
     │                  │        └──processRoyalties─┘        │
─────┼─►    cancel      │                  │                  │
     │                  │                  │                  │
     │                  │                  │                  │
     │                  │                  │                  │
     └──────────────────┴──────────────────┴──────────────────┘
```

## API

The exchange contract is the main interface as the validator contract is not meant to (and cannot) be called outside specified contracts.

| Entry point | Parameters | Description | Called by |
| -- | -- | -- | -- |
| `matchOrders` | <ul><li>left order</li><li>option of left order signature</li><li>right order</li><li>option of right order signature</li></ul>| see [above](#raribles-exchange-contract-on-tezos). | *anyone* |
| `cancel` | order | Sets order's fill to zero.<p/>Call is forwarded to `validator` contract| *anyone* |
| `claimOwnserhip`| | | `owner` |
| `declareOwnship`| | | `owner`|
| `setDefaultFeeReceiver`| | | `owner`|
| `setMetaDataUri`| | TZIP 16 | `owner` |
| `setProtocolFee`| | in bps | `owner` |
| `setRoylatiesContract`| | | `owner` |
| `setTransferManager`| | | `owner` |

### Differences

The transfer factory and custom asset matcher are not implemented. It does not currently support `OTHER` asset type.

