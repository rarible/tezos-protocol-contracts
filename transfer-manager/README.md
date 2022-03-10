# Transfer Manager

## Presentation
The Transfer manager is the core part of the Rarible protocol, as this is the common contract handling all transfers, and the processing of the royalties and fees.

This contract is common to all Tezos smart contracts: Bids, On chain Sales, Auctions.

There is no specific storage for this contract, as this is a purely processing component of the Rarible architecture. To understand how it used, you can refer to the other Rarible contract like bids, on chain sales and auctions.

To avoid requiring to declare the Transfer Manager as an operator for all NFTs and Fungible tokens, it can trigger transfers from Rarible Custody contracts. This drastically reduces the overall cost for the users.

## Features
* Process any transfers
  * FA2, FA12, XTZ
  * Custody transfers from Rarible Custody contracts (in FA2, FA12, XTZ)
* Manage sale/auction/bid transfers

## Set up
The Transfer Manager contract is coded in [Archetype](https://docs.archetype-lang.org/).
To be able to run the tests, you need to install the [Completium CLI](https://completium.com/docs/cli):
```bash
> npm i @completium/completium-cli -g
> completium-cli init
```

You may select the network to run the tests by setting the `mockup_mode` flag in js files:
* Mockup mode (local, fast)
* Testnet

The mockup mode is set by default in the tests.

Other modes are available. More info [here](https://completium.com/docs/cli/network#switch-endpoint).

Run the following command once to setup the mockup mode:
```bash
> completium-cli mockup init
```

You can finally run the tests:
```bash
> npm test
```
### Deployment
To deploy the Transfer Manager smart contract, please refer to the [scripts](../scripts/README.md) folder.
* Testnet deployed version:
  * https://better-call.dev/hangzhou2net/KT1DGVfBwtw6WDQ9mQELzUAHYC6XXat7hJB3/operations

#### Select network

To select the network Mockup/Tesnet/Mainnet, you can use the following command:

```
> completium-cli switch endpoint

Current network: mockup
Current endpoint: mockup
? Switch endpoint …
▸ main       https://mainnet-tezos.giganode.io
  main       https://mainnet.smartpy.io
  main       https://rpc.tzbeta.net
  main       https://api.tez.ie/rpc/mainnet
  florence   https://florence-tezos.giganode.io
  florence   https://florencenet.smartpy.io
  granada    https://granada-tezos.giganode.io
  granada    https://granadanet.smartpy.io
  sandbox    http://localhost:20000
  mockup     mockup
```

[More info](https://completium.com/docs/cli/network).

#### Select account

To select the account you want to deploy with:
```bash
> completium-cli switch account
```

[More info](https://completium.com/docs/cli/account).
