# Bids contract

## Features
* Put open bids
  * Bids possible in XTZ, FA2, or FA12 fungible tokens
* Put open floor bids: put a bid on any token from a collection
  * Floor Bids possible in XTZ, FA2, or FA12 fungible tokens
* Update a bid
* Update a floor bid
* Accept a bid
* Accept a floor bid
* Cancel an existing bid
* Cancel an existing floor bid

## Architecture
![bids-architecture](http://plantuml.com/plantuml/png/VLHBJiCm4Dtx5Bb0Bz05gjWZ8M1lkSuaM7BYQcOIG57lJWZ1nHwxNRxFV5uzEH4Rv6dmodf3rBoX6Qa3r4zcD3rWiwXc_Iq3y7jehysmmPft6QNi1OC5ed_qLUs5NyANyUo0z3E6sRMtqfq3ltfn5sGbUs1TeIYXOgT7rr9MUvsBWmrUTm0g6tbYVNQj13iV0ahAM0iNhk8LbpMZ1L_5eolTGhzoGDD3jitvXx9XP3IM4-OlT_txDw6m9K3iIae6ky82h6s7C8GPghXqbHzBGY-pWuzjQ0sVZhZ4nWtkQVguJ8bAez-Upk7maAP_Z85K-2oRUfrRK3M9pAogbFb5gJpZaloEMjwvoaLYf4ABiab-2exPcQiJZEqq-6y0)

## Interactions
![bids-interactions](http://plantuml.com/plantuml/png/xLV1Qjmm4BtxAuQSij0UdACF9KbfZg6GFPHUZ6AF5rDR4fAyD7zVHLRKggh3TAkbq4gmYvWPFMdUZ1xojJPCcMMUAjOPeU01fmaLC0tQpRpvTdbQhO_FawgITj7OZP9n0nUtOwyldDDEKXSyM0Hsm13IwjKGX-uLutf01JFZrgbSkF76rXlZ9VTtUnV51nCxxcwkmFi6TjMcxle7V-q2geCIYmHxO33Y2tBGQ1PPWHriCk0G5tuO7oU4lGkmgLJWXwC5thxpspMmo9uPR8L4nMosbpydidDBST9eeMigThs2CocLEE8MAEyh-tl9wEDY0bo0iWRTW5nC6rpMuZsXG0reJ2AIcbWS9JhKkdtnw43RlO0FNqTjHdu8Xw1HwaQyLSHmy5qEIipDcjeRCAA9KbWf8NEzlMdz1xj-sdyEXhGC0VCvxjUut_6sIvMYk81N3yVxq8QvwnHjkTKYVaInspMEmbnUAq-xlzyp-GceCp3mhpRmMQbt9qzFGo4VUN-20W-J48gWmowkg75HuwB6fn9GrBYeyKtNeJJmkjugdCKH2MAxJg9aJYOXIPwdBU8_ovA42T90luefjtxRNHwm0R5LsE5up0Qfn9EbO4GT0PCqWt15Cr1Jdu6REWSvGKtI1dIfqQvVmaC25cMMGjB9I83Jz59uEY-RYk7UNpJTSA55FOfw5FNuxzNZFUCTJcxzxpyuAFUUS7bplEX9To7BopbdOmNWxSe4NTTqOJz_bKgLhktVCa_V0000)

## Set up
The Bids contracts are coded in [Archetype](https://docs.archetype-lang.org/).
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
To deploy the Bids smart contracts, please refer to the [scripts](../scripts/README.md) folder.
* Testnet deployed version:
  * [https://better-call.dev/hangzhou2net/KT1RFnei8kDnwVtgQHapPkJMNqua5jZFonMQ/operations](https://better-call.dev/hangzhou2net/KT1RFnei8kDnwVtgQHapPkJMNqua5jZFonMQ/operations)
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
