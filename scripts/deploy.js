const { deploy, setEndpoint, getAccount, setQuiet, getContract } = require('@completium/completium-cli');
const { env } = require("./env");

let royalties;
let transfer_manager;
let auctions;
let auctions_storage;
let bids;
let bids_storage;
let sales;
let sales_storage;
let fa2_ft;
let fa12_ft;
let nft;

const stage = process.env.STAGE || 'mockup';

const PROTOCOL_FEE = 250;

const getName = name => stage + '_' + name;


const originator = getAccount(env.stages[stage].originator_alias);
const fee_receiver_address = env.stages[stage].fee_receiver_address;
const owner_address = env.stages[stage].owner_address;

setEndpoint(env.stages[stage].endpoint);

setQuiet(env.stages[stage].quiet);

describe("Contracts deployment", async () => {
  it("Deploy Royalties contract", async () => {
    [royalties, _] = await deploy(env.contracts.royalties.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.royalties.id),
      metadata_uri: env.stages[stage].metadata.royalties,
      as: originator.pkh
    });
  });

  it("Deploy Transfer Manager contract", async () => {
    [transfer_manager, _] = await deploy(env.contracts.transfer_manager.path, {
      parameters: {
        owner: originator.pkh,
        default_fee_receiver: fee_receiver_address,
        protocol_fee: PROTOCOL_FEE,
        royalties_provider: royalties.address
      },
      named: getName(env.contracts.transfer_manager.id),
      metadata_uri: env.stages[stage].metadata.transfer_manager,
      as: originator.pkh
    });
  });

  it("Deploy Sales storage contract", async () => {
    [sales_storage, _] = await deploy(env.contracts.sales_storage.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.sales_storage.id),
      metadata_uri: env.stages[stage].metadata.sales_storage,
      as: originator.pkh
    });
  });

  it("Deploy Bids storage contract", async () => {
    [bids_storage, _] = await deploy(env.contracts.bids_storage.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.bids_storage.id),
      metadata_uri: env.stages[stage].metadata.bids_storage,
      as: originator.pkh
    });
  });

  it("Deploy Auctions storage contract", async () => {
    [auctions_storage, _] = await deploy(env.contracts.auctions_storage.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.auctions_storage.id),
      metadata_uri: env.stages[stage].metadata.auctions_storage,
      as: originator.pkh
    });
  });

  it("Deploy Auctions contract", async () => {
    [auctions, _] = await deploy(env.contracts.auctions.path, {
      parameters: {
        owner: originator.pkh,
        protocol_fee: PROTOCOL_FEE,
        transfer_manager: transfer_manager.address,
        auction_storage: auctions_storage.address,
      },
      named: getName(env.contracts.auctions.id),
      metadata_uri: env.stages[stage].metadata.auctions,
      as: originator.pkh
    });
  });

  it("Deploy Bids contract", async () => {
    [bids, _] = await deploy(env.contracts.bids.path, {
      parameters: {
        owner: originator.pkh,
        protocol_fee: PROTOCOL_FEE,
        transfer_manager: transfer_manager.address,
        bids_storage: bids_storage.address,
      },
      named: getName(env.contracts.bids.id),
      metadata_uri: env.stages[stage].metadata.bids,
      as: originator.pkh
    });
  });

  it("Deploy Sales contract", async () => {
    [sales, _] = await deploy(env.contracts.sales.path, {
      parameters: {
        owner: originator.pkh,
        protocol_fee: PROTOCOL_FEE,
        transfer_manager: transfer_manager.address,
        sales_storage: sales_storage.address,
      },
      named: getName(env.contracts.sales.id),
      metadata_uri: env.stages[stage].metadata.sales,
      as: originator.pkh
    });
  });

  it("Deploy FA2 FT", async () => {
    [fa2_ft, _] = await deploy(env.contracts.fa2_ft.path, {
      parameters: {
        owner: originator.pkh
      },
      named: getName(env.contracts.fa2_ft.id),
      metadata_uri: env.stages[stage].metadata.fa2_ft,
      as: originator.pkh
    });
  });

  it("Deploy FA12 FT", async () => {
    [fa12_ft, _] = await deploy(env.contracts.fa12_ft.path, {
      parameters: {
        initialholder: originator.pkh,
        totalsupply: 99999999999999999999
      },
      named: getName(env.contracts.fa12_ft.id),
      metadata_uri: env.stages[stage].metadata.fa12_ft,
      as: originator.pkh
    });
  });

  it("Deploy NFT", async () => {
    [nft, _] = await deploy(env.contracts.nft.path, {
      parameters: {
        owner: originator.pkh
      },
      named: getName(env.contracts.nft.id),
      metadata_uri: env.stages[stage].metadata.nft,
      as: originator.pkh
    });
  });
});

