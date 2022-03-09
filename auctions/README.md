# Auction contracts

## Features
* Start timed NFT (FA2) auctions
  * Only one auction per user per NFT at the same time
* Place bids with XTZ, FA12, FA2 fungible tokens
* Process auction payment with split royalties, and custom fee policies

## Architecture
![auction-architecture](http://plantuml.com/plantuml/png/dPDDJWCn38NtSugvG2_G1Ie7G4B0FZA9PnefFvNjbAAgTwUb7N18f4fi_Jt7xyNoXWL8IWo33S0ylX4adf3C4oIOaSRZC8x7YBBDxZJ6xwAHcuWrsr6soApWQRWz-f8_8OX7Di-KzzujpquUmxcJ5goVcr5C5x02QiPZiU9pukhb20VZ2i65g38U11EVQmsyvf1iSp0Jub0D5Y0nS9rJ9IzYthtJfSadpzkUs4Ao61RI-ZUlaWbch7BSrCRc90HM599bOTVTKDl5TGhiPYWx1u8zGXZplalQZP_XtkF7hs4yU1PLdzNqI_QVhQrM3-qNhBNRkrfjzBwyTLzrD8VmhuxcNeP6r7FN6TLlR0zh_UTmXWqcLsBu0W00)

## Interactions
![auction-interactions](http://plantuml.com/plantuml/png/xLTDQzmm4BtxLuWzPQ4zE4SVIfB27aiWUoYz6AqztehQaj77qlpxQYNBU5KjEwRQGg4-96BcpHlDHvwT9wMfr6Re2zfe8SaRz3r8GXLHxZIPNyoxjnxi8HWthn9EJ1ZbtPkpVvnCjGSMesLd3HifrsJpR1hD17T0wiz907cpzFG8Is2jlEqoO2yfLnr8Cb1kdVuEUZBMa_4ovCjkxr2yqvUEtVCZcNmTVQn_TvSBV-a0nL4ACzhhMk1SaMyS-VZfdA8YPcofXbgC8AajuI6-tNOHC55Kn4sb3epJRuk8ks6HaCJ5MIex6T60KdNmg2B6p5SEZeTEYg6QDk43qQAAysyBu6remmjhBUO7yFEbp5WG-z1U4zTOmu_iq0FPEy21jGNnZryfczjt7TCn5mgz0ajTOhbBJqv7suWJN2FbxRAYLwC3dQk42m8_cTAC7-CqqG17e-ibule8vtedUnI2dQOFmtNSFZ7bOW3n_7rrwV47olGqy7dBFqlyTVzjDgJd4PZFqAlidXKniWHTmDowBc_dxRt_BY52CgnIn7XzasAawrNqoa2j529_cUa2Ti0taaNnYULOcvUt_wO8_1U1G8UM01iWZCue0186SLhvCl67n1fXln2Iwnss-luh6JvHjXcOEe1QGWFib8TFYdTREGCLiMRyUydGbJ9tMyhrVS49Rsg3RxwFumX42RvtIUOOlhBPSoVnzAi747SNbGer6jwcFfHtZ3FrFVIyM2zIwmKgYpWXX2c3A6KKfFnYX12YB2AKLu3oYqzIUFABJdx1kR_O_6sXYSJbC-KDz9d41VdlJmH3QyjYCAw49_l33Fql)
## Set up
The Auction contracts are coded in [Archetype](https://docs.archetype-lang.org/).
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
To deploy the Auction smart contracts, please refer to the [scripts](../scripts/README.md) folder.
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
