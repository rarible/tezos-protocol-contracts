const {
    deploy,
    getAccount,
    getValueFromBigMap,
    setQuiet,
    expectToThrow,
    exprMichelineToJson,
    getBalance,
    setMockupNow,
    isMockup
} = require('@completium/completium-cli');
const {
    errors,
    FA12,
    FA2,
    XTZ,
    mkFungibleFA2Asset,
    getFA2Balance,
    getFA12Balance,
    mkXTZAsset,
    mkFA12Asset,
    mkBundleItem,
    mkPackedBundle
} = require('./utils');
const assert = require('assert');
const BigNumber = require('bignumber.js');

require('mocha/package.json');

setQuiet('true');

const mockup_mode = true;

// contracts
let sales_storage;
let transfer_manager;
let sales;
let royalties;
let nft;
let fa12_ft_0;
let fa12_ft_1;
let fa12_ft_2;
let fa2_ft;

const initial_fa2_ft_amount = 100000000;
const initial_fa12_ft_amount = 100000000;
const initial_nft_amount = 100;
const token_id_0 = 0;
const token_id_1 = 1;
const token_id_2 = 2;
const token_id_3 = 3;
const token_id_4 = 4;
const token_id_5 = 5;
const token_id_6 = 6;
const token_id_7 = 7;
const token_id_8 = 8;
const token_id_9 = 9;

const fee = 250;
const payout_value = 100;
const max_fees = 10000;

const sale_amount = 1000000;
const qty = 1;
// accounts
const alice = getAccount(mockup_mode ? 'alice' : 'alice');
const bob = getAccount(mockup_mode ? 'bob' : 'bob');
const carl = getAccount(mockup_mode ? 'carl' : 'carl');
const daniel = getAccount(mockup_mode ? 'bootstrap1' : 'bootstrap1');

//set endpointhead
//setEndpoint(mockup_mode ? 'mockup' : 'https://hangzhounet.smartpy.io');

describe('Contract deployments', async () => {

    it('Fungible token 0 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_0, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_0"
            }
        );
    });

    it('Fungible token 1 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_1, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_1"
            }
        );
    });

    it('Fungible token 2 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_2, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_2"
            }
        );
    });

    it('Fungible token (FA2) contract deployment should succeed', async () => {
        [fa2_ft, _] = await deploy(
            '../test-contracts/test-fa2-ft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
            }
        );
    });

    it('Non Fungible token (FA2) contract deployment should succeed', async () => {
        [nft, _] = await deploy(
            '../test-contracts/test-nft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
            }
        );
    });

    it('Royalties provider contract deployment should succeed', async () => {
        [royalties, _] = await deploy(
            '../royalties-provider/contracts/royalties.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
            }
        );
    });

    it('Sales storage contract deployment should succeed', async () => {
        [sales_storage, _] = await deploy(
            './contracts/sales-storage.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "sales-storage"
            }
        );
    });

    it('Transfer manager contract deployment should succeed', async () => {
        [transfer_manager, _] = await deploy(
            '../transfer-manager/contracts/transfer-manager.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    royalties_provider: nft.address,
                    default_fee_receiver: carl.pkh,
                },
                as: alice.pkh,
                named: "transfer-manager"
            }
        );
    });

    it('Sales contract deployment should succeed', async () => {
        [sales, _] = await deploy(
            './contracts/sales.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    protocol_fee: 0,
                    transfer_manager: transfer_manager.address,
                    sales_storage: royalties.address,
                },
                as: alice.pkh,
                named: "sales"
            }
        );
    });
});

