# Royalties provider contract

## Presentation
The Royalties provider contract implements a standard way to provide on chain royalties for NFT trades.

There are 2 ways to define royalties:
* At mint time in the NFT contract, if it implements the get royalties view (for more information on this implementation, you can check the [Rarible token contracts](../tokens/contracts/))
* By the admin of the contract who can set arbitrary royalties for the whole contract, or for a specific token id

For the Rarible Protocol, Royalties are fetched from the royalties provider when a trade is made (if the Rarible royalties standard is implemented).

## Features
* Set royalties
* Get royalties

## Architecture
![royalties-architecture](http://plantuml.com/plantuml/png/TP112eCm44NtEKKke0VeehZghgKKzs7GqGQYAJDJIn7ltY22EcsppF_l9Vo21KYUNJ1L06PR4lJS8BapzD0YsT7OTCOEvHxhoNRpjPEbnllqGR52vaqycKLyYsy8uf7TbUBWwrNTU0o9fQMWb2sA-nFnDbfVkfnAfSxptEpGSV3uqkuaC3z-cMN7MNbGTRtKNFpcDLPWNwUvFm00)

## Interactions
![royalties-interactions](http://plantuml.com/plantuml/png/RP2nheCm34LtVyKL4mpl1nYUcDgf7LfsPD608a50ZXdwzmqHf8hKZNjzZh7IU6NHRPw8Urq4D-lK2DXZZbz4j0R0zdPbfoXQOUU7GCpiU3HIxAWUPNUKkNA_j95oW-Q3n_BcIQtnSInd8XfbsLOyZI8X1E0u2N__23jHnrmchoBZNgTy3R9aSdvaNFCbQen6knHBDsWLhLJjU6Znasp2dyCRVW00)

## Set up
The Royalties contracts are coded in [Archetype](https://docs.archetype-lang.org/).
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
To deploy the Royalties smart contracts, please refer to the [scripts](../scripts/README.md) folder.
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
