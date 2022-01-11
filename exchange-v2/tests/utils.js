const { exprMichelineToJson, packTyped, getAccount, getValueFromBigMap } = require('@completium/completium-cli');

// or unit (or unit (or unit (or unit bytes)))
exports.XTZ = {
  prim: 'Left',
  args: [
    { prim: 'Unit' }
  ]
};
exports.FA_1_2 = {
  prim: 'Right',
  args: [
    {
      prim: 'Left',
      args: [
        { prim: 'Unit' }
      ]
    }
  ]
};

exports.Fungible    = 0
exports.NotFungible = 1
exports.Unknown     = 2

const FA_2 = (fa2t) =>{
  return {
    prim: 'Right',
    args: [
      {
        prim: 'Right',
        args: [
          {
            prim: 'Left',
            args: [
              { int: ""+fa2t }
            ]
          }
        ]
      }
    ]
  }
};
exports.FA_2 = FA_2

exports.OTHER = x => {
  return {
    prim: 'Right',
    args: [
      {
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Right',
                args: [
                  { bytes: x }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

exports.FEE_SIDE_NONE = 0;
exports.FEE_SIDE_MAKE = 1;
exports.FEE_SIDE_TAKE = 2;

exports.packPair = (l, tl, r, tr) => {
  let pair = exprMichelineToJson("(Pair \"" + l + "\" \"" + r + "\")");
  let typ = exprMichelineToJson("(pair " + tl + " " + tr + ")");
  return packTyped(pair, typ);
}

exports.mkSome = (v) => {
  return {
    prim: 'Some',
    args: [{ string: v }]
  }
}

exports.mkSomeInt = (v) => {
  return {
    prim: 'Some',
    args: [{ int: v }]
  }
}

exports.mkNone = { prim: 'None' }

exports.mkAssetType = (assetclass, data) => {
  return {
    prim: 'Pair',
    args: [
      assetclass,
      { bytes: data }
    ]
  }
}

const mkAsset = (assetclass, data, value) => {
  return {
    prim: 'Pair',
    args: [
      {
        prim: 'Pair',
        args: [
          assetclass,
          { bytes: data }
        ]
      },
      { int: value }
    ]

  }
}
exports.mkAsset = mkAsset

exports.mkOrder = (maker, makeAsset, taker, takeAsset, salt, start, end, datatype, data) => {
  return {
    prim: "Pair",
    args: [
      maker,
      {
        prim: 'Pair',
        args: [
          makeAsset,
          {
            prim: 'Pair',
            args: [
              taker,
              {
                prim: 'Pair',
                args: [
                  takeAsset,
                  {
                    prim: 'Pair',
                    args: [
                      { int: salt },
                      {
                        prim: 'Pair',
                        args: [
                          start,
                          {
                            prim: 'Pair',
                            args: [
                              end,
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: datatype },
                                  { bytes: data }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

exports.mkDoTransfersArg = (leftOrder, leftSig, rightOrder, rightSig) => {
  return {
    "prim": 'Pair',
    args: [
      leftOrder,
      {
        "prim": "Pair",
        args: [
          leftSig,
          {
            "prim": "Pair",
            args: [
              rightOrder,
              rightSig
            ]
          }
        ]
      }
    ]
  }
}

const assetClassType = exprMichelineToJson("(or %assetClass unit (or unit (or int (or int bytes))))")
exports.assetClassType = assetClassType

const assetType = {
  "prim": "pair",
  "annots": [
    "%assetType"
  ],
  "args": [
    assetClassType,
    {
      "prim": "bytes",
      "annots": [
        "%assetData"
      ]
    }
  ]
}
exports.assetType = assetType

exports.orderType = {
  "prim": "pair",
  "args": [
    {
      "prim": "option",
      "annots": [
        "%maker"
      ],
      "args": [
        {
          "prim": "key"
        }
      ]
    },
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "annots": [
            "%makeAsset"
          ],
          "args": [
            assetType,
            {
              "prim": "nat",
              "annots": [
                "%assetValue"
              ]
            }
          ]
        },
        {
          "prim": "pair",
          "args": [
            {
              "prim": "option",
              "annots": [
                "%taker"
              ],
              "args": [
                {
                  "prim": "key"
                }
              ]
            },
            {
              "prim": "pair",
              "args": [
                {
                  "prim": "pair",
                  "annots": [
                    "%takeAsset"
                  ],
                  "args": [
                    assetType,
                    {
                      "prim": "nat",
                      "annots": [
                        "%assetValue"
                      ]
                    }
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%salt"
                      ]
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "option",
                          "annots": [
                            "%start"
                          ],
                          "args": [
                            {
                              "prim": "timestamp"
                            }
                          ]
                        },
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "option",
                              "annots": [
                                "%end"
                              ],
                              "args": [
                                {
                                  "prim": "timestamp"
                                }
                              ]
                            },
                            {
                              "prim": "pair",
                              "args": [
                                {
                                  "prim": "bytes",
                                  "annots": [
                                    "%dataType"
                                  ]
                                },
                                {
                                  "prim": "bytes",
                                  "annots": [
                                    "%data"
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

//exports.orderType = exprMichelineToJson("\
//  (pair \
//    (option %maker key) \
//    (pair (pair %makeAsset \
//             (pair %assetType (nat %assetClass) (bytes %assetData)) \
//             (nat %assetValue)) \
//          (pair (option %taker key) \
//                (pair (pair %takeAsset \
//                         (pair %assetType (nat %assetClass) (bytes %assetData)) \
//                         (nat %assetValue)) \
//                      (pair (nat %salt) \
//                            (pair (option %start timestamp) \
//                                  (pair (option %end timestamp) (pair (bytes %dataType) (bytes %data)))))))))");

const mkPairs = l => {
  if (l.length == 1) {
    return l[0];
  } else
    return {
      prim: 'Pair',
      args: [
        l[0],
        mkPairs(l.slice(1, l.length))
      ]
    }
}

exports.DataV1type = exprMichelineToJson("(pair (list    %payouts (pair (address %partAccount) (nat %partValue)))       (list    %originFees (pair (address %partAccount) (nat %partValue))))");
exports.DataV2type = exprMichelineToJson("(pair (list %v2_payouts (pair (address %partAccount) (nat %partValue))) (pair (list %v2_originFees (pair (address %partAccount) (nat %partValue))) (bool %v2_isMakeFill) ))");

exports.mkPairs = args => mkPairs(args)

exports.mkDataV1 = (payouts, originFees) => {
  return {
    prim: 'Pair',
    args: [
      payouts.map(p => mkPairs([{ string: p[0] }, { int: p[1].toString() }])),
      originFees.map(p => mkPairs([{ string: p[0] }, { int: p[1].toString() }]))
    ]
  }
}

exports.mkDataV2 = (payouts, originFees, isMakeFill) => {
  return {
    prim: 'Pair',
    args: [
      payouts.map(p => mkPairs([{ string: p[0] }, { int: p[1].toString() }])),
      {
        prim: 'Pair',
        args: [
          originFees.map(p => mkPairs([{ string: p[0] }, { int: p[1].toString() }])),
          {
            prim : isMakeFill ? "True" : "False",
          }
        ]
      }
    ]
  }
}

// Taquito & Mockup-compliant get big map value
const getBigMapValue = async (id, key, keytyp) => {
  let res = await getValueFromBigMap(id, key, keytyp);
  if (res == null) {
    return 0;
  }
  return Number.parseInt(res.int);
}

const getFA12Balance = async (c, address) => {
  let storage = await c.getStorage();
  let id = storage.ledger;
  let res = await getBigMapValue(id, { string: address }, { prim: "address" });
  return Number.parseInt(res);
}

exports.getFA12Balance = getFA12Balance;

const getFA2Balance = async (c, token, address) => {
  let storage = await c.getStorage();
  let id = storage.ledger;
  let key = {
    prim: 'Pair',
    args: [{ int: "" + token }, { string: address }]
  };
  let keytyp = {
    prim: 'pair',
    args: [{ prim: "nat" }, { prim: "address" }]
  }
  let res = await getBigMapValue(id, key, keytyp);
  return res;
}

exports.checkFA12Balance = async (c, a, d, f) => {
  const data_before = await getFA12Balance(c, a);
  const balance_before = data_before == null ? 0 : data_before;
  await f();
  const data_after = await getFA12Balance(c, a);
  const balance_after = data_after == null ? 0 : data_after;
  // After Minus Before
  const delta = balance_after - balance_before;
  if (delta !== d) {
    throw new Error("Invalid delta balance of " + delta + " tokens for " + getAccount(a).name);
  }
}

exports.checkFA2Balance = async (c, token, address, d, f) => {
  const data_before = await getFA2Balance(c, token, address);
  const balance_before = data_before == null ? 0 : data_before;
  await f();
  const data_after = await getFA2Balance(c, token, address);
  const balance_after = data_after == null ? 0 : data_after;
  // After Minus Before
  const delta = balance_after - balance_before;
  if (delta !== d) {
    throw new Error("Invalid delta balance of " + delta + " tokens '" + token + "' for " + getAccount(address).name);
  }
}

exports.mkApproveForAllSingle = (operator) => {
  return [{
    prim: 'Left',
    args: [{ string: operator }]
  }]
}

exports.mkApproveSingle = (owner, operator, tokenid) => {
  return [{
    prim: 'Left',
    args: [{
      prim: 'Pair',
      args: [
        { string: owner },
        {
          prim: 'Pair',
          args: [
            { string: operator },
            { int: "" + tokenid }
          ]
        }
      ]
    }]
  }]
}

exports.mkSetRoyaltiesByToken = (address, tokenid, royalties) => {
  return mkPairs([{ string: address }, { prim: "Some", args: [{ int: "" + tokenid }]},
    royalties.map(p => mkPairs([{string: p[0]}, {int: p[1].toString()}]))
  ]);
}

exports.mkFA2Asset = (fa2t, address, tokenid, value) => {
  let typ = {
    prim: "pair",
    args: [
      { prim: "address" },
      { prim: "nat" }
    ]
  };
  let data = packTyped(mkPairs([{ string: address }, { int: "" + tokenid }]), typ);
  return mkAsset(FA_2(fa2t), data, value);
}

exports.errors = {
  NOT_ENOUGH_XTZ : "\"NOT_ENOUGH_XTZ\"",
  UNSAFE_ALLOWANCE_CHANGE : v => "(Pair \"UnsafeAllowanceChange\" " + v + ")",
}