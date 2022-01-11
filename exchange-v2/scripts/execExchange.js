const { setEndpoint, getAccount, packTyped, sign, setQuiet, call } = require('@completium/completium-cli');
const { mkOrder, mkSome, mkNone, orderType, mkDoTransfersArg, mkFA2Asset } = require('../tests/utils');

setQuiet(false);

setEndpoint('https://granadanet.smartpy.io');
// Accounts settings
const admin = getAccount("ubisoft_admin");
const leftaccount = getAccount("ubisoft_left");
const rightaccount = getAccount("ubisoft_right");

const test = async () => {
  const tokenId = "112713831013335031851997494790091580767206847959666047074630770863777529473439"
  const RaribleExchangeV2 = "KT1CfvTiEz9EVBLBLLYYFvRTwqyLsCvoZtWm"
  const USDCfAddress = "KT1HT3EbSPFA1MM2ZiMThB6P6Kky5jebNgAx"
  const QUartzAddress = "KT1Caj4ZXbop5AswuH4RAv61rMVEeVdtFk4f"
  const FA_2_USDC = mkFA2Asset(USDCfAddress, 0, 20000000);
  const FA_2_QUARTZ = mkFA2Asset(QUartzAddress, tokenId, 1);
  const salt = 1;
  const left = mkOrder(mkSome(leftaccount.pubk), FA_2_QUARTZ, mkNone, FA_2_USDC, salt, mkNone, mkNone, "ffffffff", "00");
  const right = mkOrder(mkSome(rightaccount.pubk), FA_2_USDC, mkNone, FA_2_QUARTZ, salt, mkNone, mkNone, "ffffffff", "00");
  const lleft = await sign(packTyped(left, orderType), { as: leftaccount.name });
  const leftsig = mkSome(lleft.prefixSig);
  const lright = await sign(packTyped(right, orderType), { as: rightaccount.name });
  const rightsig = mkSome(lright.prefixSig);
  const argM = mkDoTransfersArg(left, leftsig, right, rightsig);
  // console.log(jsonMichelineToExpr(argM));
  try {
    await call(RaribleExchangeV2, {
      entry: "matchOrders",
      argJsonMichelson: argM,
      as: admin.pkh,
      force_tezos_client: true,
      // dry: true,
    })
  } catch (e) {
    console.log(e)
    console.log(JSON.stringify(e, 0, 2))
  }
}

test()
