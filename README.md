# Tezos smart contracts for Rarible protocol

Consists of:

- [Exchange v2](exchange-v2/README.md) (current live contract as of March 9th, 2022): responsible for sales, royalties.
- [Tokens](tokens/README.md): for storing information about NFTs
- [Auctions](auctions/README.md): for managing auction sales
- [Bids](bids/README.md): for managing open bids
- [On chain sales](onchain-sales/README.md): for managing sales fully on chain (will replace Exchange v2)
- [Royalties provider](royalties-provider/README.md): provider a flexible, safe, fully on chain royalties management solution
- [Transfer Manager](transfer-manager/README.md): Manage all transfers, including fees, and royalties processing

## Develop, test
For details regarding the way to use and deploy the contracts, please refer to their respective documentation:
- [Exchange v2](exchange-v2/README.md)
- [Tokens](tokens/README.md)
- [Auctions](auctions/README.md)
- [Bids](bids/README.md)
- [On chain sales](onchain-sales/README.md)
- [Royalties provider](royalties-provider/README.md)
- [Transfer Manager](transfer-manager/README.md)

## Deploy
For more information on how to deploy the smart contract, please refer to the [scripts](scripts/README.md) folder.
## Overview of the protocol

Rarible protocol is a combination of smart-contracts for exchanging tokens, tokens themselves, APIs for order creation, discovery, standards used in smart contracts.

Protocol is primarily targeted to NFTs, but it's not limited to NFTs only. Any asset on Tezos can be traded on Rarible.

## Suggestions

You are welcome to [suggest features](https://github.com/rarible/tezos-protocol-contracts/discussions) and [report bugs found](https://github.com/rarible/tezos-protocol-contracts/issues)!

## License

Smart contracts for Rarible protocol are available under the [MIT License](LICENSE.md).

## Credits

The [Tezos Exchange smart contracts](exchange-v2/README.md) were intially developped by [Benoit Rognier](https://www.linkedin.com/in/benoitrognier/) and [Guillaume Duhamel](https://www.linkedin.com/in/guillaumeduhamel/) from [Edukera/Completium](https://completium.com/), and the Tezos NFT contracts by [Florian PAUTOT](https://www.linkedin.com/in/florianpautot/) for Rarible.

All current deployed smart contracts are developed by [Florian PAUTOT](https://www.linkedin.com/in/florianpautot/) for Rarible.
