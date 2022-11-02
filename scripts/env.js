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
        auctions: 'ipfs://QmP2d2x44dewFvZR1S1jeCqtGuFsezqMLQwYV7E9tE5s2U',
        auctions_storage: 'ipfs://QmNaDQQy1GS7XrCm3hSz8Hkss8LufKhqpY5ZYJSTgoFEpA',
        bids: 'ipfs://Qmb75qWPT5GAMm1vDhUkhX4gksUhWSmZ8bgMvVB1ntRnz4',
        bids_storage: 'ipfs://QmVWesdkYDAnVb7QPshmJxSV1yCgpnoYyv29QTH3GdQcAo',
        royalties: 'ipfs://QmNezxVRun6fHQMRxtjWcCV1obtEeDcmfzQGMAVNxK6f3o',
        transfer_manager: 'ipfs://QmYhCiJyuxnysNPdFhWHNKgQweZDq8qtMvefAsZAHmgVF8',
        sales: 'ipfs://QmP1TknobiPBUtEtvQcpjudeQgM6YmKjspRmf8zxHB73Gi',
        sales_storage: 'ipfs://QmZn3WK42dwnf57cdukcCGAnzaS8FLT8iPvyHUBjCVTQei',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
        sig_checker: 'ipfs://QmYsqJpf4FWQxjdaSU8FeJGW4P23qeV2hb63w8yyxJYQMH',
        aggregator_tracker: 'ipfs://QmbufY1eLhB6vbYJcJwMYQr5dSqTc6A4ur2LS9TA7ahyQi'
      }
    },
    devnet: {
      quiet: false,
      endpoint: 'https://rpc.tzkt.io/ghostnet',
      originator_alias: 'bob',
      owner_address: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
      fee_receiver_address: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
      metadata: {
        auctions: 'ipfs://QmP2d2x44dewFvZR1S1jeCqtGuFsezqMLQwYV7E9tE5s2U',
        auctions_storage: 'ipfs://QmNaDQQy1GS7XrCm3hSz8Hkss8LufKhqpY5ZYJSTgoFEpA',
        bids: 'ipfs://Qmb75qWPT5GAMm1vDhUkhX4gksUhWSmZ8bgMvVB1ntRnz4',
        bids_storage: 'ipfs://QmVWesdkYDAnVb7QPshmJxSV1yCgpnoYyv29QTH3GdQcAo',
        royalties: 'ipfs://QmNezxVRun6fHQMRxtjWcCV1obtEeDcmfzQGMAVNxK6f3o',
        transfer_manager: 'ipfs://QmYhCiJyuxnysNPdFhWHNKgQweZDq8qtMvefAsZAHmgVF8',
        sales: 'ipfs://QmP1TknobiPBUtEtvQcpjudeQgM6YmKjspRmf8zxHB73Gi',
        sales_storage: 'ipfs://QmZn3WK42dwnf57cdukcCGAnzaS8FLT8iPvyHUBjCVTQei',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
        sig_checker: 'ipfs://QmYsqJpf4FWQxjdaSU8FeJGW4P23qeV2hb63w8yyxJYQMH',
        aggregator_tracker: 'ipfs://QmbufY1eLhB6vbYJcJwMYQr5dSqTc6A4ur2LS9TA7ahyQi'
      }
    },
    testnet: {
      quiet: false,
      endpoint: 'https://rpc.tzkt.io/ghostnet',
      originator_alias: 'alice',
      owner_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee_receiver_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      metadata: {
        auctions: 'ipfs://QmP2d2x44dewFvZR1S1jeCqtGuFsezqMLQwYV7E9tE5s2U',
        auctions_storage: 'ipfs://QmNaDQQy1GS7XrCm3hSz8Hkss8LufKhqpY5ZYJSTgoFEpA',
        bids: 'ipfs://Qmb75qWPT5GAMm1vDhUkhX4gksUhWSmZ8bgMvVB1ntRnz4',
        bids_storage: 'ipfs://QmVWesdkYDAnVb7QPshmJxSV1yCgpnoYyv29QTH3GdQcAo',
        royalties: 'ipfs://QmNezxVRun6fHQMRxtjWcCV1obtEeDcmfzQGMAVNxK6f3o',
        transfer_manager: 'ipfs://QmYhCiJyuxnysNPdFhWHNKgQweZDq8qtMvefAsZAHmgVF8',
        sales: 'ipfs://QmP1TknobiPBUtEtvQcpjudeQgM6YmKjspRmf8zxHB73Gi',
        sales_storage: 'ipfs://QmZn3WK42dwnf57cdukcCGAnzaS8FLT8iPvyHUBjCVTQei',
        fa2_ft: 'ipfs://QmVdnJR2FAVWEjXhK57aMRT8GJHBETTGXJXu9yS1CWhg91',
        fa12_ft: 'ipfs://QmS6H5pc3AyWB4CP5vvFjgFHovipUgYqMKhVeEF41CqkTq',
        nft: 'ipfs://QmQZuCnXe1g2WTvzPZXS15U5gfZu8eEMuPepMpaAyUPsAq',
        sig_checker: 'ipfs://QmYsqJpf4FWQxjdaSU8FeJGW4P23qeV2hb63w8yyxJYQMH',
        aggregator_tracker: 'ipfs://QmbufY1eLhB6vbYJcJwMYQr5dSqTc6A4ur2LS9TA7ahyQi'
      }
    },
    mainnet: {
      quiet: false,
      endpoint: 'https://rpc.tzkt.io/mainnet',
      originator_alias: 'rarible-admin',
      owner_address: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
      fee_receiver_address: 'tz1gkQ4rNzPTgf1Yn3oBweWHAAvvF9VJv9hh',
      metadata: {
        auctions: 'ipfs://QmP2d2x44dewFvZR1S1jeCqtGuFsezqMLQwYV7E9tE5s2U',
        auctions_storage: 'ipfs://QmNaDQQy1GS7XrCm3hSz8Hkss8LufKhqpY5ZYJSTgoFEpA',
        bids: 'ipfs://Qmb75qWPT5GAMm1vDhUkhX4gksUhWSmZ8bgMvVB1ntRnz4',
        bids_storage: 'ipfs://QmVWesdkYDAnVb7QPshmJxSV1yCgpnoYyv29QTH3GdQcAo',
        royalties: 'ipfs://QmNezxVRun6fHQMRxtjWcCV1obtEeDcmfzQGMAVNxK6f3o',
        transfer_manager: 'ipfs://QmYhCiJyuxnysNPdFhWHNKgQweZDq8qtMvefAsZAHmgVF8',
        sales: 'ipfs://QmP1TknobiPBUtEtvQcpjudeQgM6YmKjspRmf8zxHB73Gi',
        sales_storage: 'ipfs://QmZn3WK42dwnf57cdukcCGAnzaS8FLT8iPvyHUBjCVTQei',
        sig_checker: 'ipfs://QmYsqJpf4FWQxjdaSU8FeJGW4P23qeV2hb63w8yyxJYQMH',
        aggregator_tracker: 'ipfs://QmbufY1eLhB6vbYJcJwMYQr5dSqTc6A4ur2LS9TA7ahyQi'
      }
    }
  },
  contracts: {
    royalties: {
      id: 'rarible_royalties',
      path: '../royalties-provider/contracts/royalties.arl',
    },
    transfer_manager: {
      id: 'transfer-manager',
      path: '../transfer-manager/contracts/transfer-manager.arl',
    },
    sales: {
      id: 'sales',
      path: '../onchain-sales/contracts/sales.arl',
    },
    sales_storage: {
      id: 'sales_storage',
      path: '../onchain-sales/contracts/sales-storage.arl',
    },
    auctions: {
      id: 'auctions',
      path: '../auctions/contracts/auction.arl',
    },
    auctions_storage: {
      id: 'auctions_storage',
      path: '../auctions/contracts/auction-storage.arl',
    },
    bids: {
      id: 'bids',
      path: '../bids/contracts/bids.arl',
    },
    bids_storage: {
      id: 'bids_storage',
      path: '../bids/contracts/bids-storage.arl',
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
    },
    sig_checker: {
      id: 'sig_checker',
      path: '../signature-checker/contracts/signature-checker.arl',
    },
    aggregator_tracker: {
      id: 'aggregator_tracker',
      path: '../aggregator-tracker/contracts/aggregator_tracker.arl',
    }
  }
};
