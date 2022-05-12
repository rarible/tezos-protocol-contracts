# Signature Checker

## Presentation
The Signature Checker is a very simple contract allowing the easy and simple on chain-signature verification.

It allows a technological agnostic way of verifying a signature through a simple RPC call.

## Features
* Verify a Tezos signature

## Set up
The Signature Checker contract is coded in [Archetype](https://docs.archetype-lang.org/).
To be able to run the tests, you need to install the [Completium CLI](https://completium.com/docs/cli):
```bash
> npm i @completium/completium-cli -g
> completium-cli init
```

Due to limitations in the mockup mode, this contract can only be tested in real networks (testnet, mainnet)

The testnet mode is set by default in the tests.

Other modes are available. More info [here](https://completium.com/docs/cli/network#switch-endpoint).

Run the following command once to setup the testnet mode:
```bash
> completium-cli switch endpoint
```

You can finally run the tests:
```bash
> npm test
```
### Deployment
To deploy the Signature Checker smart contract, please refer to the [scripts](../scripts/README.md) folder.
* Testnet deployed version:
    * https://better-call.dev/ithacanet/KT1BxUKoEWgspWFUDGxg7FxsAMcUiRupxLUL/operations

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