describe('(Transfer manager)Authorize Sales, and Sales storage contract tests', async () => {
    it('Authorize Sales, and Sales storage contract as non admin should fail', async () => {
        await expectToThrow(async () => {
            await transfer_manager.authorize_contract({
                arg: {
                    ac_contract: sales.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Authorize Sales, and Sales storage contract as admin should succeed', async () => {
        const storage = await transfer_manager.getStorage();
        assert(storage.authorized_contracts.length == 0);
        await transfer_manager.authorize_contract({
            arg: {
                ac_contract: sales.address
            },
            as: alice.pkh
        });
        await transfer_manager.authorize_contract({
            arg: {
                ac_contract: sales_storage.address
            },
            as: alice.pkh
        });
        const post_test_storage = await transfer_manager.getStorage();
        assert(post_test_storage.authorized_contracts.length == 2);
        assert(
            post_test_storage.authorized_contracts.includes(sales_storage.address) &&
            post_test_storage.authorized_contracts.includes(sales.address)

        );

    });
});

describe('Sales storage setter tests', async () => {
    it('Set sales contract as non admin should fail', async () => {
        await expectToThrow(async () => {
            await sales_storage.set_sales_contract({
                arg: {
                    ssc_contract: sales.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set sales contract as admin should succeed', async () => {
        const storage = await sales_storage.getStorage();
        assert(storage.sales_contract == null);
        await sales_storage.set_sales_contract({
            arg: {
                ssc_contract: sales.address
            },
            as: alice.pkh
        });
        const post_test_storage = await sales_storage.getStorage();
        assert(post_test_storage.sales_contract == sales.address);
    });

    it('Set transfer manager as non admin should fail', async () => {
        await expectToThrow(async () => {
            await sales_storage.set_transfer_manager({
                arg: {
                    stm_contract: transfer_manager.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set transfer manager as admin should succeed', async () => {
        const storage = await sales_storage.getStorage();
        assert(storage.transfer_manager == null);
        await sales_storage.set_transfer_manager({
            arg: {
                stm_contract: transfer_manager.address
            },
            as: alice.pkh
        });
        const post_test_storage = await sales_storage.getStorage();
        assert(post_test_storage.transfer_manager == transfer_manager.address);
    });
});

describe('Sales contract setter tests', async () => {
    describe('Sales storage (Sales contract) contract setter tests', async () => {
        it('Set Sales storage contract as non admin should fail', async () => {
            await expectToThrow(async () => {
                await sales.set_sales_storage({
                    arg: {
                        ssc_contract: sales_storage.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set Sales storage contract as admin should succeed', async () => {
            const storage = await sales.getStorage();
            assert(storage.sales_storage == royalties.address);
            await sales.set_sales_storage({
                arg: {
                    ssc_contract: sales_storage.address
                },
                as: alice.pkh
            });
            const post_test_storage = await sales.getStorage();
            assert(post_test_storage.sales_storage == sales_storage.address);
        });
    });

    describe('Protocol fee setter tests', async () => {
        it('Set protocol fee as non admin should fail', async () => {
            await expectToThrow(async () => {
                await sales.set_protocol_fee({
                    arg: {
                        smd: 999
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set protocol fee as admin should succeed', async () => {
            const storage = await sales.getStorage();
            assert(storage.protocol_fee.toFixed() == BigNumber(0).toFixed());
            await sales.set_protocol_fee({
                arg: {
                    spf: fee
                },
                as: alice.pkh
            });
            const post_test_storage = await sales.getStorage();
            assert(post_test_storage.protocol_fee.toFixed() == BigNumber(fee).toFixed());
        });
    });

    describe('Fee receiver setter tests', async () => {
        it('Set fee receiver as non admin should fail', async () => {
            await expectToThrow(async () => {
                await transfer_manager.set_default_fee_receiver({
                    arg: {
                        sfr: daniel.pkh
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set fee receiver as admin should succeed', async () => {
            const receiver = daniel.pkh;
            const storage = await transfer_manager.getStorage();
            assert(storage.default_fee_receiver == carl.pkh);
            await transfer_manager.set_default_fee_receiver({
                arg: {
                    sfr: receiver
                },
                as: alice.pkh
            });
            const post_test_storage = await transfer_manager.getStorage();
            assert(post_test_storage.default_fee_receiver == receiver);
        });
    });

    describe('Royalties provider setter tests', async () => {
        it('Set royalties provider as non admin should fail', async () => {
            await expectToThrow(async () => {
                await transfer_manager.set_royalties_provider({
                    arg: {
                        srp: royalties.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set royalties provider as admin should succeed', async () => {
            const provider = royalties.address;
            const storage = await transfer_manager.getStorage();
            assert(storage.royalties_provider == nft.address);
            await transfer_manager.set_royalties_provider({
                arg: {
                    srp: provider
                },
                as: alice.pkh
            });
            const post_test_storage = await transfer_manager.getStorage();
            assert(post_test_storage.royalties_provider == provider);
        });
    });
});

describe('Tokens setup', async () => {
    describe('FA1.2 tokens setup', async () => {
        it('Distribute FA1.2 tokens should succeed', async () => {
            await fa12_ft_0.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_0.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_0.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: bob.pkh,
            });
            await fa12_ft_1.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_1.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_1.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: bob.pkh,
            });
            await fa12_ft_2.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_2.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_2.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: bob.pkh,
            });
            await fa12_ft_0.transfer({
                arg: {
                    from: alice.pkh,
                    to: bob.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });
            await fa12_ft_1.transfer({
                arg: {
                    from: alice.pkh,
                    to: bob.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });

            await fa12_ft_2.transfer({
                arg: {
                    from: alice.pkh,
                    to: bob.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });
        });
    });

    describe('Fungible FA2 tokens setup', async () => {
        it('Mint and transfer Fungible FA2 tokens should succeed', async () => {
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_0, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_1,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_1, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_2,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_2, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_3, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_4,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_4, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_5,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_5, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_6, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_7,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_7, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_8,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_8, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
            await fa2_ft.mint({
                arg: {
                    itokenid: token_id_9,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, token_id_9, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
        });
    });

    describe('NFT FA2 tokens setup', async () => {
        it('Mint NFT FA2 tokens should succeed', async () => {
            await nft.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_1,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value],
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_2,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value],
                        [daniel.pkh, payout_value]
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_4,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value]
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_5,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value],
                        [daniel.pkh, payout_value],
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_7,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value],
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_8,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [carl.pkh, payout_value],
                        [daniel.pkh, payout_value]
                    ],
                },
                as: alice.pkh,
            });
            await nft.mint({
                arg: {
                    itokenid: token_id_9,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
        });
    });

    it('Add transfer manager contract as operator for NFT and FT', async () => {
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_0})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_1})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_2})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_3})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_4})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_5})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_6})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_7})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_8})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_9})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_0})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_1})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_2})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_3})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_4})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_5})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_6})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_7})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_8})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${transfer_manager.address}" ${token_id_9})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_0})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_1})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_2})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_3})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_4})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_5})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_6})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_7})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_8})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${transfer_manager.address}" ${token_id_9})}`,
            as: bob.pkh,
        });
    });
});

describe('Set sales tests', async () => {
    describe('Set sale in Fungible FA2', async () => {
        it('Set sale buying with Fungible FA2 should succeed (no royalties, no sale payouts, no sale origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${sale_asset}
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${sale_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None
                                                            (Pair ${max_fees}
                                                                (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                       "int": "${max_fees}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set sale buying with Fungible FA2 should succeed (single royalties, single sale payouts, single sale origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_1}
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}}
                                        (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None
                                                            (Pair ${max_fees}
                                                                (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                    },
                    {
                       "prim":"None"
                    },
                    {
                       "prim":"None"
                    }
                ]
             }`);

            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });


        it('Set sale buying with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_2}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                    },
                    {
                       "prim":"None"
                    },
                    {
                       "prim":"None"
                    }
                ]
             }`);

            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });


    describe('Set sale in XTZ', async () => {
        it('Set sale buying with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_3}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${sale_asset}
                            (Pair {}
                                (Pair {}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set sale buying with XTZ should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_4}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}}
                                (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set sale buying with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_5}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });

    describe('Set sale with FA12', async () => {
        it('Set sale buying with FA12 should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_0.address);
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_6}
                    (Pair ${parseInt(FA12)}
                        (Pair 0x${sale_asset}
                            (Pair {}
                                (Pair {}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set sale buying with FA12 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_1.address);
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_7}
                    (Pair ${parseInt(FA12)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}}
                                (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set sale buying with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_2.address);
            var sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(sale == null);
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_8}
                    (Pair ${parseInt(FA12)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });


    describe('Common args test', async () => {

        it('Set sale with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkFA12Asset(fa12_ft_2.address);
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Set sale with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair ${parseInt(FA12)}
                            (Pair 0x
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Set sale with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkFA12Asset(fa12_ft_2.address);
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Set sale with NFT amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair 10
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair 0
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_s1")');
        });

        it('Set sale with sale amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair 10
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair 0
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_s0")');
        });

        it('Set sale with end date < now duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair 10
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair (Some 150000)
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_SALE_END_DATE"');
        });

        it('Set sale with end date < start date duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair 10
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair (Some ${Math.floor(Date.now() / 1000) + 200000})
                                                    (Pair (Some ${Math.floor(Date.now() / 1000) + 100000})
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_SALE_START_DATE"');
        });

        it('Set sale buying with a sale that already exists should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkFA12Asset(fa12_ft_1.address);
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_7}
                        (Pair ${parseInt(FA12)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_s2")');
        });
    });
});

describe('Set bundle sales tests', async () => {
    describe('Set bundle sale in Fungible FA2', async () => {
        it('Set bundle sale buying with Fungible FA2 should succeed (no royalties, no sale payouts, no sale origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${sale_asset}
                                (Pair {}
                                    (Pair {}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set bundle sale buying with Fungible FA2 should succeed (single royalties, single sale payouts, single sale origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());

            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1)
            ];

            const bundle = mkPackedBundle(bundle_items);

            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);

            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });


        it('Set bundle sale buying with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());
            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);

            await sales.sell_bundle({
                argMichelson: `
                (Pair 0x${bundle}
                    (Pair ${parseInt(FA2)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair None
                                            (Pair None
                                                (Pair ${max_fees}
                                                    (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);

            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });


    describe('Set bundle sale in XTZ', async () => {
        it('Set bundle sale buying with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `
                (Pair 0x${bundle}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${sale_asset}
                            (Pair {}
                                (Pair {}
                                    (Pair ${sale_amount}
                                        (Pair None
                                            (Pair None
                                                (Pair ${max_fees}
                                                    (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set bundle sale buying with XTZ should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                (Pair ${parseInt(XTZ)}
                    (Pair 0x${sale_asset}
                        (Pair { Pair "${carl.pkh}" ${payout_value}}
                            (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                (Pair ${sale_amount}
                                    (Pair None
                                        (Pair None
                                            (Pair ${max_fees}
                                                (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set bundle sale buying with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });

    describe('Set bundle sale with FA12', async () => {
        it('Set bundle sale buying with FA12 should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_0.address);
            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(FA12)}
                            (Pair 0x${sale_asset}
                                (Pair {}
                                    (Pair {}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set bundle sale buying with FA12 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_1.address);
            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                    (Pair ${parseInt(FA12)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}}
                                (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair None
                                            (Pair None
                                                (Pair ${max_fees}
                                                    (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });

        it('Set bundle sale buying with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await sales_storage.getStorage();
            const sale_asset = mkFA12Asset(fa12_ft_2.address);
            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale == null);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                    (Pair ${parseInt(FA12)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair None
                                            (Pair None
                                                (Pair ${max_fees}
                                                    (Pair None None))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                    [{
                        "prim": "Pair",
                        "args": [{
                            "string": "${carl.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    },
                    {
                        "prim": "Pair",
                        "args": [{
                            "string": "${daniel.pkh}"
                        }, {
                            "int": "${payout_value}"
                        }]
                    }],
                   {
                      "int": "${sale_amount}"
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   },
                   {
                    "int": "${max_fees}"
                },
                {
                   "prim":"None"
                },
                {
                   "prim":"None"
                }
                ]
             }`);
            assert(JSON.stringify(post_tx_sale) === JSON.stringify(expected_result));
        });
    });


    describe('Common args test', async () => {

        it('Set bundle sale with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkFA12Asset(fa12_ft_2.address);
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Set bundle sale with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                            (Pair ${parseInt(FA12)}
                                (Pair 0x
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Set bundle sale with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkFA12Asset(fa12_ft_2.address);
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Set bundle sale with wrong bundle payload should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();

                await sales.sell_bundle({
                    argMichelson: `(Pair 0x
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_BUNDLE"');
        });

        it('Set bundle sale with NFT amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 0),
                    mkBundleItem(nft.address, token_id_3, 0),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_BUNDLE_ITEM_QTY"');
        });

        it('Set bundle sale with sale amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair 0
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sb0")');
        });

        it('Set bundle sale with end date < now duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair (Some 150000)
                                                    (Pair ${max_fees}
                                                        (Pair None None)))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_SALE_END_DATE"');
        });

        it('Set bundle sale with end date < start date duration should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_3, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair (Some ${Math.floor(Date.now() / 1000) + 200000})
                                                (Pair (Some ${Math.floor(Date.now() / 1000) + 100000})
                                                    (Pair ${max_fees}
                                                        (Pair None None)))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_SALE_START_DATE"');
        });

        it('Set bundle sale buying with a sale that already exists should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_1, 1),
                    mkBundleItem(nft.address, token_id_4, 1),
                ];
                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair None
                                                    (Pair None
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sb1")');
        });
    });
});

describe('Buy tests', async () => {
    describe('Buy with Fungible FA2 sales tests', async () => {

        it('Buy with Fungible FA2 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${sale_asset}
                                        (Pair {} {}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance == 0 && custody_ft_balance == post_custody_ft_balance);
            assert(post_sales_ft_balance == sales_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy with Fungible FA2 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_1}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_1, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);

        });

        it('Buy with Fungible FA2 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_2, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_2}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_2, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Buy with XTZ sales tests', async () => {

        it('Buy with XTZ sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const sale_asset = mkXTZAsset();

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_3}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${sale_asset}
                                        (Pair {} {}))))))`,
                amount: `${sale_amount}utz`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy with XTZ sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const sale_asset = mkXTZAsset();

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_4}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                amount: `${sale_amount}utz`,
                as: bob.pkh,
            });


            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - payout * 2)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy with XTZ sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const sale_asset = mkXTZAsset();

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_5}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}))))))`,
                amount: `${sale_amount}utz`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, sales_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - 4 * payout)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Buy with FA12 sales tests', async () => {

        it('Buy with FA12 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_0, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_6, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_0.address);

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_6}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${sale_asset}
                                        (Pair {} {}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_0, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_6, sales_storage.address);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);

        });

        it('Buy with FA12 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_1, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_1.address);

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_7}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_1, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_7, sales_storage.address);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy with FA12 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_2, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, sales_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_2.address);

            var sale_record = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(sale_record != null);

            await sales.buy({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_8}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${sale_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_2, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_8, sales_storage.address);

            const protocol_fees = sale_amount * (fee / 10000);
            const royalties = sale_amount * (payout_value / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Common buy tests', async () => {
        it('Buy a non existing sale should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                await sales.buy({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair 1111
                                (Pair "${alice.pkh}"
                                    (Pair ${parseInt(FA12)}
                                        (Pair 0x${sale_asset} (Pair {} {}))))))`,
                    as: bob.pkh,
                });
            }, '"MISSING_SALE"');
        });

        it('Buy with XTZ and wrong amount should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const tokenId = 1111;
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                        (Pair ${tokenId}
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None
                                                            (Pair ${max_fees}
                                                                (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
                await sales.buy({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${tokenId}
                                    (Pair "${alice.pkh}"
                                        (Pair ${parseInt(XTZ)}
                                            (Pair 0x${sale_asset} (Pair {} {}))))))`,
                    as: bob.pkh,
                });
            }, '"AMOUNT_MISMATCH"');
        });

        it('Buy with good start date and end date should succeed', async () => {
            const sale_asset = mkXTZAsset();
            const tokenId = 9;
            const start_date = Date.now() / 1000;
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            await sales.sell({
                argMichelson: `(Pair "${nft.address}"
                        (Pair ${tokenId}
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${sale_amount}
                                                (Pair ${qty}
                                                    (Pair (Some ${Math.floor(start_date - 1)})
                                                        (Pair (Some ${Math.floor(start_date + 10)})
                                                            (Pair ${max_fees}
                                                                (Pair None None))))))))))))`,
                as: alice.pkh,
            });
            await sales.buy({
                argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${tokenId}
                                    (Pair "${alice.pkh}"
                                        (Pair ${parseInt(XTZ)}
                                            (Pair 0x${sale_asset} (Pair {} {}))))))`,
                amount: `${sale_amount}utz`,
                as: bob.pkh,
            });
        });

        it('Buy with before start date should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const tokenId = 9;
                const start_date = Date.now() / 1000;
                if (isMockup()) {
                    await setMockupNow(start_date - 2);
                }
                await sales.sell({
                    argMichelson: `(Pair "${nft.address}"
                    (Pair ${tokenId}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair ${qty}
                                                (Pair (Some ${Math.floor(start_date - 1)})
                                                    (Pair (Some ${Math.floor(start_date + 10)})
                                                        (Pair ${max_fees}
                                                            (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
                await sales.buy({
                    argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${tokenId}
                                (Pair "${alice.pkh}"
                                    (Pair ${parseInt(XTZ)}
                                        (Pair 0x${sale_asset} (Pair {} {}))))))`,
                    amouynt: `${sale_amount}utz`,
                    as: bob.pkh,
                });
            }, '"SALE_NOT_STARTED"');
        });


        it('Buy with after end date should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const tokenId = 9;
                const start_date = Date.now() / 1000;
                if (isMockup()) {
                    await setMockupNow(start_date + 100);
                }
                await sales.buy({
                    argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${tokenId}
                            (Pair "${alice.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${sale_asset} (Pair {} {}))))))`,
                    amouynt: `${sale_amount}utz`,
                    as: bob.pkh,
                });
            }, '"SALE_CLOSED"');
        });
    });
});

describe('Buy bundle tests', async () => {
    describe('Buy bundle with Fungible FA2 sales tests', async () => {

        it('Buy bundle with Fungible FA2 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());

            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${sale_asset}
                                    (Pair {} {})))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_0, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == sales_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == post_custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy bundle with Fungible FA2 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());

            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_1, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_1, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);

        });

        it('Buy bundle with Fungible FA2 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales_storage.address);
            const sales_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_2, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const sale_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());

            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                )))))`,
                as: bob.pkh
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales_storage.address);
            const post_sales_ft_balance = await getFA2Balance(fa2_ft, token_id_2, sales.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_2, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA2)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Buy bundle with XTZ sales tests', async () => {

        it('Buy bundle with XTZ sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const sale_asset = mkXTZAsset();

            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair {} {})))))`,
                as: bob.pkh,
                amount: `${sale_amount}utz`,
            });


            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - sale_amount));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy bundle with XTZ sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const sale_asset = mkXTZAsset();

            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: bob.pkh,
                amount: `${sale_amount}utz`,
            });

            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - sale_amount));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == custody_nft_balance);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy bundle with XTZ sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getBalance(sales_storage.address);
            const sales_ft_balance = await getBalance(sales.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const sale_asset = mkXTZAsset();

            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: bob.pkh,
                amount: `${sale_amount}utz`,
            });

            const post_custody_ft_balance = await getBalance(sales_storage.address);
            const post_sales_ft_balance = await getBalance(sales.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance));
            assert(post_sales_ft_balance.isEqualTo(sales_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - 4 * payout)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - sale_amount));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Buy bundle with FA12 sales tests', async () => {

        it('Buy bundle with FA12 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_0, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_0.address);

            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${sale_asset}
                                    (Pair {} {})))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_0, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = sale_amount * (fee / 10000);
            const rest = sale_amount - protocol_fees;

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == sales_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == post_custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);

        });

        it('Buy bundle with FA12 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_1, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_1.address);

            const bundle_items = [
                mkBundleItem(nft.address, token_id_1, 1),
                mkBundleItem(nft.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_1, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_7, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_sale == null);
        });

        it('Buy bundle with FA12 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await sales_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, sales_storage.address);
            const sales_ft_balance = await getFA12Balance(fa12_ft_2, sales.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, sales_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const sale_asset = mkFA12Asset(fa12_ft_2.address);

            const bundle_items = [
                mkBundleItem(nft.address, token_id_2, 1),
                mkBundleItem(nft.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var sale = await getValueFromBigMap(
                parseInt(storage.bundle_sales),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(sale != null);

            await sales.buy_bundle({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${sale_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                )))))`,
                as: bob.pkh
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, sales_storage.address);
            const post_sales_ft_balance = await getFA12Balance(fa12_ft_2, sales.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_8, sales_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(sale_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = sale_amount * (fee / 10000);
            const fee_value = sale_amount * (payout_value / 10000);
            const rest = sale_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == 0);
            assert(post_sales_ft_balance == 0);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance - sale_amount);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_sale = await getValueFromBigMap(
                parseInt(storage.sales),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${alice.pkh}" (Pair ${parseInt(FA12)} 0x${sale_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_sale == null);
        });
    });

    describe('Common bundle buy tests', async () => {
        it('Buy a non existing bundle should fail', async () => {
            await expectToThrow(async () => {
                const bundle_items = [
                    mkBundleItem(nft.address, 1111, 1),
                    mkBundleItem(nft.address, 22443, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                const sale_asset = mkXTZAsset();
                await sales.cancel_bundle_sale({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} 0x${sale_asset}))`,
                    as: alice.pkh
                });
            }, '(Pair "InvalidCondition" "r_cbs0")');
        });

        it('Buy bundle with XTZ and wrong amount should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft.address, 1111, 1),
                    mkBundleItem(nft.address, 22443, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair None
                                                (Pair None
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))))`,
                    as: alice.pkh,
                });
                await sales.buy_bundle({
                    argMichelson: `(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${sale_asset} (Pair {} {})))))`,
                    as: bob.pkh
                });
            }, '"AMOUNT_MISMATCH"');
        });

        it('Buy bundle with good start date and end date should succeed', async () => {
            const sale_asset = mkXTZAsset();
            const tokenId = 9;
            const start_date = Date.now() / 1000;
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const bundle_items = [
                mkBundleItem(nft.address, token_id_0, 1),
                mkBundleItem(nft.address, token_id_9, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            await sales.sell_bundle({
                argMichelson: `(Pair 0x${bundle}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${sale_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${sale_amount}
                                        (Pair (Some ${Math.floor(start_date - 1)})
                                            (Pair (Some ${Math.floor(start_date + 10)})
                                                (Pair ${max_fees}
                                                    (Pair None None))))))))))`,
                as: alice.pkh,
            });
            await sales.buy_bundle({
                argMichelson: `(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${sale_asset} (Pair {} {})))))`,
                amount: `${sale_amount}utz`,
                as: bob.pkh
            });

        });

        it('Buy with before start date should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const tokenId = 9;
                const start_date = Date.now() / 1000;
                if (isMockup()) {
                    await setMockupNow(start_date - 2);
                }
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_0, 1),
                    mkBundleItem(nft.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await sales.sell_bundle({
                    argMichelson: `(Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${sale_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${sale_amount}
                                            (Pair (Some ${Math.floor(start_date - 1)})
                                                (Pair (Some ${Math.floor(start_date + 10)})
                                                    (Pair ${max_fees}
                                                        (Pair None None))))))))))`,
                    as: alice.pkh,
                });
                await sales.buy_bundle({
                    argMichelson: `(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${sale_asset} (Pair {} {})))))`,
                    amount: `${sale_amount}utz`,
                    as: bob.pkh
                });
            }, '"SALE_NOT_STARTED"');
        });


        it('Buy with after end date should fail', async () => {
            await expectToThrow(async () => {
                const sale_asset = mkXTZAsset();
                const tokenId = 9;
                const start_date = Date.now() / 1000;

                if (isMockup()) {
                    await setMockupNow(start_date + 100);
                }
                const bundle_items = [
                    mkBundleItem(nft.address, token_id_0, 1),
                    mkBundleItem(nft.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await sales.buy_bundle({
                    argMichelson: `(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${sale_asset} (Pair {} {})))))`,
                    amount: `${sale_amount}utz`,
                    as: bob.pkh
                });
            }, '"SALE_CLOSED"');
        });
    });
});

describe('Cancel sale tests', async () => {
    it('Cancel a non existing sale should fail', async () => {
        await expectToThrow(async () => {
            const sale_asset = mkXTZAsset();

            await sales.cancel_sale({
                argMichelson: `(Pair "${nft.address}" (Pair 2222 (Pair ${parseInt(XTZ)} 0x${sale_asset})))`,
                as: bob.pkh,
            });
        }, '(Pair "InvalidCondition" "r_cs0")');
    });


    it('Cancel own sale should succeed', async () => {
        const sale_asset = mkXTZAsset();
        const tokenId = 1111;
        const storage = await sales_storage.getStorage();

        const tx_sale = await getValueFromBigMap(
            parseInt(storage.sales),
            exprMichelineToJson(`(Pair "${nft.address}" (Pair ${tokenId} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
            exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
        );
        assert(tx_sale != null);
        await sales.cancel_sale({
            argMichelson: `(Pair "${nft.address}" (Pair ${tokenId} (Pair ${parseInt(XTZ)} 0x${sale_asset})))`,
            as: alice.pkh,
        });
        const post_tx_sale = await getValueFromBigMap(
            parseInt(storage.sales),
            exprMichelineToJson(`(Pair "${nft.address}" (Pair ${tokenId} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))))`),
            exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
        );
        assert(post_tx_sale == null);
    });

});

