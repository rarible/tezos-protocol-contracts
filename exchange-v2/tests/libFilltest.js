const { deploy, setEndpoint, setQuiet, getAccount, jsonMichelineToExpr, getAddress } = require('@completium/completium-cli');
const assert = require('assert');
const { OTHER, mkOrder, mkNone, mkAsset, mkPairs } = require('./utils');

setQuiet("true");

const OTHER0 = OTHER('00000000')

setEndpoint('mockup');
const admin = getAccount('alice');
let contract;

let royalties;
let fill;

let royalties_address;
let fill_address;
let transferManager_address;

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
  it("Deploy Transfer Manager", async () => {
    [transferManager, _] = await deploy('./contracts/transfer_manager.arl', {
      parameters: {
        owner: admin.pkh,
        default_fee_receiver: admin.pkh,
        protocol_fee: 300
      }
    });
    transferManager_address = getAddress('transfer_manager');
  });
  it("Deploy Fill Storage", async () => {
    [fill, _] = await deploy('./contracts/fill.arl', {
      parameters: {
        owner: admin.pkh,
      }
    });
    fill_address = getAddress('fill');
  });
  it("Deploy Exchange", async () => {
    [contract, _] = await deploy('./tests/contracts/fillOrder.arl', {
      parameters: {
        owner: admin.pkh,
        transfer_manager: transferManager_address,
        royalties: royalties_address,
        fill: fill_address,
      },
      as: admin.pkh
    });
  });
});

describe("right order fill", () => {
  it("should fill fully right order if amounts are fully matched", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 50), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argJsonMichelson: mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}]) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 50);
    assert(storage.res_fillOrder.take_value.toNumber() == 100);
  });
  it("should throw if right order is fully matched, but price is not ok", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 99), mkNone, mkAsset(OTHER0, "00", 50), 1, mkNone, mkNone, "ffffffff", "00");
    try {
      await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    } catch (e) { assert(true) }
  });
  it("should fill right order and return profit if more than needed", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 101), mkNone, mkAsset(OTHER0, "00", 50), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 50);
    assert(storage.res_fillOrder.take_value.toNumber() == 100);
  });
})
describe("left order fill", () => {
  it("should fill orders when prices match exactly", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 400), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 100);
    assert(storage.res_fillOrder.take_value.toNumber() == 200);
  });

  it("should fill orders when right order has better price", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 1000), mkNone, mkAsset(OTHER0, "00", 2000), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 4001), mkNone, mkAsset(OTHER0, "00", 2000), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 1000);
    assert(storage.res_fillOrder.take_value.toNumber() == 2000);
  });

  it("should throw if price is not ok", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 1000), mkNone, mkAsset(OTHER0, "00", 2000), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 3990), mkNone, mkAsset(OTHER0, "00", 2000), 1, mkNone, mkNone, "ffffffff", "00");

    try {
      await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
      assert(false, "invalid");
    } catch (e) { assert(true) }
  });
});
describe("both orders fill", () => {
  it("should fill orders when prices match exactly", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 200), mkNone, mkAsset(OTHER0, "00", 100), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 100);
    assert(storage.res_fillOrder.take_value.toNumber() == 200);
  });

  it("should fill orders when right order has better price", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 300), mkNone, mkAsset(OTHER0, "00", 100), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 100);
    assert(storage.res_fillOrder.take_value.toNumber() == 200);
  });

  it("should fill orders when right order has better price with less needed amount", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 300), mkNone, mkAsset(OTHER0, "00", 50), 1, mkNone, mkNone, "ffffffff", "00");

    await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
    var storage = await contract.getStorage();
    assert(storage.res_fillOrder.make_value.toNumber() == 50);
    assert(storage.res_fillOrder.take_value.toNumber() == 100);
  });

  it("should throw if price is not ok", async () => {
    const left = mkOrder(mkNone, mkAsset(OTHER0, "00", 100), mkNone, mkAsset(OTHER0, "00", 200), 1, mkNone, mkNone, "ffffffff", "00");
    const right = mkOrder(mkNone, mkAsset(OTHER0, "00", 199), mkNone, mkAsset(OTHER0, "00", 100), 1, mkNone, mkNone, "ffffffff", "00");

    try {
      await contract.test_fillOrder({ argMichelson: jsonMichelineToExpr(mkPairs([left, right, { int: 0 }, { int: 0 }, {prim: "False"}, {prim: "False"}])) });
      assert(false, "invalid");
    } catch (e) { assert(true) }
  });
})