describe("Contract configuration", async () => {
  it('Set auction contract for Auctions Storage', async () => {
    await auctions_storage.set_auction_contract({
      arg: {
        sac_contract: auctions.address
      },
      as: originator.pkh
    });
  });

  it('Set transfer manager for Auctions Storage', async () => {
    await auctions_storage.set_transfer_manager({
      arg: {
        stm_contract: transfer_manager.address
      },
      as: originator.pkh
    });
  });

  it('Set transfer manager for Bids storage', async () => {
    await bids_storage.set_transfer_manager({
      arg: {
        stm_contract: transfer_manager.address
      },
      as: originator.pkh
    });
  });

  it('Set auction storage for Auctions', async () => {
    await auctions.set_auction_storage_contract({
      arg: {
        sacs_contract: auctions_storage.address
      },
      as: originator.pkh
    });
  });

  it('Set royalties provider for Transfer Manager', async () => {
    await transfer_manager.set_royalties_provider({
      arg: {
        srp: royalties.address
      },
      as: originator.pkh
    });
  });

  it('Set Bids contract for Bids Storage', async () => {
    await bids_storage.set_bids_contract({
      arg: {
        sac_contract: bids.address
      },
      as: originator.pkh
    });
  });

  it('Set Bids storage for Bids', async () => {
    await bids.set_bids_storage_contract({
      arg: {
        sbsc_contract: bids_storage.address
      },
      as: originator.pkh
    });
  });

  it('Set sales contract for Sales Storage', async () => {
    await sales_storage.set_sales_contract({
      arg: {
        ssc_contract: sales.address
      },
      as: originator.pkh
    });
  });

  it('Set Sales storage for Sales contract', async () => {
    await sales.set_sales_storage({
      arg: {
        ssc_contract: sales_storage.address
      },
      as: originator.pkh
    });
  });

  it('Authorize contracts for the Transfer Manager', async () => {
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: sales.address
      },
      as: originator.pkh
    });
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: sales_storage.address
      },
      as: originator.pkh
    });
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: bids.address
      },
      as: originator.pkh
    });
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: bids_storage.address
      },
      as: originator.pkh
    });
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: auctions.address
      },
      as: originator.pkh
    });
    await transfer_manager.authorize_contract({
      arg: {
        ac_contract: auctions_storage.address
      },
      as: originator.pkh
    });
  });
});


// describe("Declaring ownership", async () => {

//   it("Declare Ownership Royalties", async () => {
//     await royalties.declare_ownership({
//       arg: {
//         candidate: owner_address
//       },
//       as: originator.pkh
//     })
//   });


//   it("Declare Ownership Transfer Proxy", async () => {
//     await transfer_proxy.declare_ownership({
//       arg: {
//         candidate: owner_address
//       },
//       as: originator.pkh
//     })
//   });

//   it("Declare Ownership Transfer Manager", async () => {
//     await transfer_manager.declare_ownership({
//       arg: {
//         candidate: owner_address
//       },
//       as: originator.pkh
//     })
//   });

//   it("Declare Ownership Fill", async () => {
//     await fill.declare_ownership({
//       arg: {
//         candidate: owner_address
//       },
//       as: originator.pkh
//     })
//   });

//   it("Declare Ownership Exchange", async () => {
//     await exchange.declare_ownership({
//       arg: {
//         candidate: owner_address
//       },
//       as: originator.pkh
//     })
//   });
// })
