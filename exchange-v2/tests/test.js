

const { jsonMichelineToExpr,  packTyped, sign } = require('@completium/completium-cli');

const { XTZ, FA_2,
  mkAsset, mkOrder, mkSomeInt, mkSome, mkNone, orderType,
  mkDoTransfersArg, mkDataV1, DataV1type, checkFA12Balance, checkFA2Balance,
  mkApproveSingle, mkSetRoyaltiesByToken, mkFA2Asset, mkApproveForAllSingle } = require('./utils');


// keccack(pack("V1"))
const test = async () => {
  const ORDER_DATA_V1 = "3067ce64f894654e49d3c9c06f57d901e811f0ef0c5818fdcaf73b16a683f200";

  const XTZ_ASSET  = mkAsset(XTZ, "00", 10); // value in mutez
  const FA_2_ASSET = mkFA2Asset("KT1Ese4pa4YpyPMASzPFBVRCr1CdBPeC4aKq", 224, 1);

  const leftpubk = "edpkuxU4Nh1ddxrRJCGYV5CQrGcf2G1GU9TTL4cGpT1AicfH5Q7iJq"
  // Pair { Pair 0x00006dd3ca64fa0270aed0174ee16bbb4ef486279081 10000 } {}
  const leftdata = "050707020000002107070a0000001600006dd3ca64fa0270aed0174ee16bbb4ef48627908100909c010200000000"
  const leftsalt = "111798897518243481813626932749356287824348558190768599425035271106486243358335"
  const left  = mkOrder(mkSome(leftpubk), FA_2_ASSET, mkNone, XTZ_ASSET, leftsalt, mkNone, mkNone, ORDER_DATA_V1, leftdata);
  const lleft    = await sign(packTyped(left, orderType), { as: leftaccount.pkh });
  const leftsig  = mkSome(lleft.prefixSig);

  const rightpubk = "edpkvCHLtw71HzobSJaGM92jBjb1wmycUEFfog6cuheTVNzBEQi8ZG"
  // Pair {} {}
  const rightdata = "05070702000000000200000000"
  const rightsalt = "0"
  const right = mkOrder(mkSome(rightpubk), XTZ_ASSET, mkNone, FA_2_ASSET, rightsalt, mkNone, mkNone, ORDER_DATA_V1, rightdata);
  const rightsig = mkNone;

  const argM = mkDoTransfersArg(left, leftsig, right, rightsig);
  console.log(jsonMichelineToExpr(argM));
}
try {
  test();
} catch(e) {
  console.log(e)
}