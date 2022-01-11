const { deploy, setEndpoint, getAddress, pack, setQuiet, getAccount, setAccount } = require('@completium/completium-cli');
const { XTZ, FA_1_2, FA_2, OTHER, FEE_SIDE_NONE, FEE_SIDE_MAKE, FEE_SIDE_TAKE, mkPairs, Fungible, NotFungible, Unknown } = require('./utils');
const assert = require('assert')

setEndpoint('mockup');
const admin = getAccount('alice');
let contract;

let royalties;
let fill;

let royalties_address;
let fill_address;
let transferManager_address;

setQuiet(true);

async function getFeeSideTest(imake, itake) {
  await contract.test_getFeeSide({
    argJsonMichelson: mkPairs([imake, itake])
  });
  const storage = await contract.getStorage();
  return storage.res_getFeeSide;
}

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
    [contract, _] = await deploy('./tests/contracts/libFeeSide.arl', {
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


describe("AssetMatcher", async () => {

  it("Test : XTZ, FA_1_2; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, FA_1_2);
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : FA_1_2, XTZ; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_1_2, XTZ);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_1_2, FA_2 Fungible; MAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_1_2, FA_2(Fungible));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : FA_1_2, FA_2 NotFungible; MAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_1_2, FA_2(NotFungible));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : FA_1_2, FA_2 Unknown; MAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_1_2, FA_2(Unknown));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : FA_2 Fungible, FA_1_2; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(Fungible), FA_1_2);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_2 NotFungible, FA_1_2; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(NotFungible), FA_1_2);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_2 Unknown, FA_1_2; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(Unknown), FA_1_2);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_2 Fungible, XTZ; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(Fungible), XTZ);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_2 NotFungible, XTZ; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(NotFungible), XTZ);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : FA_2 Unknown, XTZ; TAKE wins ", async () => {
    const fee = await getFeeSideTest(FA_2(Unknown), XTZ);
    assert(fee.toNumber() == FEE_SIDE_TAKE);
  });

  it("Test : XTZ, FA_2 Fungible; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, FA_2(Fungible));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : XTZ, FA_2 NotFungible; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, FA_2(NotFungible));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : XTZ, FA_2 Unknown; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, FA_2(Unknown));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : XTZ, not Asset; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, OTHER('12345678'));
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

  it("Test : not Asset, FA_2 Unknown; NONE wins ", async () => {
    const fee = await getFeeSideTest(OTHER('12345678'), FA_2(Unknown));
    assert(fee.toNumber() == FEE_SIDE_NONE);
  });

  it("Test : not Asset, not Asset; NONE wins ", async () => {
    const fee = await getFeeSideTest(OTHER('12345678'), OTHER('87654321'));
    assert(fee.toNumber() == FEE_SIDE_NONE);
  });

  it("Test : MAKE == TAKE; MAKE wins ", async () => {
    const fee = await getFeeSideTest(XTZ, XTZ);
    assert(fee.toNumber() == FEE_SIDE_MAKE);
  });

})
