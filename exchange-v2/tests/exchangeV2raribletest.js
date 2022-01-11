const { deploy, setEndpoint, getAddress, getAccount, pack,
  packTyped, sign, setQuiet, checkBalanceDelta, expectToThrow, getContract } = require('@completium/completium-cli');
const { XTZ, FA_1_2,
  mkAsset, mkOrder, mkSomeInt, mkSome, mkNone, orderType,
  mkDoTransfersArg, mkDataV1, DataV1type, mkDataV2, DataV2type, checkFA12Balance, checkFA2Balance,
  mkApproveSingle, mkSetRoyaltiesByToken, mkFA2Asset, mkApproveForAllSingle, Fungible, NotFungible, errors } = require('./utils');
const { env } = require('../scripts/env.js');

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

const stage = 'mockup'
const prefix = 'deploy'

const getName = name => stage + '_' + prefix + '_' + name

// describe("Loading contracts", async () => {
//   it("Load Royalties", async () => {
//     royalties = await getContract(getName(env.contracts.royalties.id));
//     royalties_address = royalties.address;
//   });
//   it("Load Transfer Proxy", async () => {
//     transferproxy = await getContract(getName(env.contracts.transfer_proxy.id));
//     transferproxy_address = transferproxy.address;
//   });
//   it("Load Transfer Manager", async () => {
//     transferManager = await getContract(getName(env.contracts.transfer_manager.id));
//     transferManager_address = transferManager.address;
//   });
//   it("Load Fill Storage", async () => {
//     fill = await getContract(getName(env.contracts.fill.id));
//     fill_address = fill.address;
//   });
//   it("Load Exchange", async () => {
//     exchangeV2 = await getContract(getName(env.contracts.exchange.id));
//     exchange_address = exchangeV2.address;
//   });
// });

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
    fa2_address = getAddress('fa2');
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
  it("xtz orders work, rest is returned to taker with 3% fee (other side)", async () => {
    // transfer 100 FA 1.2 tokens to account1
    await fa12_1.transfer({ arg: { from: admin.pkh, to: account1.pkh, value: 100 }, as: admin.pkh });
    await fa12_1.transfer({ arg: { from: admin.pkh, to: account2.pkh, value: 100 }, as: admin.pkh });
    // account1 approves the exchange to transfer 100 FA 1.2 tokens
    await fa12_1.approve({ arg: { spender: transferproxy_address, value: 100 }, as: account1.pkh });

    const a = pack(fa12_1_address);
    const FA_1_2_100 = mkAsset(FA_1_2, a, 100);
    const XTZ_200 = mkAsset(XTZ, "00", 200000000); // value in mutez

    const salt = 1;
    const right = mkOrder(mkSome(account1.pubk), FA_1_2_100, mkNone, XTZ_200, salt, mkNone, mkNone, "ffffffff", "00");
    const left = mkOrder(mkSome(account2.pubk), XTZ_200, mkNone, FA_1_2_100, salt, mkNone, mkNone, "ffffffff", "00");

    const lsig = await sign(packTyped(right, orderType), { as: account1.name });
    const rightsig = mkSome(lsig.prefixSig);

    await expectToThrow(async () => {
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, mkNone, right, rightsig),
        as: account2.pkh,
        amount: "199tz"
      })
    }, errors.NOT_ENOUGH_XTZ)

    await checkBalanceDelta(account1.pkh, 194, async () => {
    await checkBalanceDelta(account2.pkh, (d) => checkEqualEpsilon(d, -206, 0.05), async () => {
    await checkBalanceDelta(admin.pkh, 12, async () => {
    await checkFA12Balance(fa12_1, account1.pkh, -100, async () => {
    await checkFA12Balance(fa12_1, account2.pkh, 100, async () => {
      await exchangeV2.match_orders({
              argJsonMichelson: mkDoTransfersArg(left, mkNone, right, rightsig),
              as: account2.pkh,
              amount: "300tz"
      });
    }) }) }) }) });
  });

  describe("Do matchOrders(), orders dataType == V1", () => {
    it("From FA 1.2(100) to FA 1.2(200) Protocol, Origin fees, no Royalties ", async () => {
   		const { left, right } = await prepare2Orders();

      const lsig    = await sign(packTyped(left, orderType), { as: account1.name });
      const leftsig = mkSome(lsig.prefixSig);

      const arg = mkDoTransfersArg(left, leftsig, right, mkNone);

      await checkFA12Balance(fa12_1, account1.pkh, -104, async () => {
      await checkFA12Balance(fa12_1, account2.pkh,   95, async () => {
      await checkFA12Balance(fa12_1, account3.pkh,    1, async () => {
      await checkFA12Balance(fa12_1, account4.pkh,    2, async () => {
      await checkFA12Balance(fa12_2, account1.pkh,  200, async () => {
      await checkFA12Balance(fa12_2, account2.pkh, -200, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
          as: account2.pkh
        });
      }) }) }) }) }) });

   //    // TODO
   //		//assert.equal(await testing.fills(await libOrder.hashKey(left)), 200);
    })

   	it("From FA 1.2(100) to FA 1.2(200) Protocol, no fees because of rounding", async () => {
   		const { left, right } = await prepare2Orders(10, 20, 10, 20, 2)

      const lsig    = await sign(packTyped(left, orderType), { as: account1.name });
      const leftsig = mkSome(lsig.prefixSig);

      await checkFA12Balance(fa12_1, account1.pkh,  -10, async () => {
      await checkFA12Balance(fa12_1, account2.pkh,   10, async () => {
      await checkFA12Balance(fa12_2, account1.pkh,   20, async () => {
      await checkFA12Balance(fa12_2, account2.pkh,  -20, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
          as: account2.pkh
        })
      }) }) }) });

   	})
    async function prepare2Orders(t1Amount = 104, t2Amount = 200, makeAmount = 100, takeAmount = 200, salt = 1) {
      await fa12_1.transfer({ arg: { from: admin.pkh, to: account1.pkh, value: t1Amount }, as: admin.pkh });
      await fa12_2.transfer({ arg: { from: admin.pkh, to: account2.pkh, value: t2Amount }, as: admin.pkh });

      await fa12_1.approve({ arg: { spender: transferproxy_address, value: t1Amount }, as: account1.pkh });
      await fa12_2.approve({ arg: { spender: transferproxy_address, value: t2Amount }, as: account2.pkh });

      let addrOriginLeft =[[account3.pkh, makeAmount]];
      let addrOriginRight = [[account4.pkh, takeAmount]];
      let encDataLeft  = packTyped(mkDataV1([[account1.pkh, 10000]], addrOriginLeft),  DataV1type);
      let encDataRight = packTyped(mkDataV1([[account2.pkh, 10000]], addrOriginRight), DataV1type);

      const FA_1_2_1 = mkAsset(FA_1_2, pack(fa12_1_address), makeAmount);
      const FA_1_2_2 = mkAsset(FA_1_2, pack(fa12_2_address), takeAmount);
      const left  = mkOrder(mkSome(account1.pubk), FA_1_2_1, mkNone, FA_1_2_2, salt, mkNone, mkNone, ORDER_DATA_V1, encDataLeft);
      const right = mkOrder(mkSome(account2.pubk), FA_1_2_2, mkNone, FA_1_2_1, salt, mkNone, mkNone, ORDER_DATA_V1, encDataRight);

      return { left, right }
    }
    it("From FA 1.2(DataV1) to FA2(RoyaltiesV2, DataV1) Protocol, Origin fees, Royalties ", async () => {
   		const { left, right } = await prepareFA1_2_FA_2_Orders();

      const lsig    = await sign(packTyped(left, orderType), { as: account1.name });
      const leftsig = mkSome(lsig.prefixSig);

      await checkFA12Balance(fa12_1, account1.pkh, -110, async () => {
      await checkFA12Balance(fa12_1, account2.pkh,   77, async () => {
      await checkFA12Balance(fa12_1, account3.pkh,    3, async () => {
      await checkFA12Balance(fa12_1, account4.pkh,    4, async () => {
      await checkFA12Balance(fa12_1, account5.pkh,    5, async () => {
      await checkFA12Balance(fa12_1, account6.pkh,   10, async () => {
      await checkFA12Balance(fa12_1, account7.pkh,    5, async () => {
      await checkFA12Balance(fa12_1, admin.pkh,       6, async () => {
      await checkFA2Balance(fa2, FA2TokenId1, account1.pkh,  7, async () => {
      await checkFA2Balance(fa2, FA2TokenId1, account2.pkh, -7, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
          as: account2.pkh
        })
      }) }) }) }) }) }) }) }) }) });

      // TODO
   		// assert.equal(await testing.fills(await libOrder.hashKey(left)), 7);
   	})

   	async function prepareFA1_2_FA_2_Orders(t1Amount = 120, t2Amount = 10) {
      await fa12_1.transfer({ arg: { from: admin.pkh, to: account1.pkh, value: t1Amount }, as: admin.pkh });
      await fa2.mint({ arg : { itokenid : FA2TokenId1, iowner : account2.pkh, iamount : t2Amount, royalties: [[account6.pkh, 1000], [account7.pkh, 500]] } , as: admin.pkh });
      await fa12_1.approve({ arg : { spender: transferproxy_address, value: t1Amount }, as: account1.pkh });
      // await fa2.update_operators({
      //   argJsonMichelson: mkApproveSingle(account2.pkh, exchange_address, FA2TokenId1),
      //   as : account2.pkh
      // });
      await fa2.update_operators_for_all({
        argJsonMichelson: mkApproveForAllSingle(transferproxy_address),
        as : account2.pkh
      });

      let addrOriginLeft  = [[account3.pkh, 300], [account4.pkh, 400]];
      let addrOriginRight = [[account5.pkh, 500]];

      let encDataLeft  = packTyped(mkDataV1([[account1.pkh, 10000]], addrOriginLeft),  DataV1type);
      let encDataRight = packTyped(mkDataV1([[account2.pkh, 10000]], addrOriginRight), DataV1type);

      // await royalties.setRoyalties({
      //   argJsonMichelson : mkSetRoyaltiesByToken(fa2_address, FA2TokenId1, [[account6.pkh, 1000], [account7.pkh, 500]])
      // });

      const FA_1_2_ASSET = mkAsset(FA_1_2, pack(fa12_1_address), 100);
      const FA_2_ASSET   = mkFA2Asset(NotFungible, fa2_address, FA2TokenId1, 7);
      let salt = 1;
      const left  = mkOrder(mkSome(account1.pubk), FA_1_2_ASSET, mkNone, FA_2_ASSET, salt, mkNone, mkNone, ORDER_DATA_V1, encDataLeft);
      const right = mkOrder(mkSome(account2.pubk), FA_2_ASSET, mkNone, FA_1_2_ASSET, salt, mkNone, mkNone, ORDER_DATA_V1, encDataRight);

   		return { left, right }
   	}
  })

  describe("Functori feedbacks", () => {
    it("Simple fa2 exchange with data V1", async () => {
      await fa2.mint({ arg : { itokenid : FA2TokenId3, iowner : account1.pkh, iamount : 1, royalties: [] } , as: admin.pkh });
      await fa2.mint({ arg : { itokenid : FA2TokenId4, iowner : account2.pkh, iamount : 1, royalties: [] } , as: admin.pkh });
      await fa2.update_operators_for_all({ argJsonMichelson: mkApproveForAllSingle(transferproxy_address), as : account1.pkh });
      await fa2.update_operators_for_all({ argJsonMichelson: mkApproveForAllSingle(transferproxy_address), as : account2.pkh });
      const FA_2_ASSET_3 = mkFA2Asset(NotFungible, fa2_address, FA2TokenId3, 1);
      const FA_2_ASSET_4 = mkFA2Asset(NotFungible, fa2_address, FA2TokenId4, 1);
      let salt = 10;
      const data_left  = packTyped(mkDataV1([], []), DataV1type);
      const data_right = packTyped(mkDataV1([], []), DataV1type);
      const left  = mkOrder(mkSome(account1.pubk), FA_2_ASSET_3, mkNone, FA_2_ASSET_4, salt, mkNone, mkNone, ORDER_DATA_V1, data_left);
      const right = mkOrder(mkSome(account2.pubk), FA_2_ASSET_4, mkNone, FA_2_ASSET_3, salt, mkNone, mkNone, ORDER_DATA_V1, data_right);
      const lsig    = await sign(packTyped(left, orderType), { as: account1.name });
      const leftsig = mkSome(lsig.prefixSig);
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
        as: account2.pkh
      });
    })
  });
  /////////////////////////////////////////////////////////////////////////////////////////
  // V2 scenario
  /////////////////////////////////////////////////////////////////////////////////////////
  describe("matchOrders, orderType = V2", () => {
    it("should correctly calculate make-side fill for isMakeFill = true ", async () => {
      const seller = account1;
      const buyer  = account2;
      const buyer1 = account3;
      await fa2.mint({ arg : { itokenid : FA2TokenId1, iowner : seller.pkh, iamount : 200, royalties: [] } , as: admin.pkh });
      await fa2.update_operators_for_all({ argJsonMichelson: mkApproveForAllSingle(transferproxy_address), as : seller.pkh });
      //await erc1155_v2.mint(seller, erc1155TokenId1, [], 200);
      //await erc1155_v2.setApprovalForAll(transferProxy.address, true, { from: seller });
      const encDataLeft  = packTyped(mkDataV2([], [], true),  DataV2type);
      const encDataRight = packTyped(mkDataV2([], [], false), DataV2type);
      //const encDataLeft = await encDataV2([[], [], true]);
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
      await checkBalanceDelta(seller.pkh, (d) => checkEqualEpsilon(d, 485,  0.05), async () => {
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
      //assert.equal(await testing.fills(leftOrderHash), 100, "left fill make side")
      //const test_hash = await libOrder.hashV2(seller, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 200), Asset(ETH, "0x", 1000), 1, encDataLeft)
      //assert.equal(leftOrderHash, test_hash, "correct hash for V2")
      const XTZ_ASSET_600   = mkAsset(XTZ, "00", 600000000);
      const XTZ_ASSET_300   = mkAsset(XTZ, "00", 300000000);
      const left1  = mkOrder(mkSome(seller.pubk), FA_2_ASSET_200, mkNone, XTZ_ASSET_600, 1, mkNone, mkNone, ORDER_DATA_V2, encDataLeft);
      const right1 = mkOrder(mkSome(buyer1.pubk),  XTZ_ASSET_300, mkNone, FA_2_ASSET_100, 1, mkNone, mkNone, ORDER_DATA_V2, encDataRight);
      //const left1 = mkOrder(seller, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 200), ZERO, Asset(ETH, "0x", 600), 1, 0, 0, ORDER_DATA_V2, encDataLeft);
      //const right1 = Order(buyer1, Asset(ETH, "0x", 300), ZERO, Asset(ERC1155, enc(erc1155_v2.address, erc1155TokenId1), 100), 1, 0, 0, ORDER_DATA_V2, encDataRight);
      lsig    = await sign(packTyped(left1, orderType), { as: account1.name });
      leftsig = mkSome(lsig.prefixSig);
      await checkBalanceDelta(seller.pkh, (d) => checkEqualEpsilon(d, 291,  0.05), async () => {
      await checkBalanceDelta(buyer1.pkh, (d) => checkEqualEpsilon(d, -309,  0.05), async () => {
      await checkFA2Balance(fa2, FA2TokenId1, seller.pkh, -100, async () => {
      await checkFA2Balance(fa2, FA2TokenId1, buyer1.pkh,  100, async () => {
        await exchangeV2.match_orders({
          argJsonMichelson: mkDoTransfersArg(left1, leftsig, right1, mkNone),
          as: buyer1.pkh,
          amount : "600tz"
        })
      }) }) }) });
      //await verifyBalanceChange(seller, -291, async () =>
      //  verifyBalanceChange(buyer1, 309, async () =>
      //    testing.matchOrders(left1, await getSignature(left1, seller), right1, "0x", { from: buyer1, value: 600, gasPrice: 0 })
      //  )
      //)
      //assert.equal(await testing.fills(leftOrderHash), 200, "left fill make side 1")
      //assert.equal(await erc1155_v2.balanceOf(buyer1, erc1155TokenId1), 100);
      //assert.equal(await erc1155_v2.balanceOf(seller, erc1155TokenId1), 0);
    })
    /*it("Reinit fill data", async () => {
      [fill, _] = await deploy('../contracts/fill.arl', {
        parameters : {
          admin : admin.pkh,
          validator : null // none (link is done below)
        }
      });
      fill_address = getAddress('fill');
      [validator, _] = await deploy('../contracts/validator.arl', {
        parameters: {
          owner : admin.pkh,
          exchangeV2: exchange_address,
          royaltiesContract: royalties_address,
          fill : fill_address,
        },
        as: admin.pkh,
      });
      validator_address = getAddress('validator');
      await exchangeV2.setValidator({ arg: { ivalidator: validator_address }, as: admin.pkh });
      await fill.setValidator({
        arg : {
          v : validator_address
        },
        as : admin.pkh
      })
    })*/
  })
});
