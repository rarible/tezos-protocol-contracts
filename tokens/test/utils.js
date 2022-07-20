const {
    getValueFromBigMap,
    exprMichelineToJson,
    packTyped,
    packTypedAll,
    blake2b,
    getAccount,
    getAddress,
    sign,
    taquitoExecuteSchema,
    keccak,
    isMockup,
    getEndpoint,
} = require('@completium/completium-cli');

// or unit (or unit (or unit (or unit bytes)))
exports.XTZ = {
    prim: 'Left',
    args: [{ prim: 'Unit' }],
};
exports.FA_1_2 = {
    prim: 'Right',
    args: [
        {
            prim: 'Left',
            args: [{ prim: 'Unit' }],
        },
    ],
};

const FA_2 = {
    prim: 'Right',
    args: [
        {
            prim: 'Right',
            args: [
                {
                    prim: 'Left',
                    args: [{ prim: 'Unit' }],
                },
            ],
        },
    ],
};
exports.FA_2 = FA_2;

exports.OTHER = (x) => {
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
                                args: [{ bytes: x }],
                            },
                        ],
                    },
                ],
            },
        ],
    };
};

exports.FEE_SIDE_NONE = 0;
exports.FEE_SIDE_MAKE = 1;
exports.FEE_SIDE_TAKE = 2;

exports.packPair = (l, tl, r, tr) => {
    let pair = exprMichelineToJson('(Pair "' + l + '" "' + r + '")');
    let typ = exprMichelineToJson('(pair ' + tl + ' ' + tr + ')');
    return packTyped(pair, typ);
};

exports.mkSome = (v) => {
    return {
        prim: 'Some',
        args: [{ string: v }],
    };
};

exports.mkSomeInt = (v) => {
    return {
        prim: 'Some',
        args: [{ int: v }],
    };
};

exports.mkNone = { prim: 'None' };

exports.mkAssetType = (assetclass, data) => {
    return {
        prim: 'Pair',
        args: [assetclass, { bytes: data }],
    };
};

const mkAsset = (assetclass, data, value) => {
    return {
        prim: 'Pair',
        args: [
            {
                prim: 'Pair',
                args: [assetclass, { bytes: data }],
            },
            { int: value },
        ],
    };
};
exports.mkAsset = mkAsset;

// record order {
//   maker: option < key >;
//   makeAsset: % asset;
//   taker: option < key >;
//   takeAsset: % asset;
//   salt: nat;
//   start: option < date >;
//   % end : option < date >;
//   dataType: bytes;
//   data: bytes;
// }

