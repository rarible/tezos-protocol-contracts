const {
    getValueFromBigMap,
    getAccount,
    getEndpoint,
    packTyped
} = require('@completium/completium-cli');

exports.XTZ = '0';
exports.FA12 = '1';
exports.FA2 = '2';

exports.mkBuyAsset = (assetType, assetContract, assetId) => {
    let payload = {};
    switch (assetType) {
        case this.XTZ:
            payload = this.mkXTZAsset();
            break;
        case this.FA_1_2:
            payload = this.mkFA12Asset(assetContract);
            break;
        case this.FA_2:
            payload = this.mkFungibleFA2Asset(assetContract, assetId);
            break;
    }
    return payload;
};

exports.mkFungibleFA2Asset = (assetContract, assetId) => {
    return packTyped({
        prim: "Pair",
        args: [
            {
                string: `${assetContract}`,
            },
            {
                int: `${assetId}`,
            },
        ],
    }, {
        prim: "pair",
        args: [
            {
                prim: "address",
            },
            {
                prim: "nat",
            },
        ],
    });
};

exports.mkFA12Asset = (assetContract) => {
    return packTyped({
        string: `${assetContract}`,
    }, {
        prim: "address",
    });
};

exports.mkXTZAsset = () => {
    return "";
};

exports.mkBundleItem = (assetContract, assetId, assetQty) => {
    return {
        prim: "Pair",
        args: [
            {
                string: `${assetContract}`,
            },
            {
                prim: "Pair",
                args: [
                    {
                        int: `${assetId}`,
                    },
                    {
                        int: `${assetQty}`,
                    },
                ],
            }
        ],
    };
};

