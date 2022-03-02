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
        auctions: 'ipfs://QmVBugYxi3Ssxai5qhgRPkQfPNaiSykHU9FzmQvnizA3uK',
        auctions_storage: 'ipfs://QmUaVcNn6DP3knNcnp4WDReg9r6PfNYkJZ15BZ9PVetzpx',
        bids: 'ipfs://QmQEwbNd163Rw3T9KDLUeYM5kTb479Xhj2E5cmwXTKfAZE',
        bids_storage: 'ipfs://QmVo95JtWjHVLUHJLfNswitx4XXos6nqSgyih7XWixjJcn',
        royalties: 'ipfs://QmSofEJWZh8PZfJMx4rnE5QPkA5tYf62J9jPNqj68HqGYG',
        transfer_manager: 'ipfs://QmPRAGfBUpJHEUWgkkFq93cBFJJ75pp2aXGcgUJAAyAG9w',
        sales: 'ipfs://QmenX7zhseqRj3hU6ysuz4yiwexzK4Bi7riTnuZp5hvdu3',
        sales_storage: 'ipfs://QmX1TT4Nh9hyrZSHQxEftVmA9fQvqmSKv6QDGRFhMCmTks'
      }
    },
    testnet: {
      quiet: false,
      endpoint: 'https://hangzhounet.smartpy.io',
      originator_alias: 'alice',
      owner_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee_receiver_address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      metadata: {
        auctions: 'ipfs://QmVBugYxi3Ssxai5qhgRPkQfPNaiSykHU9FzmQvnizA3uK',
        auctions_storage: 'ipfs://QmUaVcNn6DP3knNcnp4WDReg9r6PfNYkJZ15BZ9PVetzpx',
        bids: 'ipfs://QmQEwbNd163Rw3T9KDLUeYM5kTb479Xhj2E5cmwXTKfAZE',
        bids_storage: 'ipfs://QmVo95JtWjHVLUHJLfNswitx4XXos6nqSgyih7XWixjJcn',
        royalties: 'ipfs://QmSofEJWZh8PZfJMx4rnE5QPkA5tYf62J9jPNqj68HqGYG',
        transfer_manager: 'ipfs://QmPRAGfBUpJHEUWgkkFq93cBFJJ75pp2aXGcgUJAAyAG9w',
        sales: 'ipfs://QmenX7zhseqRj3hU6ysuz4yiwexzK4Bi7riTnuZp5hvdu3',
        sales_storage: 'ipfs://QmX1TT4Nh9hyrZSHQxEftVmA9fQvqmSKv6QDGRFhMCmTks'
      }
    },
    mainnet: {
      quiet: false,
      endpoint: 'https://tezos-node.rarible.org',
      originator_alias: 'completium-deploy',
      owner_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      fee_receiver_address: 'tz1PyW1EznU9ADpocaauSi41NCPynBuqf1Kc',
      metadata: {
        auctions: 'ipfs://QmVBugYxi3Ssxai5qhgRPkQfPNaiSykHU9FzmQvnizA3uK',
        auctions_storage: 'ipfs://QmUaVcNn6DP3knNcnp4WDReg9r6PfNYkJZ15BZ9PVetzpx',
        bids: 'ipfs://QmQEwbNd163Rw3T9KDLUeYM5kTb479Xhj2E5cmwXTKfAZE',
        bids_storage: 'ipfs://QmVo95JtWjHVLUHJLfNswitx4XXos6nqSgyih7XWixjJcn',
        royalties: 'ipfs://QmSofEJWZh8PZfJMx4rnE5QPkA5tYf62J9jPNqj68HqGYG',
        transfer_manager: 'ipfs://QmPRAGfBUpJHEUWgkkFq93cBFJJ75pp2aXGcgUJAAyAG9w',
        sales: 'ipfs://QmenX7zhseqRj3hU6ysuz4yiwexzK4Bi7riTnuZp5hvdu3',
        sales_storage: 'ipfs://QmX1TT4Nh9hyrZSHQxEftVmA9fQvqmSKv6QDGRFhMCmTks'
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
    }
  }
};