exports.mkOrder = (
    maker,
    makeAsset,
    taker,
    takeAsset,
    salt,
    start,
    end,
    datatype,
    data
) => {
    return {
        prim: 'Pair',
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
                                                                    {
                                                                        bytes: datatype,
                                                                    },
                                                                    {
                                                                        bytes: data,
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
};

exports.mkDoTransfersArg = (leftOrder, leftSig, rightOrder, rightSig) => {
    return {
        prim: 'Pair',
        args: [
            leftOrder,
            {
                prim: 'Pair',
                args: [
                    leftSig,
                    {
                        prim: 'Pair',
                        args: [rightOrder, rightSig],
                    },
                ],
            },
        ],
    };
};

exports.mkApproveForAllSingle = (operator) => {
    return [{
      prim: 'Left',
      args: [{ string: operator }]
    }]
  }

const assetClassType = exprMichelineToJson(
    '(or %assetClass unit (or unit (or unit (or unit bytes))))'
);
exports.assetClassType = assetClassType;

const assetType = {
    prim: 'pair',
    annots: ['%assetType'],
    args: [
        assetClassType,
        {
            prim: 'bytes',
            annots: ['%assetData'],
        },
    ],
};
exports.assetType = assetType;

exports.orderType = {
    prim: 'pair',
    args: [
        {
            prim: 'option',
            annots: ['%maker'],
            args: [
                {
                    prim: 'key',
                },
            ],
        },
        {
            prim: 'pair',
            args: [
                {
                    prim: 'pair',
                    annots: ['%makeAsset'],
                    args: [
                        assetType,
                        {
                            prim: 'nat',
                            annots: ['%assetValue'],
                        },
                    ],
                },
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'option',
                            annots: ['%taker'],
                            args: [
                                {
                                    prim: 'key',
                                },
                            ],
                        },
                        {
                            prim: 'pair',
                            args: [
                                {
                                    prim: 'pair',
                                    annots: ['%takeAsset'],
                                    args: [
                                        assetType,
                                        {
                                            prim: 'nat',
                                            annots: ['%assetValue'],
                                        },
                                    ],
                                },
                                {
                                    prim: 'pair',
                                    args: [
                                        {
                                            prim: 'nat',
                                            annots: ['%salt'],
                                        },
                                        {
                                            prim: 'pair',
                                            args: [
                                                {
                                                    prim: 'option',
                                                    annots: ['%start'],
                                                    args: [
                                                        {
                                                            prim: 'timestamp',
                                                        },
                                                    ],
                                                },
                                                {
                                                    prim: 'pair',
                                                    args: [
                                                        {
                                                            prim: 'option',
                                                            annots: ['%end'],
                                                            args: [
                                                                {
                                                                    prim: 'timestamp',
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            prim: 'pair',
                                                            args: [
                                                                {
                                                                    prim: 'bytes',
                                                                    annots: [
                                                                        '%dataType',
                                                                    ],
                                                                },
                                                                {
                                                                    prim: 'bytes',
                                                                    annots: [
                                                                        '%data',
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

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

const mkPairs = (l) => {
    if (l.length == 1) {
        return l[0];
    } else
        return {
            prim: 'Pair',
            args: [l[0], mkPairs(l.slice(1, l.length))],
        };
};

exports.DataV1type = exprMichelineToJson(
    '(pair (list %payouts (pair (address %partAccount) (nat %partValue))) (list %originFees (pair (address %partAccount) (nat %partValue))))'
);

exports.mkPairs = (args) => mkPairs(args);

exports.mkDataV1 = (payouts, originFees) => {
    return {
        prim: 'Pair',
        args: [
            payouts.map((p) =>
                mkPairs([{ string: p[0] }, { int: p[1].toString() }])
            ),
            originFees.map((p) =>
                mkPairs([{ string: p[0] }, { int: p[1].toString() }])
            ),
        ],
    };
};

// Taquito & Mockup-compliant get big map value
const getBigMapValue = async (id, key, keytyp) => {
    let res = await getValueFromBigMap(id, key, keytyp);
    if (res == null) {
        return 0;
    }
    return Number.parseInt(res.int);
};

const getFA12Balance = async (c, address) => {
    let storage = await c.getStorage();
    let id = storage.ledger;
    let res = await getBigMapValue(
        id,
        { string: address },
        { prim: 'address' }
    );
    return Number.parseInt(res);
};

exports.getFA12Balance = getFA12Balance;

const getFA2Balance = async (c, token, address) => {
    let storage = await c.getStorage();
    let id = storage.ledger;
    let key = {
        prim: 'Pair',
        args: [{ int: '' + token }, { string: address }],
    };
    let keytyp = {
        prim: 'pair',
        args: [{ prim: 'nat' }, { prim: 'address' }],
    };
    let res = await getBigMapValue(id, key, keytyp);
    return res;
};

exports.checkFA12Balance = async (c, a, d, f) => {
    const data_before = await getFA12Balance(c, a);
    const balance_before = data_before == null ? 0 : data_before;
    await f();
    const data_after = await getFA12Balance(c, a);
    const balance_after = data_after == null ? 0 : data_after;
    // After Minus Before
    const delta = balance_after - balance_before;
    if (delta !== d) {
        throw new Error(
            'Invalid delta balance of ' +
                delta +
                ' tokens for ' +
                getAccount(a).name
        );
    }
};

exports.checkFA2Balance = async (c, token, address, d, f) => {
    const data_before = await getFA2Balance(c, token, address);
    const balance_before = data_before == null ? 0 : data_before;
    await f();
    const data_after = await getFA2Balance(c, token, address);
    const balance_after = data_after == null ? 0 : data_after;
    // After Minus Before
    const delta = balance_after - balance_before;
    if (delta !== d) {
        throw new Error(
            'Invalid delta balance of ' +
                delta +
                " tokens '" +
                token +
                "' for " +
                getAccount(address).name
        );
    }
};

exports.mkApproveForAllSingle = (operator) => {
    return [
        {
            prim: 'Left',
            args: [{ string: operator }],
        },
    ];
};

exports.mkDeleteApproveForAllSingle = (operator) => {
    return [
        {
            prim: 'Right',
            args: [{ string: operator }],
        },
    ];
};

exports.mkApproveSingle = (owner, operator, tokenid) => {
    return [
        {
            prim: 'Left',
            args: [
                {
                    prim: 'Pair',
                    args: [
                        { string: owner },
                        {
                            prim: 'Pair',
                            args: [{ string: operator }, { int: '' + tokenid }],
                        },
                    ],
                },
            ],
        },
    ];
};

exports.mkSetRoyaltiesByToken = (address, tokenid, royalties) => {
    return mkPairs([
        { string: address },
        { int: '' + tokenid },
        royalties.map((p) =>
            mkPairs([{ string: p[0] }, { int: p[1].toString() }])
        ),
    ]);
};

exports.mkFA2Asset = (address, tokenid, value) => {
    let typ = {
        prim: 'pair',
        args: [{ prim: 'address' }, { prim: 'nat' }],
    };
    let data = packTyped(
        mkPairs([{ string: address }, { int: '' + tokenid }]),
        typ
    );
    return mkAsset(FA_2, data, value);
};

const assert = require('assert');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

exports.pauseAndVerify = async (c, a) => {
    await c.pause({ as: a.pkh });
    let storage = await c.getStorage();
    assert(storage.paused == true, 'contract should be paused');
};

exports.unpauseAndVerify = async (c, a) => {
    await c.unpause({ as: a.pkh });
    let storage = await c.getStorage();
    assert(storage.paused == false, 'contract should not be paused');
};

exports.initUsds = (owner, minter, pauser) => {
    return {
        prim: 'Pair',
        args: [
            {
                prim: 'Pair',
                args: [
                    {
                        prim: 'Pair',
                        args: [
                            {
                                prim: 'Pair',
                                args: [
                                    {
                                        int: '300000',
                                    },
                                    [],
                                ],
                            },
                            [],
                            [],
                        ],
                    },
                    {
                        prim: 'Pair',
                        args: [
                            [],
                            {
                                prim: 'False',
                            },
                        ],
                    },
                    {
                        int: '0',
                    },
                    [],
                ],
            },
            {
                prim: 'Pair',
                args: [
                    {
                        prim: 'Pair',
                        args: [
                            {
                                prim: 'Pair',
                                args: [
                                    {
                                        string: minter,
                                    },
                                    {
                                        string: owner,
                                    },
                                ],
                            },
                            {
                                string: pauser,
                            },
                            {
                                prim: 'None',
                            },
                        ],
                    },
                    {
                        int: '79971450000',
                    },
                ],
            },
            {
                prim: 'None',
            },
        ],
    };
};

exports.getFA2Balance = (gbfa2) => {
    return async (fa2, o, t) => {
        await gbfa2.execBalanceof({
            arg: { fa2: fa2.address, owner: o, tokenid: t },
        });
        const storage = await gbfa2.getStorage();
        return storage.toNumber();
    };
};

exports.checkFA2Balance = (gbfa2) => {
    return async (fa2, o, t, v) => {
        await gbfa2.execBalanceof({
            arg: { fa2: fa2.address, owner: o, tokenid: t },
        });
        const storage = await gbfa2.getStorage();
        const res = storage.toNumber();
        if (res !== v) {
            throw new Error(
                'Invalid balance of: expected ' + v + ', got ' + res
            );
        }
    };
};
const transferParamType = exprMichelineToJson(
    '(list (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount)))))'
);

const singleStepTransferParamType = exprMichelineToJson("(list (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount)))))");


const permitDataType = exprMichelineToJson(
    '(pair (pair address chain_id) (pair nat bytes))'
);

const gaslessDataType = exprMichelineToJson(
    '(pair address (pair nat bytes))'
);

const isSandbox = () => {
    return getEndpoint() == 'http://localhost:8732' ? true : false;
};

exports.mkTransferPermit = async (
    from,
    to,
    contract,
    amount,
    tokenid,
    permit_counter
) => {
    const michelsonData = `{ Pair "${from.pkh}" { Pair "${to.pkh}" (Pair ${tokenid} ${amount}) } }`;
    const transferParam = exprMichelineToJson(michelsonData);
    const permit = packTyped(transferParam, transferParamType);
    const hashPermit = blake2b(permit);
    const chainid = isMockup()
        ? 'NetXynUjJNZm7wi'
        : isSandbox()
        ? 'NetXzcB5DmnBoxG'
        : 'NetXz969SFaFn8k'; // else granada
    const permitData = exprMichelineToJson(
        `(Pair (Pair "${contract}" "${chainid}") (Pair ${permit_counter} 0x${hashPermit}))`
    );
    const tosign = packTyped(permitData, permitDataType);
    const signature = await sign(tosign, { as: from.name });
    return { hash: hashPermit, sig: signature };
};

exports.mkTransferGaslessArgs = async (
    from,
    to,
    contract,
    amount,
    tokenid,
    permit_counter
) => {
    const michelsonData = `{ Pair "${from.pkh}" { Pair "${to.pkh}" (Pair ${tokenid} ${amount}) } }`;
    const transferParam = exprMichelineToJson(michelsonData);
    const permit = packTyped(transferParam, singleStepTransferParamType);
    const hashPermit = blake2b(permit);
    const chainid = isMockup()
        ? 'NetXynUjJNZm7wi'
        : isSandbox()
        ? 'NetXzcB5DmnBoxG'
        : 'NetXz969SFaFn8k'; // else granada
    const permitData = exprMichelineToJson(
        `(Pair "${contract}" (Pair ${permit_counter} 0x${hashPermit}))`
    );
    const tosign = packTyped(permitData, gaslessDataType);
    const signature = await sign(tosign, { as: from.name });
    return { hash: hashPermit, sig: signature };
};



const tokenIdType = {
    prim: 'pair',
    args: [{ prim: 'nat' }, { prim: 'nat' }],
};

exports.getTokenId = (archetypeid, serial) => {
    const a = mkPairs([
        { int: archetypeid.toString() },
        { int: serial.toString() },
    ]);
    const packed = packTyped(a, tokenIdType);
    const hexStr = keccak(packed).substring(0, 8);
    const b = '0x' + hexStr;
    const c = Number(b);
    return c.toString();
};

exports.errors = {
    CALLER_NOT_OWNER: '"CALLER_NOT_OWNER"',
    NOT_FOUND: '"NOT_FOUND"',
    LEDGER_NOT_FOUND: '(Pair "ASSET_NOT_FOUND" "ledger")',
    INVALID_CALLER: '"INVALID_CALLER"',
    INVALID_AMOUNT: '"FA2_INVALID_AMOUNT"',
    FA2_INSUFFICIENT_BALANCE: '"FA2_INSUFFICIENT_BALANCE"',
    FA2_NOT_OPERATOR: '"FA2_NOT_OPERATOR"',
    ARCHETYPE_ALREADY_REGISTERED: '"Archetype already registered"',
    ARCHETYPE_INVALID_VALIDATOR:
        '"Archetype requires a minting validator contract address"',
    ARCHETYPE_NOT_REGISTERED: '"Archetype not registered"',
    LIMIT_ALREADY_SET: '"MintingValidator: minting limit already set"',
    SERIAL_OOB: '"MintingValidator: serial number out of bounds"',
    ALREADY_MINTED: '"Token already minted"',
    DEADLINE_REACHED: '"MintingValidator: deadline reached"',
    DEADLINE_ALREADY_SET: '"MintingValidator: deadline already set"',
    MUST_BE_MINTER: '"Must be a minter"',
    DOES_NOT_EXIST: '"Token does not exist"',
    // NOT_WHITELISTED: '"Recipient is not whitelisted"',
    NOT_WHITELISTED: '"TO_NOT_ALLOWED"',
    WHITELIST_TO_RESTRICTED: '"TO_RESTRICTED"',
    NOT_ADMIN: '"Must be an administrator"',
    ERC1155_NOT_APPROVED: '"ERC1155: caller is not owner nor approved"',
    ERC1155_INSUFFICIENT_BALANCE:
        '"ERC1155: insufficient balance for transfer"',
    ARCHETYPE_QUOTA: '"Archetype quota reached"',
    COOLDOWN: '"Transfer cooldown"',
    USDC_WRONG_SIG: '"FiatTokenV2: invalid signature"',
    USDC_BALANCE_TOO_LOW: '"ERC20: transfer amount exceeds balance"',
    USDC_ALLOWANCE_TOO_LOW: '"ERC20: transfer amount exceeds allowance"',
    QUARTZ_MINTER_AUTHORIZATION_EXPIRED:
        '"QUARTZ_MINTER: authorization expired"',
    QUARTZ_MINTER_RECOVER_FAILED: '"QUARTZ_MINTER: invalid signature"',
    PAUSED: '"Pausable: paused"',
    NOT_PAUSED: '"Pausable: not paused"',
    META_TRANSACTION_WRONG_SIGNATURE:
        '"NativeMetaTransaction: WRONG_SIGNATURE"',
    MISSIGNED: '(Pair "MISSIGNED"',
    EXPIRED_PERMIT: '"PERMIT_EXPIRED"',
    EXPIRY_NEGATIVE: '"EXPIRY_NEGATIVE"',
    EXPIRY_TOO_BIG: '"EXPIRY_TOO_BIG"',
    NOT_PERMIT_ISSUER: '"NOT_PERMIT_ISSUER"',
    CONTRACT_PAUSED: '"CONTRACT_PAUSED"',
    KEY_EXISTS: '(Pair "KEY_EXISTS" "ledger")',
    TOKEN_METADATA_KEY_EXISTS: '(Pair "KEY_EXISTS" "token_metadata")',
};