exports.mkPackedBundle = (bundle) => {
    return packTyped(bundle, {
        "prim": "list",
        "args": [{
            "prim": "pair",
            "args": [{
                "prim": "address",
                "annots": ["%bundle_item_contract"]
            }, {
                "prim": "pair",
                "args": [{
                    "prim": "nat",
                    "annots": ["%bundle_item_id"]
                }, {
                    "prim": "nat",
                    "annots": ["%bundle_item_qty"]
                }]
            }]
        }]
    });
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

exports.getFA2Balance = async (c, token, address) => {
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

const isSandbox = () => {
    return getEndpoint() == 'http://localhost:8732' ? true : false;
};

exports.errors = {
    // Common
    INVALID_CALLER: '"INVALID_CALLER"',
    getErrorInvalidCondition: (id) => {
        return `(Pair "INVALID_CONDITION" "${id}")`
    },

    // Sales Storage
    CANT_UNPACK_FA12_ASSET: '"CANT_UNPACK_FA12_ASSET"',
    CANT_UNPACK_FA2_ASSET: '"CANT_UNPACK_FA2_ASSET"',
    MISSING_CANDIDATE: '"MISSING_CANDIDATE"',
    MISSING_SALES_CONTRACT: '"MISSING_SALES_CONTRACT"',


    // Sales
    AMOUNT_MISMATCH: '"AMOUNT_MISMATCH"',
    BUNDLE_CANT_BE_EMPTY: '"BUNDLE_CANT_BE_EMPTY"',
    CANT_UNPACK_BUNDLE: '"CANT_UNPACK_BUNDLE"',
    CANT_UNPACK_FA12_ASSET: '"CANT_UNPACK_FA12_ASSET"',
    CANT_UNPACK_FA2_ASSET: '"CANT_UNPACK_FA2_ASSET"',
    FEES_OVER_SELLER_LIMIT: '"FEES_OVER_SELLER_LIMIT"',
    INVALID_BUNDLE_ITEM_QTY: '"INVALID_BUNDLE_ITEM_QTY"',
    INVALID_BUY_AMOUNT: '"INVALID_BUY_AMOUNT"',
    INVALID_CALLER: '"INVALID_CALLER"',
    INVALID_SALE_END_DATE: '"INVALID_SALE_END_DATE"',
    INVALID_SALE_START_DATE: '"INVALID_SALE_START_DATE"',
    MAX_BUNDLE_SIZE: '"MAX_BUNDLE_SIZE"',
    MISSING_BUNDLE_SALE: '"MISSING_BUNDLE_SALE"',
    MISSING_CANDIDATE: '"MISSING_CANDIDATE"',
    MISSING_SALE: '"MISSING_SALE"',
    SALE_ALREADY_EXISTS: '"SALE_ALREADY_EXISTS"',
    SALE_CLOSED: '"SALE_CLOSED"',
    SALE_NOT_STARTED: '"SALE_NOT_STARTED"',
    WRONG_XTZ_PAYLOAD: '"WRONG_XTZ_PAYLOAD"',
    getErrorMaxBundleSize: (n) => {
        return `(Pair "MAX_BUNDLE_SIZE" ${n})`
    },
    getErrorAmountMismatch: (id1, id2) => {
        return `(Pair "AMOUNT_MISMATCH" (Pair ${id1} ${id2}))`
    },

    // FA 1.2
    NOT_ENOUGH_ALLOWANCE: '"NotEnoughAllowance"',
    NOT_ENOUGH_BALANCE: '"NotEnoughBalance"',
    UNSAFE_ALLOWANCE_CHANGE: '"UnsafeAllowanceChange"',

    // FA 2 ft
    CALLER_NOT_OWNER: '"CALLER_NOT_OWNER"',
    CONTRACT_NOT_PAUSED: '"CONTRACT_NOT_PAUSED"',
    CONTRACT_PAUSED: '"CONTRACT_PAUSED"',
    EXPIRY_TOO_BIG: '"EXPIRY_TOO_BIG"',
    FA2_INSUFFICIENT_BALANCE: '"FA2_INSUFFICIENT_BALANCE"',
    FA2_INVALID_AMOUNT: '"FA2_INVALID_AMOUNT"',
    FA2_NOT_OPERATOR: '"FA2_NOT_OPERATOR"',
    MISSIGNED: '"MISSIGNED"',
    NO_ENTRY_FOR_USER: '"NO_ENTRY_FOR_USER"',
    NOT_FOUND: '"NOT_FOUND"',
    PERMIT_EXPIRED: '"PERMIT_EXPIRED"',
    PERMIT_NOT_FOUND: '"PERMIT_NOT_FOUND"',
    PERMIT_USER_NOT_FOUND: '"PERMIT_USER_NOT_FOUND"',
    SIGNER_NOT_FROM: '"SIGNER_NOT_FROM"',

    // FA 2 nft
    CALLER_NOT_OWNER: '"CALLER_NOT_OWNER"',
    CONTRACT_NOT_PAUSED: '"CONTRACT_NOT_PAUSED"',
    CONTRACT_PAUSED: '"CONTRACT_PAUSED"',
    EXPIRY_TOO_BIG: '"EXPIRY_TOO_BIG"',
    FA2_INSUFFICIENT_BALANCE: '"FA2_INSUFFICIENT_BALANCE"',
    FA2_INVALID_AMOUNT: '"FA2_INVALID_AMOUNT"',
    FA2_NOT_OPERATOR: '"FA2_NOT_OPERATOR"',
    MISSIGNED: '"MISSIGNED"',
    NO_ENTRY_FOR_USER: '"NO_ENTRY_FOR_USER"',
    NOT_FOUND: '"NOT_FOUND"',
    PERMIT_EXPIRED: '"PERMIT_EXPIRED"',
    PERMIT_NOT_FOUND: '"PERMIT_NOT_FOUND"',
    PERMIT_USER_NOT_FOUND: '"PERMIT_USER_NOT_FOUND"',
    SIGNER_NOT_FROM: '"SIGNER_NOT_FROM"',

    // Royalties Provider
    INVALID_CALLER: '"INVALID_CALLER"',
    MISSING_OWNER_CANDIDATE: '"MISSING_OWNER_CANDIDATE"',

    // Transfer Manager
    MISSING_ASSET_ID: '"MISSING_ASSET_ID"',
    MISSING_ASSET_CONTRACT: '"MISSING_ASSET_CONTRACT"',
    ROYALTIES_TOO_HIGH: '"ROYALTIES_TOO_HIGH"',
    TOTAL_AMOUNT_NEGATIVE: '"TOTAL_AMOUNT_NEGATIVE"',
    CANT_UNPACK_FA2_ASSET: '"CANT_UNPACK_FA2_ASSET"',
    CANT_UNPACK_FA12_ASSET: '"CANT_UNPACK_FA12_ASSET"',
    NOT_AUTHORIZED: '"NOT_AUTHORIZED"',
};