describe('Cancel bundle sale tests', async () => {
    it('Cancel a non existing bundle sale should fail', async () => {
        await expectToThrow(async () => {
            const sale_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft.address, 9999999, 1),
                mkBundleItem(nft.address, 3276090, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            await sales.cancel_bundle_sale({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} 0x${sale_asset}))`,
                as: bob.pkh,
            });
        }, '(Pair "InvalidCondition" "r_cbs0")');
    });

    it('Cancel own bundle sale should succeed', async () => {
        const sale_asset = mkXTZAsset();
        const bundle_items = [
            mkBundleItem(nft.address, 1111, 1),
            mkBundleItem(nft.address, 22443, 1),
        ];

        const bundle = mkPackedBundle(bundle_items);
        const storage = await sales_storage.getStorage();

        const tx_sale = await getValueFromBigMap(
            parseInt(storage.bundle_sales),
            exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
            exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
        );
        assert(tx_sale != null);
        await sales.cancel_bundle_sale({
            argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} 0x${sale_asset}))`,
            as: alice.pkh,
        });
        const post_tx_sale = await getValueFromBigMap(
            parseInt(storage.bundle_sales),
            exprMichelineToJson(`(Pair 0x${bundle} (Pair "${alice.pkh}" (Pair ${parseInt(XTZ)} 0x${sale_asset})))`),
            exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
        );
        assert(post_tx_sale == null);
    });

});
