const { deploy, setEndpoint, getAddress, getAccount, pack,
  packTyped, sign, setQuiet, checkBalanceDelta } = require('@completium/completium-cli');
const { XTZ, FA_1_2,
  mkAsset, mkOrder, mkSomeInt, mkSome, mkNone, orderType,
  mkDoTransfersArg, mkDataV1, DataV1type, mkDataV2, DataV2type, checkFA12Balance, checkFA2Balance,
  mkApproveSingle, mkSetRoyaltiesByToken, mkFA2Asset, mkApproveForAllSingle, Fungible, NotFungible } = require('./utils');

let fa12_1;
let fa12_2;
let fa2;
let royalties;
let exchangeV2;
let fill;
let validator;
let transferproxy;

let fa12_1_address;
let fa12_2_address;
let fa2_address;
let royalties_address;
let exchange_address;
let fill_address;
let validator_address;
let transferproxy_address;

const FA2TokenId1 = 54;
const FA2TokenId2 = 55;

const FA2TokenId3 = 63;
const FA2TokenId4 = 64;

const checkEqualEpsilon = (value, target, epsilon) => Math.abs(value - target) < epsilon;

setQuiet("false");

const mockup_mode = true;

setEndpoint(mockup_mode ? 'mockup' : 'https://hangzhounet.smartpy.io');
// Accounts settings
const admin = getAccount(false ? 'alice' : "rarible_admin");
const account1 = getAccount(false ? 'bootstrap1' : "rarible_account1");
const account2 = getAccount(false ? 'bootstrap2' : "rarible_account2");
const account3 = getAccount(false ? 'bootstrap3' : "rarible_account3");
const account4 = getAccount(false ? 'bootstrap4' : "rarible_account4");
const account5 = getAccount(false ? 'bootstrap5' : "rarible_account5");
const account6 = getAccount(false ? 'bob' : "rarible_account6");
const account7 = getAccount(false ? 'carl' : "rarible_account7");

// keccack(pack("V1"))
const ORDER_DATA_V1 = "3067ce64f894654e49d3c9c06f57d901e811f0ef0c5818fdcaf73b16a683f200";

// keccack(pack("V2"))
const ORDER_DATA_V2 = "66c4287e20f49d8160bbf89f88972b3545568b60cd77081f38cded95949ee9c8"

