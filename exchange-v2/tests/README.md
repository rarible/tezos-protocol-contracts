# Exchange V2 Tests

| File | Desc |
| -- | -- |
| `libFilltest.js` | Tests the `fillOrder` function from [validator](../contracts/validator.arl) contract.  |
| `libFeeSide.js` | Tests the `getFeeSide` function from [exchangeV2](../contracts/exchangeV2.arl) contract. |
| `matchAssetTypes.js` | Tests the `matchAssetTypes` function from [validator](../contracts/validator.arl) contract. |
| `exchangeV2simpletest.js` | Tests the `matchOrders` entry point from [exchangeV2](../contracts/exchangeV2.arl) contract, with orders that exchange XTZ for FA 1.2 tokens (No origin fee, no royalty).
| `exchangeV2raribletest.js` |  Tests the `matchOrders` entry point from [exchangeV2](../contracts/exchangeV2.arl) contract, with orders that exchange FA 1.2 for FA2 tokens with protocol fees & origin fees & rayalties. |


# Install
Tests use the following tools:

| Tool | Minimal Version | Desc |
| -- | -- | -- |
| Node JS | v16.13.1 | JS runtime. [Mode info](https://nodejs.org/en/). |
| Completium-cli | 0.3.7 |CLI and JS library to manage endpooints, accounts, and interact with smart contracts on the Tezos blockchain. [More info](https://completium.com/docs/cli). |
| Tezos client | 11.* |Tezos blockchain's client. [More info](https://assets.tqtezos.com/docs/setup/1-tezos-client/)
| Mocha | 9.1.1 |JS test framework. [More info](https://mochajs.org/). |
| Archetype (optional) | 1.2.11| Archetype language compiler. [More info](https://archetype-lang.org/). |

It is recommended to use the [Archetype extension](https://marketplace.visualstudio.com/items?itemName=edukera.archetype) for VS Code (>= 0.43.0). It provides:<ul><li> syntax highlighting</li><li>syntaxic and typing errors</li></ul>
## Completium-cli

```
npm i -g @completium/completium-cli
```

Run the following commands to init the environment:
```
completium-cli init
```


## Tezos client

Install the [Tezos client](https://assets.tqtezos.com/docs/setup/1-tezos-client/) and make it available in the environment as `tezos-client`.

Then initialize the mockup mode:

```
completium-cli mockup init
```

## Tests

In the project root directory:
```
npm i
```

## Archetype binary (optional)

Completium-cli comes with a [JS version](https://www.npmjs.com/package/@completium/archetype) of the archetype compiler. However it may be required to switch to a binary version for speed purpose.

To do so, download the binary version of the compiler from [here](https://github.com/edukera/archetype-lang/releases/tag/1.2.8). Make sure it is available in the environment as `archetype`.

Tell completium-cli to use the binary version:
```
completium-cli archetype set bin true
```

Tell the VS Code extension to use the binary version:
go to *settings* and uncheck the "Use Archetype JS Lib" option.
# Run test

In root project directory:

```
$ npm test
```
## Output

Expected output:

```shell
$ npm test
> tezos-rarible-contract@1.0.0 test
> make -C tests/contracts clean all && mocha ./tests/*.js --timeout 0 --slow 9999999999

rm -f *.arl
cat ../../contracts/exchange.arl fillOrder.tarl > fillOrder.arl
cat ../../contracts/exchange.arl libFeeSide.tarl > libFeeSide.arl
cat ../../contracts/exchange.arl matchAssetTypes.tarl > matchAssetTypes.arl


  Deploying
    ✔ Deploy Royalties
    ✔ Deploy Transfer Proxy
    ✔ Deploy Transfer Manager
    ✔ Deploy Fill Storage
    ✔ Deploy Exchange
    ✔ Link Transfer Manager to Exchange
    ✔ Link Transfer Manager to Transfer Proxy
    ✔ Link Transfer Proxy to Transfer Manager
    ✔ Link Fill Storage to Exchange

  Deploying Test Tokens
    ✔ Deploy 2 FA 1.2(s)
    ✔ Deploy FA 2
    ✔ Link FA2 to Royalties Manager

  MatchOrders
    ✔ xtz orders work, rest is returned to taker with 3% fee (other side)
    Do matchOrders(), orders dataType == V1
      ✔ From FA 1.2(100) to FA 1.2(200) Protocol, Origin fees, no Royalties
      ✔ From FA 1.2(100) to FA 1.2(200) Protocol, no fees because of rounding
      ✔ From FA 1.2(DataV1) to FA2(RoyaltiesV2, DataV1) Protocol, Origin fees, Royalties
    Functori feedbacks
      ✔ Simple fa2 exchange with data V1
    matchOrders, orderType = V2
      ✔ should correctly calculate make-side fill for isMakeFill = true

  Deploying
    ✔ Deploy Royalties
    ✔ Deploy Transfer Proxy
    ✔ Deploy Transfer Manager
    ✔ Deploy Fill Storage
    ✔ Deploy Exchange
    ✔ Link Transfer Manager to Exchange
    ✔ Link Transfer Manager to Transfer Proxy
    ✔ Link Transfer Proxy to Transfer Manager
    ✔ Link Fill Storage to Exchange

  Deploying Test Token
    ✔ Deploy FA 1.2

  matchOrders
    ✔ xtz orders work, rest is returned to taker
    ✔ xtz orders work, rest is returned to taker (other side)

  Deploying
    ✔ Deploy Royalties
    ✔ Deploy Transfer Manager
    ✔ Deploy Fill Storage
    ✔ Deploy Exchange

  AssetMatcher
    ✔ Test : XTZ, FA_1_2; MAKE wins
    ✔ Test : FA_1_2, XTZ; TAKE wins
    ✔ Test : FA_1_2, FA_2 Fungible; MAKE wins
    ✔ Test : FA_1_2, FA_2 NotFungible; MAKE wins
    ✔ Test : FA_1_2, FA_2 Unknown; MAKE wins
    ✔ Test : FA_2 Fungible, FA_1_2; TAKE wins
    ✔ Test : FA_2 NotFungible, FA_1_2; TAKE wins
    ✔ Test : FA_2 Unknown, FA_1_2; TAKE wins
    ✔ Test : FA_2 Fungible, XTZ; TAKE wins
    ✔ Test : FA_2 NotFungible, XTZ; TAKE wins
    ✔ Test : FA_2 Unknown, XTZ; TAKE wins
    ✔ Test : XTZ, FA_2 Fungible; MAKE wins
    ✔ Test : XTZ, FA_2 NotFungible; MAKE wins
    ✔ Test : XTZ, FA_2 Unknown; MAKE wins
    ✔ Test : XTZ, not Asset; MAKE wins
    ✔ Test : not Asset, FA_2 Unknown; NONE wins
    ✔ Test : not Asset, not Asset; NONE wins
    ✔ Test : MAKE == TAKE; MAKE wins

  Deploying
    ✔ Deploy Royalties
    ✔ Deploy Transfer Manager
    ✔ Deploy Fill Storage
    ✔ Deploy Exchange

  right order fill
    ✔ should fill fully right order if amounts are fully matched
    ✔ should throw if right order is fully matched, but price is not ok
    ✔ should fill right order and return profit if more than needed

  left order fill
    ✔ should fill orders when prices match exactly
    ✔ should fill orders when right order has better price
    ✔ should throw if price is not ok

  both orders fill
    ✔ should fill orders when prices match exactly
    ✔ should fill orders when right order has better price
    ✔ should fill orders when right order has better price with less needed amount
    ✔ should throw if price is not ok

  Deploying
    ✔ Deploy Royalties
    ✔ Deploy Transfer Proxy
    ✔ Deploy Transfer Manager
    ✔ Deploy Fill Storage
    ✔ Deploy Exchange
    ✔ Link Transfer Manager to Exchange
    ✔ Link Transfer Manager to Transfer Proxy
    ✔ Link Transfer Proxy to Transfer Manager
    ✔ Link Fill Storage to Exchange

  Deploying Test Tokens
    ✔ Deploy 2 FA 1.2(s)
    ✔ Deploy FA 2
    ✔ Link FA2 to Royalties Manager

  MatchOrders
    matchOrders, orderType = V2
      ✔ should correctly calculate take-side fill for isMakeFill = false


  79 passing (11m)
  ```