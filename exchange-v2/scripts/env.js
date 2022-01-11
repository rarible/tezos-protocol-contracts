const { } = require('@completium/completium-cli');

exports.env = {
  stages: {
    mockup: {
      quiet: true,
      endpoint: 'mockup',
      originator_alias: 'completium-deploy',
      owner_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      fee_receiver_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      metadata: {
        royalties: undefined,
        transfer_proxy: undefined,
        transfer_manager: undefined,
        fill: undefined,
        exchange: undefined
      }
    },
    testnet: {
      quiet: false,
      endpoint: 'https://hangzhounet.smartpy.io',
      originator_alias: 'rarible_admin',
      owner_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee_receiver_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      metadata: {
        royalties: 'ipfs://QmXWYogA9afUcciA8KAeV8ArtVPfSQEbqppv4GPSa6ng6S',
        transfer_proxy: 'ipfs://QmQrBsY2XQn2XHkpd1gaVCE9Uy8CCRYdAXjavkmCJCYa1q',
        transfer_manager: 'ipfs://QmbffXr3cLoMMzaCqU5AiMR858X4WEyfxLD7p71HG11pqb',
        fill: 'ipfs://QmZeoyeADuWfp17884BJdqBnEXeEyXZB6FiK3mGcKTDJZh',
        exchange: 'ipfs://QmU1QKVfp5XMkv7EZNF7ir9GpMJRbiVKaDoEv1BxtD8gFC'
      }
    },
    mainnet: {
      quiet: false,
      endpoint: 'https://tezos-node.rarible.org',
      originator_alias: 'completium-deploy',
      owner_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      fee_receiver_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      metadata: {
        royalties: 'ipfs://QmTiCbNJeSCxBn6PZCSVScspj95gLMt79girvoUSMDTDdH',
        transfer_proxy: 'ipfs://QmfELb4Mss27ocueXQapH4pyxREQ7bRALsG3a3YcPxCmVo',
        transfer_manager: 'ipfs://QmPTXe6mzApc7qt4BLtRmjrGgE9QhhnSmodFzgBHWuxbX9',
        fill: 'ipfs://QmXH74QDmqWaSx2KhQJmfEQwjUf9gWrczk22E3f2NWPefa',
        exchange: 'ipfs://QmaVdGJJf5YnknVXJiCQMnefWLnQrkkuHCm3Y7JjCZFucs'
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
    }
  }
}
