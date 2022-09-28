# On-chain Feeless Sales contract

## Features
* List an NFT for sale (fixed price)
  * Listing possible in XTZ, FA2, or FA12 fungible tokens
* Purchase an NFT
  * Purchase possible in XTZ, FA2, or FA12 fungible tokens
* Cancel an existing sale

## Architecture
![sales-architecture](http://plantuml.com/plantuml/png/TL91RiCm3Bld5Vb0Fv33q0yC6DRT3SrHCWEADKXgjYBetnV4pLhRg8yYHSe4ZseWTfweyGIgxOT0r075lKA44QLTcdPzouJsnVsrdRQninjDS_HRsAFg0tnjRiBlV06oWEhUXEVGtwM7WBJkoax89KSqzmJI3FftEW6X5kBhOSQUoGs8JQb2b4y-pvTyu25w9AT0MDYuax70Y8MTRfZdQ0BUCiZsW5EIKkzLzrbopgQ24yzO0yiSy2S9EVmDQbh3ATJzDockm-6b-55tTtvEIMUKhAf4NTsRfYHjctLBkg81HupzMjS_)

## Interactions
![sales-interactions](http://plantuml.com/plantuml/png/hPH1gzim3CVl_XJYdTw3xP0USnZT1ZtkqXp6Ba5DbHBcsCPs2ltsIsI79QbVCRI51blwwoTPCjuxZzOFlHJOU6tXI5AI1NJWU1NDFuPRi9wcXH1c3EgQpg3oy7P4IUwDOwPLmWd74O8N-Y-gNR2inPL5vLgoqACQdPRrFXhhQ5o7_3fKh5AjNpiEttSGVItkwdjtiV0NB10NgmS3eMIl_v82Htum0W1YF-3hjobL2OCvewTQ6xBejNtVLld1GIWzS263kdGdIL05AaeI47xSKkPocTbeaew0Jv49Bm8TZR7wIfzHrLbC_xaL9ALOSNXw9RZPmNjsBCSw2NmzcPQqyHObOUF-8SjIFrRCkBLkUuOImgAU7OxrQzbYYBFZlRMwB-E8lu3NN5F-49CfU9w9B4pc937XnvEKbgYsr51tVPvbzGsbxyXjY7ctBPspU4qRYbVseNYg4R-hFxn9NUOPEOdkiImAf8StESbXDNEs-iVdvGQdcLjv_aHMxSv7vqyfCOByD8dWv0Ft4rL34bgfjGtztJpsSQeDw_W9odsgECr-_0oz_0S0)

## Set up
The Sales contracts are coded in [Archetype](https://docs.archetype-lang.org/).
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
To deploy the Sales smart contracts, please refer to the [scripts](../scripts/README.md) folder.
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