describe("Deploying", async () => {
  it("Deploy Royalties", async () => {
    [royalties, _] = await deploy('./contracts/royalties.arl', {
      parameters: {
        owner: admin.pkh,
      },
      as: admin.pkh
    });
    royalties_address = getAddress('royalties');
  });
  it("Deploy Transfer Proxy", async () => {
    [transferproxy, _] = await deploy('./contracts/transfer_proxy.arl', {
      parameters : {
        owner : admin.pkh,
      },
    });
    transferproxy_address = getAddress('transfer_proxy');
  });
  it("Deploy Transfer Manager", async () => {
    [transferManager, _] = await deploy('./contracts/transfer_manager.arl', {
      parameters : {
        owner : admin.pkh,
        default_fee_receiver: admin.pkh,
        protocol_fee: 300
      }
    });
    transferManager_address = getAddress('transfer_manager');
  });
  it("Deploy Fill Storage", async () => {
    [fill, _] = await deploy('./contracts/fill.arl', {
      parameters : {
        owner : admin.pkh,
      }
    });
    fill_address = getAddress('fill');
  });
  it("Deploy Exchange", async () => {
    [exchangeV2, _] = await deploy('./contracts/exchange.arl', {
      parameters: {
        owner: admin.pkh,
        transfer_manager : transferManager_address,
        royalties: royalties_address,
        fill : fill_address,
      },
      as: admin.pkh
    });
    exchange_address = getAddress('exchange');
  });
  it("Link Transfer Manager to Exchange", async () => {
    await transferManager.add_exchange({
      arg : {
        v : exchange_address
      },
      as: admin.pkh
    })
  });
  it("Link Transfer Manager to Transfer Proxy", async () => {
    await transferproxy.add_user({
      arg : {
        v : transferManager_address
      },
      as : admin.pkh
    })
  });
  it("Link Transfer Proxy to Transfer Manager", async () => {
    await transferManager.set_transfer_proxy({
      arg : {
        v : transferproxy_address
      },
      as : admin.pkh
    })
  });
  it("Link Fill Storage to Exchange", async () => {
    await fill.add_user({
      arg : {
        v : exchange_address
      },
      as : admin.pkh
    })
  })
});
describe("Deploying Test Tokens", async () => {
  it("Deploy 2 FA 1.2(s)", async () => {
    [fa12_1, _] = await deploy('./tests/ressources/fa12.arl', {
      parameters: {
        initialholder: admin.pkh,
        totalsupply: 100000000000,
      },
      named: 'fa12_1',
      as: admin.pkh,
    });
    let storage = await fa12_1.getStorage();
    let i = 1;
    fa12_1_address = getAddress('fa12_1');
    [fa12_2, _] = await deploy('./tests/ressources/fa12.arl', {
      parameters: {
        initialholder: admin.pkh,
        totalsupply: 100000000000,
      },
      named: 'fa12_2',
      as: admin.pkh
    });
    fa12_2_address = getAddress('fa12_2');
  });
  it("Deploy FA 2", async () => {
    [fa2, _] = await deploy('./tests/ressources/fa2.arl', {
      parameters: {
        owner: admin.pkh,
        royaltiesContract: royalties_address
      },
      as: admin.pkh
    });
    fa2_address = fa2.address;
  });
  it("Link FA2 to Royalties Manager", async () => {
    await royalties.add_user({
      arg : {
        v : fa2_address
      },
      as : admin.pkh
    })
  })
});

