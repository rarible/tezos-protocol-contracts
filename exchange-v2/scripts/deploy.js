const { deploy, setEndpoint, getAccount, setQuiet, getContract } = require('@completium/completium-cli');
const { env } = require("./env");

let royalties;
let transfer_proxy;
let transfer_manager;
let fill;
let exchange;
let fa2_ft;
let fa12_ft;
let nft;

const stage = 'privatenet'
const prefix = 'legacy'

const PROTOCOL_FEE = 250

const getName = name => stage + '_' + prefix + '_' + name


const originator = getAccount(env.stages[stage].originator_alias);
const fee_receiver_address = env.stages[stage].fee_receiver_address
const owner_address = env.stages[stage].owner_address

setEndpoint(env.stages[stage].endpoint);

setQuiet(env.stages[stage].quiet);

// describe("Loading contracts", async () => {
//   it("Load Royalties", async () => {
//     royalties = await getContract(getName(env.contracts.royalties.id))
//   });
//   it("Load Transfer Proxy", async () => {
//     transfer_proxy = await getContract(getName(env.contracts.transfer_proxy.id))
//   });
//   it("Load Transfer Manager", async () => {
//     transfer_manager = await getContract(getName(env.contracts.transfer_manager.id))
//   });
//   it("Load Fill Storage", async () => {
//     fill = await getContract(getName(env.contracts.fill.id))
//   });
//   it("Load Exchange", async () => {
//     exchange = await getContract(getName(env.contracts.exchange.id))
//   });
// });

describe("Deploying", async () => {
  it("Deploy Royalties", async () => {
    [royalties, _] = await deploy(env.contracts.royalties.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.royalties.id),
      metadata_uri: env.stages[stage].metadata.royalties,
      as: originator.pkh
    });
  });
  it("Deploy Transfer Proxy", async () => {
    [transfer_proxy, _] = await deploy(env.contracts.transfer_proxy.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.transfer_proxy.id),
      metadata_uri: env.stages[stage].metadata.transfer_proxy,
      as: originator.pkh
    });
  });
  it("Deploy Transfer Manager", async () => {
    [transfer_manager, _] = await deploy(env.contracts.transfer_manager.path, {
      parameters: {
        owner: originator.pkh,
        default_fee_receiver: fee_receiver_address,
        protocol_fee: PROTOCOL_FEE
      },
      named: getName(env.contracts.transfer_manager.id),
      metadata_uri: env.stages[stage].metadata.transfer_manager,
      as: originator.pkh
    });
  });
  it("Deploy Fill Storage", async () => {
    [fill, _] = await deploy(env.contracts.fill.path, {
      parameters: {
        owner: originator.pkh,
      },
      named: getName(env.contracts.fill.id),
      metadata_uri: env.stages[stage].metadata.fill,
      as: originator.pkh
    });
  });
  it("Deploy Exchange", async () => {
    [exchange, _] = await deploy(env.contracts.exchange.path, {
      parameters: {
        owner: originator.pkh,
        transfer_manager: transfer_manager.address,
        royalties: royalties.address,
        fill: fill.address,
      },
      named: getName(env.contracts.exchange.id),
      metadata_uri: env.stages[stage].metadata.exchange,
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
})

describe("Linking", async () => {
  it("Link Transfer Manager to Exchange", async () => {
    await transfer_manager.add_exchange({
      arg: {
        v: exchange.address
      },
      as: originator.pkh
    })
  });
  it("Link Transfer Manager to Transfer Proxy", async () => {
    await transfer_proxy.add_user({
      arg: {
        v: transfer_manager.address
      },
      as: originator.pkh
    })
  });
  it("Link Transfer Proxy to Transfer Manager", async () => {
    await transfer_manager.set_transfer_proxy({
      arg: {
        v: transfer_proxy.address
      },
      as: originator.pkh
    })
  });
  it("Link Fill Storage to Exchange", async () => {
    await fill.add_user({
      arg: {
        v: exchange.address
      },
      as: originator.pkh
    })
  })
});


describe("Declaring ownership", async () => {

  it("Declare Ownership Royalties", async () => {
    await royalties.declare_ownership({
      arg: {
        candidate: owner_address
      },
      as: originator.pkh
    })
  });


  it("Declare Ownership Transfer Proxy", async () => {
    await transfer_proxy.declare_ownership({
      arg: {
        candidate: owner_address
      },
      as: originator.pkh
    })
  });

  it("Declare Ownership Transfer Manager", async () => {
    await transfer_manager.declare_ownership({
      arg: {
        candidate: owner_address
      },
      as: originator.pkh
    })
  });

  it("Declare Ownership Fill", async () => {
    await fill.declare_ownership({
      arg: {
        candidate: owner_address
      },
      as: originator.pkh
    })
  });

  it("Declare Ownership Exchange", async () => {
    await exchange.declare_ownership({
      arg: {
        candidate: owner_address
      },
      as: originator.pkh
    })
  });
})
