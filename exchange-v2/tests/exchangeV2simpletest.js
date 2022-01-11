const { deploy, setEndpoint, getAddress, getAccount, pack, packTyped, sign,
  setQuiet, checkBalanceDelta, expectToThrow, setMockupNow } = require('@completium/completium-cli');
const { XTZ, FA_1_2, mkAsset, mkOrder, mkSomeInt, mkSome, mkNone,
  orderType, mkDoTransfersArg, checkFA12Balance, errors } = require('./utils');

let fa12;
let royalties;
let exchangeV2;
let fill;
let validator;
let transferproxy;

let fa12_address;
let royalties_address;
let exchange_address;
let fill_address;
let validator_address;
let transferproxy_address;

const start = mkSomeInt((new Date("2021-09-04T00:00:00Z").getTime() / 1000).toString());
const now = "2021-09-05T00:00:00Z";
const end = mkSomeInt((new Date("2021-09-06T00:00:00Z").getTime() / 1000).toString());

setMockupNow(new Date(now));

const mockup_mode = true;

setQuiet("true");

setEndpoint(mockup_mode ? 'mockup' : 'https://hangzhounet.smartpy.io');
// Accounts settings
const admin    = getAccount(false ? 'alice'      : "rarible_admin");
const account1 = getAccount(false ? 'bootstrap1' : "rarible_account1");
const account2 = getAccount(false ? 'bootstrap2' : "rarible_account2");

const checkEqualEpsilon = (value, target, epsilon) =>  Math.abs(value - target) < epsilon;

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
    fill_address = fill.address;
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
describe("Deploying Test Token", async () => {
  it("Deploy FA 1.2", async () => {
    [fa12, _] = await deploy('./tests/ressources/fa12.arl', {
      parameters: {
        initialholder: admin.pkh,
        totalsupply: 100000000000,
      },
      as : admin.pkh,
    });
    fa12_address = getAddress('fa12');
  });
});
describe("matchOrders", async () => {
  it("xtz orders work, rest is returned to taker", async () => {

    // transfer 100 FA 1.2 tokens to account1
    await fa12.transfer({ arg: { from: admin.pkh, to: account1.pkh, value: 100 }, as: admin.pkh, quiet: true });
    // account1 approves the exchange to transfer 100 FA 1.2 tokens
    await fa12.approve({ arg: { spender: transferproxy_address, value: 100 }, as: account1.pkh, quiet: true });

    const a = pack(fa12_address);
    const FA_1_2_100 = mkAsset(FA_1_2, a, 100);
    const XTZ_200 = mkAsset(XTZ, "00", 200000000); // value in mutez

    const salt  = 1;
    const left  = mkOrder(mkSome(account1.pubk), FA_1_2_100, mkNone, XTZ_200, salt, start, end, "ffffffff", "00");
    const right = mkOrder(mkSome(account2.pubk), XTZ_200, mkNone, FA_1_2_100, salt, start, end, "ffffffff", "00");

    const lsig    = await sign(packTyped(left, orderType), { as: account1.name });
    const leftsig = mkSome(lsig.prefixSig);

    await expectToThrow( async () => {
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
        as: account2.pkh,
        amount: "199tz"
      })
    }, errors.NOT_ENOUGH_XTZ);
    // account2's delta balance test is no exact because account2 pays fee to the blockchain for calling matchOrders
    await checkBalanceDelta(account1.pkh, 194, async () => {
    await checkBalanceDelta(account2.pkh, (d) => checkEqualEpsilon(d, -206, 0.06), async () => {
    await checkFA12Balance(fa12, account1.pkh, -100, async () => {
    await checkFA12Balance(fa12, account2.pkh,  100, async () => {
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, leftsig, right, mkNone),
        as: account2.pkh,
        amount: "206tz"
      });
    }) }) }) });
  });
  it("Deploy Fill Storage", async () => {
    [fill, _] = await deploy('./contracts/fill.arl', {
      parameters : {
        owner : admin.pkh,
      }
    });
    fill_address = fill.address;
  });
  it("Link Fill Storage to Exchange", async () => {
    await fill.add_user({
      arg : {
        v : exchange_address
      },
      as : admin.pkh
    })
  });
  it("Set Fill in Exchange", async () => {
    await exchangeV2.set_fill({
      arg : {
        a : fill_address
      },
      as : admin.pkh
    })
  })
  it("xtz orders work, rest is returned to taker (other side)", async () => {
    // transfer 100 FA 1.2 tokens to account1
    await fa12.transfer({ arg: { from: admin.pkh, to: account1.pkh, value: 100 }, as: admin.pkh, quiet: true });
    // account1 approves the exchange to transfer 100 FA 1.2 tokens
    await fa12.approve({ arg: { spender: transferproxy_address, value: 100 }, as: account1.pkh, quiet: true });

    const a = pack(fa12_address);
    const FA_1_2_100 = mkAsset(FA_1_2, a, 100);
    const XTZ_200 = mkAsset(XTZ, "00", 200000000); // value in mutez

    const salt  = 1;
    const right = mkOrder(mkSome(account1.pubk), FA_1_2_100, mkNone, XTZ_200, salt, start, end, "ffffffff", "00");
    const left  = mkOrder(mkSome(account2.pubk), XTZ_200, mkNone, FA_1_2_100, salt, start, end, "ffffffff", "00");

    // Validator is statefull, need to cancel orders
    // await exchangeV2.cancel({ argJsonMichelson : right, as : account1.pkh });
    // await exchangeV2.cancel({ argJsonMichelson : left,  as : account2.pkh });

    const lsig    = await sign(packTyped(right, orderType), { as: account1.name });
    const rightsig = mkSome(lsig.prefixSig);

    await expectToThrow( async () => {
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, mkNone, right, rightsig),
        as: account2.pkh,
        amount: "199tz"
      })
    }, errors.NOT_ENOUGH_XTZ);

    await checkBalanceDelta(account1.pkh, 194, async () => {
    await checkBalanceDelta(account2.pkh, (d) => checkEqualEpsilon(d, -206, 0.06), async () => {
    await checkFA12Balance(fa12, account1.pkh, -100, async () => {
    await checkFA12Balance(fa12, account2.pkh,  100, async () => {
      await exchangeV2.match_orders({
        argJsonMichelson: mkDoTransfersArg(left, mkNone, right, rightsig),
        as: account2.pkh,
        amount: "206tz"
      });
    }) }) }) });
  });
});
