const { } = require('@completium/completium-cli');

exports.env = {
  stages: {
    mockup: {
      quiet: true,
      endpoint: 'mockup',
      originator_alias: 'alice',
      owner_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee_receiver_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      metadata: {
        royalties: 'ipfs://QmXWYogA9afUcciA8KAeV8ArtVPfSQEbqppv4GPSa6ng6S',
        transfer_proxy: 'ipfs://QmQrBsY2XQn2XHkpd1gaVCE9Uy8CCRYdAXjavkmCJCYa1q',
        transfer_manager: 'ipfs://QmbffXr3cLoMMzaCqU5AiMR858X4WEyfxLD7p71HG11pqb',
        fill: 'ipfs://QmZeoyeADuWfp17884BJdqBnEXeEyXZB6FiK3mGcKTDJZh',
        exchange: 'ipfs://QmU1QKVfp5XMkv7EZNF7ir9GpMJRbiVKaDoEv1BxtD8gFC',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
      }
    },
    testnet: {
      quiet: false,
      endpoint: 'https://rpc.ithacanet.teztnets.xyz',
      originator_alias: 'alice',
      owner_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee_receiver_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      metadata: {
        royalties: 'ipfs://QmXWYogA9afUcciA8KAeV8ArtVPfSQEbqppv4GPSa6ng6S',
        transfer_proxy: 'ipfs://QmQrBsY2XQn2XHkpd1gaVCE9Uy8CCRYdAXjavkmCJCYa1q',
        transfer_manager: 'ipfs://QmbffXr3cLoMMzaCqU5AiMR858X4WEyfxLD7p71HG11pqb',
        fill: 'ipfs://QmZeoyeADuWfp17884BJdqBnEXeEyXZB6FiK3mGcKTDJZh',
        exchange: 'ipfs://QmU1QKVfp5XMkv7EZNF7ir9GpMJRbiVKaDoEv1BxtD8gFC',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
      }
    },
    privatenet: {
      quiet: false,
      endpoint: 'https://dev-tezos-node.rarible.org',
      originator_alias: 'bob',
      owner_address: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
      fee_receiver_address: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
      metadata: {
        royalties: 'ipfs://QmXWYogA9afUcciA8KAeV8ArtVPfSQEbqppv4GPSa6ng6S',
        transfer_proxy: 'ipfs://QmQrBsY2XQn2XHkpd1gaVCE9Uy8CCRYdAXjavkmCJCYa1q',
        transfer_manager: 'ipfs://QmbffXr3cLoMMzaCqU5AiMR858X4WEyfxLD7p71HG11pqb',
        fill: 'ipfs://QmZeoyeADuWfp17884BJdqBnEXeEyXZB6FiK3mGcKTDJZh',
        exchange: 'ipfs://QmU1QKVfp5XMkv7EZNF7ir9GpMJRbiVKaDoEv1BxtD8gFC',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
      }
    },
    mainnet: {
      quiet: false,
      endpoint: 'https://tezos-node.rarible.org',
      originator_alias: 'completium-deploy',
      owner_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      fee_receiver_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      metadata: {
        royalties: 'ipfs://QmXWYogA9afUcciA8KAeV8ArtVPfSQEbqppv4GPSa6ng6S',
        transfer_proxy: 'ipfs://QmQrBsY2XQn2XHkpd1gaVCE9Uy8CCRYdAXjavkmCJCYa1q',
        transfer_manager: 'ipfs://QmbffXr3cLoMMzaCqU5AiMR858X4WEyfxLD7p71HG11pqb',
        fill: 'ipfs://QmZeoyeADuWfp17884BJdqBnEXeEyXZB6FiK3mGcKTDJZh',
        exchange: 'ipfs://QmU1QKVfp5XMkv7EZNF7ir9GpMJRbiVKaDoEv1BxtD8gFC',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
      }
    }
  },
  contracts: {
    royalties: {
      id: 'rarible_royalties',
      path: './contracts/royalties.arl',
    },
    transfer_proxy: {
      id: 'rarible_transfer_proxy',
      path: './contracts/transfer_proxy.arl',
    },
    transfer_manager: {
      id: 'rarible_transfer_manager',
      path: './contracts/transfer_manager.arl',
    },
    fill: {
      id: 'rarible_fill',
      path: './contracts/fill.arl',
    },
    exchange: {
      id: 'rarible_exchange',
      path: './contracts/exchange.arl',
    },
    fa2_ft: {
      id: 'fa2_ft',
      path: '../test-contracts/test-fa2-ft.arl',
    },
    fa12_ft: {
      id: 'fa12_ft',
      path: '../test-contracts/test-fa12-ft.arl',
    },
    nft: {
      id: 'nft',
      path: '../test-contracts/test-nft.arl',
    }
  }
};
