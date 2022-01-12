# FA2 templates

## Features

The FA2 contracts provide the following features:
* Public or private mint:
  * Public: anyone can mint any token for anyone
  * Private: only owner or a minter can mint
* Single or multiple token:
  * Single: pure non-fungible (it is owned by one address or not) (ERC721)
  * Multiple: semi-fungible (each token has a balance) (ERC1155)
* Feeless transfer:
  * one-step mode with the `transfer_gasless` entrypoint
  * two-steps mode with the `permit` entrypoint following the [TZIP-17](https://medium.com/tqtezos/tzip-17-permit-497afd9b0e9e) norm
* Royalties: 
  * defined at token level when minted
  * read with the view get_royalties

## Set up
The FA2 contract templates are coded in [Archetype](https://docs.archetype-lang.org/).
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

#### Deploy command

Example of command to deploy `single-nft-fa2-public-collection.arl` :

```
> completium-cli deploy single-nft-fa2-public-collection.arl --parameters '{ "owner" : "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" }' --metadata-uri 'ipfs://QmP8XaNKhSqC3HaGBRisoDSXB7EBryVr9fRBsxMcv8Jh78'
```

[More info](https://completium.com/docs/cli/contract).