describe("MatchOrders", async () => {

  /////////////////////////////////////////////////////////////////////////////////////////
  // V2 scenario
  /////////////////////////////////////////////////////////////////////////////////////////
  describe("matchOrders, orderType = V2", () => {
    it("should correctly calculate take-side fill for isMakeFill = false ", async () => {
      const seller = account1;
      const buyer  = account2;
      const buyer1 = account3;
      //const seller = accounts[1];
      //const buyer = accounts[2];
      //const buyer1 = accounts[3];
      await fa2.mint({ arg : { itokenid : FA2TokenId1, iowner : seller.pkh, iamount : 200, royalties: [] } , as: admin.pkh });
      await fa2.update_operators_for_all({ argJsonMichelson: mkApproveForAllSingle(transferproxy_address), as : seller.pkh });
      //await erc1155_v2.mint(seller, erc1155TokenId1, [], 200);
      //await erc1155_v2.setApprovalForAll(transferProxy.address, true, { from: seller });
      const encDataLeft  = packTyped(mkDataV2([], [], false),  DataV2type);
      const encDataRight = packTyped(mkDataV2([], [], false),  DataV2type);
      //const encDataLeft = await encDataV2([[], [], false]);
      //const encDataRight = await encDataV2([[], [], false]);
      const FA_2_ASSET_200  = mkFA2Asset(Fungible, fa2_address, FA2TokenId1, 200);
      const FA_2_ASSET_100  = mkFA2Asset(Fungible, fa2_address, FA2TokenId1, 100);
      const XTZ_ASSET_1000  = mkAsset(XTZ, "00", 1000000000);
      const XTZ_ASSET_500   = mkAsset(XTZ, "00", 500000000);
      const left  = mkOrder(mkSome(seller.pubk), FA_2_ASSET_200, mkNone, XTZ_ASSET_1000, 1, mkNone, mkNone, ORDER_DATA_V2, encDataLeft);
      const right = mkOrder(mkSome(buyer.pubk),  XTZ_ASSET_500, mkNone, FA_2_ASSET_100, 1, mkNone, mkNone, ORDER_DATA_V2, encDataRight);
      //const left = Order(seller, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 200), ZERO, Asset(ETH, "0x", 1000), 1, 0, 0, ORDER_DATA_V2, encDataLeft);
      //const right = Order(buyer, Asset(ETH, "0x", 500), ZERO, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 100), 1, 0, 0, ORDER_DATA_V2, encDataRight);
      let lsig    = await sign(packTyped(left, orderType), { as: account1.name });
      let leftsig = mkSome(lsig.prefixSig);
      await checkBalanceDelta(seller.pkh, (d) => checkEqualEpsilon(d, 485, 0.05), async () => {
      await checkBalanceDelta(buyer.pkh,  (d) => checkEqualEpsilon(d, -515, 0.07), async () => {
      await checkFA2Balance(fa2, FA2TokenId1, seller.pkh, -100, async () => {
      await checkFA2Balance(fa2, FA2TokenId1, buyer.pkh,   100, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
          as: buyer.pkh,
          amount : "600tz"
        })
      }) }) }) });
      //await verifyBalanceChange(seller, -485, async () =>
      //  verifyBalanceChange(buyer, 515, async () =>
      //    testing.matchOrders(left, await getSignature(left, seller), right, "0x", { from: buyer, value: 600, gasPrice: 0 })
      //  )
      //)
      //assert.equal(await erc1155_v2.balanceOf(buyer, erc1155TokenId1), 100);
      //assert.equal(await erc1155_v2.balanceOf(seller, erc1155TokenId1), 100);
      //const leftOrderHash = await libOrder.hashKey(left);
      //assert.equal(await testing.fills(leftOrderHash), 500, "left fill make side")
      const XTZ_ASSET_2000  = mkAsset(XTZ, "00", 2000000000);
      const left1  = mkOrder(mkSome(seller.pubk), FA_2_ASSET_200, mkNone, XTZ_ASSET_2000, 1, mkNone, mkNone, ORDER_DATA_V2, encDataLeft);
      const right1 = mkOrder(mkSome(buyer1.pubk),  XTZ_ASSET_1000, mkNone, FA_2_ASSET_100, 1, mkNone, mkNone, ORDER_DATA_V2, encDataRight);
      //const left1 = Order(seller, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 200), ZERO, Asset(ETH, "0x", 2000), 1, 0, 0, ORDER_DATA_V2, encDataLeft);
      //const right1 = Order(buyer1, Asset(ETH, "0x", 1000), ZERO, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 100), 1, 0, 0, ORDER_DATA_V2, encDataRight);
      lsig    = await sign(packTyped(left1, orderType), { as: account1.name });
      leftsig = mkSome(lsig.prefixSig);
      await checkBalanceDelta(seller.pkh, (d) => checkEqualEpsilon(d, 970, 0.05), async () => {
      await checkBalanceDelta(buyer1.pkh, (d) => checkEqualEpsilon(d, -1030, 0.05), async () => {
      await checkFA2Balance(fa2, FA2TokenId1, seller.pkh, -100, async () => {
      await checkFA2Balance(fa2, FA2TokenId1, buyer1.pkh,   100, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left1, leftsig, right1, mkNone),
          as: buyer1.pkh,
          amount : "1100tz"
        })
      }) }) }) });
      //await verifyBalanceChange(seller, -970, async () =>
      //  verifyBalanceChange(buyer1, 1030, async () =>
      //    testing.matchOrders(left1, await getSignature(left1, seller), right1, "0x", { from: buyer1, value: 1100, gasPrice: 0 })
      //  )
      //)
      //assert.equal(await erc1155_v2.balanceOf(buyer1, erc1155TokenId1), 100);
      //assert.equal(await erc1155_v2.balanceOf(seller, erc1155TokenId1), 0);
      //assert.equal(await testing.fills(leftOrderHash), 1500, "left fill make side 1")
    })
  })
});
