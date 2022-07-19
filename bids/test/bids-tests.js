const {
    deploy,
    getAccount,
    getValueFromBigMap,
    setQuiet,
    expectToThrow,
    exprMichelineToJson,
    getBalance,
    setMockupNow
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
let bids_storage;
let transfer_manager;
let bids;
let royalties;
let nft;
let nft_1;
let nft_2;
let nft_3;
let fa12_ft_0;
let fa12_ft_1;
let fa12_ft_2;
let fa12_ft_3;
let fa12_ft_4;
let fa12_ft_5;
let fa2_ft;
let fa2_ft_floor;

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
const bid_amount = 1000000;
const qty = "1";
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

    it('Fungible token 3 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_3, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_3"
            }
        );
    });

    it('Fungible token 4 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_4, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_4"
            }
        );
    });

    it('Fungible token 5 (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft_5, _] = await deploy(
            '../test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
                named: "fa12_ft_5"
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
                named: "fa2_ft"
            }
        );
    });

    it('Fungible token (FA2 Floor bids) contract deployment should succeed', async () => {
        [fa2_ft_floor, _] = await deploy(
            '../test-contracts/test-fa2-ft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "fa2_ft_floor"
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
                named: "nft"
            }
        );
    });

    it('Non Fungible token 0 (FA2) contract deployment should succeed', async () => {
        [nft_1, _] = await deploy(
            '../test-contracts/test-nft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "nft_0"
            }
        );
    });

    it('Non Fungible token 1 (FA2) contract deployment should succeed', async () => {
        [nft_2, _] = await deploy(
            '../test-contracts/test-nft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "nft_1"
            }
        );
    });

    it('Non Fungible token 2 (FA2) contract deployment should succeed', async () => {
        [nft_3, _] = await deploy(
            '../test-contracts/test-nft.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "nft_2"
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
                named: "royalties"
            }
        );
    });

    it('Bids storage contract deployment should succeed', async () => {
        [bids_storage, _] = await deploy(
            './contracts/bids-storage.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
                named: "bids_storage"
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
                named: "transfer_manager"
            }
        );
    });

    it('Bids contract deployment should succeed', async () => {
        [bids, _] = await deploy(
            './contracts/bids.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    protocol_fee: 0,
                    transfer_manager: transfer_manager.address,
                    bids_storage: royalties.address,
                },
                as: alice.pkh,
                named: "bids"
            }
        );
    });
});

describe('Bids storage setter tests', async () => {
    it('Set Bids contract as non admin should fail', async () => {
        await expectToThrow(async () => {
            await bids_storage.set_bids_contract({
                arg: {
                    sac_contract: bids.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set Bids contract as admin should succeed', async () => {
        const storage = await bids_storage.getStorage();
        assert(storage.bids_contract == null);
        await bids_storage.set_bids_contract({
            arg: {
                sac_contract: bids.address
            },
            as: alice.pkh
        });
        const post_test_storage = await bids_storage.getStorage();
        assert(post_test_storage.bids_contract == bids.address);
    });

    it('Set transfer manager as non admin should fail', async () => {
        await expectToThrow(async () => {
            await bids_storage.set_transfer_manager({
                arg: {
                    stm_contract: transfer_manager.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set transfer manager as admin should succeed', async () => {
        const storage = await bids_storage.getStorage();
        assert(storage.transfer_manager == null);
        await bids_storage.set_transfer_manager({
            arg: {
                stm_contract: transfer_manager.address
            },
            as: alice.pkh
        });
        const post_test_storage = await bids_storage.getStorage();
        assert(post_test_storage.transfer_manager == transfer_manager.address);
    });
});

describe('Bids contract setter tests', async () => {
    describe('Bids storage (Bids contract) contract setter tests', async () => {
        it('Set Bids storage contract as non admin should fail', async () => {
            await expectToThrow(async () => {
                await bids.set_bids_storage_contract({
                    arg: {
                        sbsc_contract: bids_storage.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set Bids storage contract as admin should succeed', async () => {
            const storage = await bids.getStorage();
            assert(storage.bids_storage == royalties.address);
            await bids.set_bids_storage_contract({
                arg: {
                    sbsc_contract: bids_storage.address
                },
                as: alice.pkh
            });
            const post_test_storage = await bids.getStorage();
            assert(post_test_storage.bids_storage == bids_storage.address);
        });
    });

    describe('Protocol fee setter tests', async () => {
        it('Set protocol fee as non admin should fail', async () => {
            await expectToThrow(async () => {
                await bids.set_protocol_fee({
                    arg: {
                        smd: 999
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set protocol fee as admin should succeed', async () => {
            const storage = await bids.getStorage();
            assert(storage.protocol_fee.toFixed() == BigNumber(0).toFixed());
            await bids.set_protocol_fee({
                arg: {
                    spf: fee
                },
                as: alice.pkh
            });
            const post_test_storage = await bids.getStorage();
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

describe('(Transfer manager)Authorize Bids, and Bids storage contract tests', async () => {
    it('Authorize Bids, and Bids storage contract as non admin should fail', async () => {
        await expectToThrow(async () => {
            await transfer_manager.authorize_contract({
                arg: {
                    ac_contract: bids.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Authorize Bids, and Bids storage contract as admin should succeed', async () => {
        const storage = await transfer_manager.getStorage();
        assert(storage.authorized_contracts.length == 0);
        await transfer_manager.authorize_contract({
            arg: {
                ac_contract: bids_storage.address
            },
            as: alice.pkh
        });
        await transfer_manager.authorize_contract({
            arg: {
                ac_contract: bids.address
            },
            as: alice.pkh
        });
        const post_test_storage = await transfer_manager.getStorage();
        assert(post_test_storage.authorized_contracts.length == 2);
        assert(
            post_test_storage.authorized_contracts.includes(bids.address) &&
            post_test_storage.authorized_contracts.includes(bids_storage.address)
        );

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
            await fa12_ft_3.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_3.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_3.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: bob.pkh,
            });
            await fa12_ft_4.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_4.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_4.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: bob.pkh,
            });
            await fa12_ft_5.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_5.approve({
                arg: {
                    spender: transfer_manager.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_5.approve({
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
            await fa12_ft_3.transfer({
                arg: {
                    from: alice.pkh,
                    to: bob.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });
            await fa12_ft_4.transfer({
                arg: {
                    from: alice.pkh,
                    to: bob.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });

            await fa12_ft_5.transfer({
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_0} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_1} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_2} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_3} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_4} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_5} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_6} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_7} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_8} ${initial_fa2_ft_amount / 2}) } }`,
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
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_9} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });


            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_0} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_1,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_1} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_2,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_2} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_3} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_4,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_4} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_5,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_5} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_6} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_7,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_7} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_8,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_8} ${initial_fa2_ft_amount / 2}) } }`,
                as: alice.pkh,
            });
            await fa2_ft_floor.mint({
                arg: {
                    itokenid: token_id_9,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft_floor.transfer({
                argMichelson: `{ Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${token_id_9} ${initial_fa2_ft_amount / 2}) } }`,
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
            await nft_1.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_1.mint({
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
            await nft_1.mint({
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
            await nft_1.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_1.mint({
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
            await nft_1.mint({
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
            await nft_1.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_1.mint({
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
            await nft_1.mint({
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
            await nft_1.mint({
                arg: {
                    itokenid: token_id_9,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_2.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_2.mint({
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
            await nft_2.mint({
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
            await nft_2.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_2.mint({
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
            await nft_2.mint({
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
            await nft_2.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_2.mint({
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
            await nft_2.mint({
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
            await nft_2.mint({
                arg: {
                    itokenid: token_id_9,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_3.mint({
                arg: {
                    itokenid: token_id_0,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_3.mint({
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
            await nft_3.mint({
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
            await nft_3.mint({
                arg: {
                    itokenid: token_id_3,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_3.mint({
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
            await nft_3.mint({
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
            await nft_3.mint({
                arg: {
                    itokenid: token_id_6,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await nft_3.mint({
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
            await nft_3.mint({
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
            await nft_3.mint({
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
        await nft.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: alice.pkh,
        });
        await nft_1.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: alice.pkh,
        });
        await nft_2.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: alice.pkh,
        });
        await nft_3.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: bob.pkh,
        });
        await fa2_ft_floor.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: bob.pkh,
        });
    });
});

describe('Put bid tests', async () => {
    describe('Put bids in Fungible FA2', async () => {
        it('Put bid with Fungible FA2 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);

            await bids.put_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        }, {
                            "int": "${qty}"
                        },
                        {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bid with Fungible FA2 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_1} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bid with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_2}
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);


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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Put bid with bids in XTZ', async () => {
        it('Put bid with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_3}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None None))))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put bid with XTZ should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_4}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None None))))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put bid with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_5}
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${bid_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None None))))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });

    describe('Put bid with bids in FA12', async () => {
        it('Put bid with FA12 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_0.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_6} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        }, {
                            "int": "${qty}"
                        },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bid with FA12 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_1.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_7} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bid with FA12 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_2.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_8}
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None None))))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Common args test', async () => {

        it('Put bid with unknown buy asset should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair 99 (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pb3")');
        });

        it('Put bid with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Put bid with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Put bid with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                    amount: `${bid_amount}utz`,
                });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Put bid with amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 0 (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pb0")');
        });

        it('Put bid with asset qty = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pb2")');
        });

        it('Put bid with wrong amount of XTZ should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "BID_AMOUNT_MISMATCH" (Pair 0 1000000))');
        });

        it('Put bid as non owner of the asset (FA2) should fail', async () => {
            try {
                await expectToThrow(async () => {
                    const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
                    await bids.put_bid({
                        argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                        as: carl.pkh,
                    });
                }, '(Pair "ASSET_NOT_FOUND" "ledger")');
            } catch (error) {
                assert(error.toString().includes("NO_ENTRY_FOR_USER"))
            }
        });

        it('Put bid as non owner of the asset (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: carl.pkh,
                });
            }, '(Pair "ASSET_NOT_FOUND" "ledger")');
        });

        it('Put bid with not enough balance (FA2) should fail', async () => {
            try {
                const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 99999999999999999 (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            } catch (error) {
                assert(error.value.includes("FA2_INSUFFICIENT_BALANCE"));
            }
        });

        it('Put bid with not enough balance (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 99999999999999999 (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"NotEnoughBalance"');
        });

        it('Put bid with not enough balance (XTZ) should fail', async () => {
            try {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 99999999999999999 (Pair ${qty} (Pair None (Pair None None))))))))))`,
                    as: bob.pkh,
                    amount: `99999999999999999utz`

                });
            } catch (error) {
                assert(error.includes(`Balance of contract ${bob.pkh} too low`));
            }
        });

        it('Put bid with bid that already exists should update it and succeed', async () => {
            const bid_asset = mkXTZAsset();
            const storage = await bids_storage.getStorage();

            const carl_ft_balance = await getBalance(carl.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            await bids.put_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount / 10} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                as: carl.pkh,
                amount: `${bid_amount / 10}utz`
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount / 10}"
                       },
                       {
                          "int": "${qty}"
                       },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount / 10))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount / 10))));

            await bids.put_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None))))))))))`,
                as: carl.pkh,
                amount: `${bid_amount}utz`
            });

            var new_post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );

            const new_post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const new_post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const new_expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount}"
                       },
                       {
                          "int": "${qty}"
                       },
                      {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(new_post_tx_bid) === JSON.stringify(new_expected_result));
            assert(new_post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount))));
            assert(new_post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });
});

describe('Put floor bid tests', async () => {
    describe('Put floor bids in Fungible FA2', async () => {
        it('Put floor bid with Fungible FA2 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        }, {
                            "int": "${qty}"
                       },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put floor bid with Fungible FA2 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_1.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_2.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put floor bid with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_2.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_3.address}"
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None None)
                                            ))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);


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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Put floor bid with bids in XTZ', async () => {
        it('Put floor bid with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}"
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${bid_asset}
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None None)
                                        ))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put floor bid with XTZ should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_2.address}"
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${bid_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}}
                                (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None None)
                                        )))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put floor bid with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_3.address}"
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${bid_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair ${qty}
                                            (Pair None
                                                (Pair None None)
                                        ))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });

    describe('Put floor bid with bids in FA12', async () => {
        it('Put floor bid with FA12 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_3.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        }, {
                            "int": "${qty}"
                        },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put floor bid with FA12 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_4.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_2.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put floor bid with FA12 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_5.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_3.address}"
                        (Pair ${parseInt(FA12)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None
                                                    (Pair None None)
                                            ))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "int": "${qty}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Common args test', async () => {
        it('Put floor bid with unknown buy asset payload should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair 99 (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pfb3")');
        });

        it('Put floor bid with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Put floor bid with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Put floor bid with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                    amount: `${bid_amount}utz`,
                });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Put floor bid with amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 0 (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pfb0")');
        });

        it('Put bid with asset qty = 0 should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pfb2")');
        });

        it('Put floor bid with wrong amount of XTZ should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "BID_AMOUNT_MISMATCH" (Pair 0 1000000))');
        });

        it('Put floor bid as non owner of the asset (FA2) should fail', async () => {
            try {
                await expectToThrow(async () => {
                    const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
                    await bids.put_floor_bid({
                        argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                        as: carl.pkh,
                    });
                }, '(Pair "ASSET_NOT_FOUND" "ledger")');
            } catch (error) {
                assert(error.toString().includes("NO_ENTRY_FOR_USER"))
            }
        });

        it('Put floor bid as non owner of the asset (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: carl.pkh,
                });
            }, '(Pair "ASSET_NOT_FOUND" "ledger")');
        });

        it('Put floor bid with not enough balance (FA2) should fail', async () => {
            try {
                const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            } catch (error) {
                assert(error.value.includes("FA2_INSUFFICIENT_BALANCE"));
            }
        });

        it('Put floor bid with not enough balance (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                });
            }, '"NotEnoughBalance"');
        });

        it('Put floor bid with not enough balance (XTZ) should fail', async () => {
            try {
                const bid_asset = mkXTZAsset();
                await bids.put_floor_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair ${qty} (Pair None (Pair None None)))))))))`,
                    as: bob.pkh,
                    amount: "999999999999999utz",
                });
            } catch (error) {
                assert(error.includes(`Balance of contract ${bob.pkh} too low`));
            }
        });

        it('Put floor bid with bid that already exists should update it and succeed', async () => {
            const bid_asset = mkXTZAsset();
            const storage = await bids_storage.getStorage();

            const carl_ft_balance = await getBalance(carl.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            var bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );
            assert(bid == null);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount / 10} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: carl.pkh,
                amount: `${bid_amount / 10}utz`
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount / 10}"
                       },
                       {
                          "int": "${qty}"
                       },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount / 10))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount / 10))));

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: carl.pkh,
                amount: `${bid_amount}utz`
            });

            var new_post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))'`)
            );

            const new_post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const new_post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const new_expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount}"
                       },
                       {
                          "int": "${qty}"
                       },
                      {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(new_post_tx_bid) === JSON.stringify(new_expected_result));
            assert(new_post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount))));
            assert(new_post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });
});

describe('Put bundle bid tests', async () => {
    describe('Put bundle bids in Fungible FA2', async () => {
        it('Put bundle bid with Fungible FA2 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                as: bob.pkh,
            });


            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        },
                        {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bundle bid with Fungible FA2 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_1.toString());
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                  {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bundle bid with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_2.toString());
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA2)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const post_tx_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);


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
                      "int": "${bid_amount}"
                   },
                  {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Put bundle bid with bids in XTZ', async () => {
        it('Put bundle bid with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                "prim":"Pair",
                "args":[
                   [

                   ],
                   [

                   ],
                   {
                      "int": "${bid_amount}"
                   },
                  {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                    },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put bundle bid with XTZ should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });

        it('Put bundle bid with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getBalance(bob.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });

    describe('Put bundle bid with bids in FA12', async () => {
        it('Put bundle bid with FA12 should succeed (no royalties, no bid payouts, no bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_3.address);
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);

            const expected_result = JSON.parse(`
                {
                    "prim": "Pair",
                    "args": [
                        [],
                        [], {
                            "int": "${bid_amount}"
                        },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       },
                        {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bundle bid with FA12 should succeed (single royalties, single payouts, single origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_4.address);
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA12)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });

        it('Put bundle bid with FA12 should succeed (multiple royalties, multiple payouts, multiple origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_5.address);
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            const bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);

            await bids.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair ${parseInt(FA12)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair None
                                                (Pair None None)
                    )))))))`,
                as: bob.pkh,
            });

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const post_tx_custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);

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
                      "int": "${bid_amount}"
                   },
                   {
                      "prim": "Some",
                      "args": [
                        {
                          "string": "1970-01-08T00:00:01Z"
                        }
                      ]
                   },
                   {
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + bid_amount);
        });
    });

    describe('Common args test', async () => {

        it('Put bundle bid with empty bundle should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const bundle_items = [];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${XTZ} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"BUNDLE_CANT_BE_EMPTY"');
        });

        it('Put bundle bid with unknown buy asset payload should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair 99 (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pbb1")');
        });

        it('Put bundle bid with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Put bundle bid with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Put bundle bid with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Put bundle bid with amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 0 (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "INVALID_CONDITION" "r_pbb0")');
        });

        it('Put bundle with asset qty = 0 should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 0),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"INVALID_BUNDLE_ITEM_QTY"');
        });

        it('Put bundle bid with wrong amount of XTZ should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '(Pair "BID_AMOUNT_MISMATCH" (Pair 0 1000000))');
        });

        it('Put bundle bid as non owner of the asset (FA2) should fail', async () => {
            try {
                await expectToThrow(async () => {
                    const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
                    const bundle_items = [
                        mkBundleItem(nft_1.address, token_id_2, 1),
                        mkBundleItem(nft_3.address, token_id_5, 1),
                    ];

                    const bundle = mkPackedBundle(bundle_items);
                    await bids.put_bundle_bid({
                        argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                        as: carl.pkh,
                    });
                }, '(Pair "ASSET_NOT_FOUND" "ledger")');
            } catch (error) {
                assert(error.toString().includes("NO_ENTRY_FOR_USER"))
            }
        });

        it('Put bundle bid as non owner of the asset (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: carl.pkh,
                });
            }, '(Pair "ASSET_NOT_FOUND" "ledger")');
        });

        it('Put bundle bid with not enough balance (FA2) should fail', async () => {
            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            try {
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            } catch (error) {
                assert(error.value.includes("FA2_INSUFFICIENT_BALANCE"));
            }
        });

        it('Put bundle bid with not enough balance (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                });
            }, '"NotEnoughBalance"');
        });

        it('Put bundle bid with not enough balance (XTZ) should fail', async () => {
            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            try {
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 999999999999999 (Pair None (Pair None None))))))))`,
                    as: bob.pkh,
                    amount: "999999999999999utz"
                });
            } catch (error) {
                assert(error.includes(`Balance of contract ${bob.pkh} too low`));
            }
        });

        it('Put bundle bid with too many NFTs in bundle should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_1, 1),
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                    mkBundleItem(nft_1.address, token_id_4, 1),
                    mkBundleItem(nft_1.address, token_id_5, 1),
                    mkBundleItem(nft_1.address, token_id_6, 1),
                    mkBundleItem(nft_1.address, token_id_7, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_2.address, token_id_1, 1),
                    mkBundleItem(nft_1.address, token_id_2, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: carl.pkh,
                });
            }, '(Pair "MAX_BUNDLE_SIZE" 10)');
        });

        it('Put bundle bid with incorrect bundle should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);

                await bids.put_bundle_bid({
                    argMichelson: `(Pair 0x1234 (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                    as: carl.pkh,
                });
            }, '"CANT_UNPACK_BUNDLE"');
        });

        it('Put bundle bid with bid that already exists should update it and succeed', async () => {
            const bid_asset = mkXTZAsset();
            const storage = await bids_storage.getStorage();

            const carl_ft_balance = await getBalance(carl.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid == null);

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount / 10} (Pair None (Pair None None))))))))`,
                amount: `${bid_amount / 10}utz`,
                as: carl.pkh,
            });


            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount / 10}"
                       },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount / 10))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount / 10))));

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                amount: `${bid_amount}utz`,
                as: carl.pkh,
            });

            var new_post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );

            const new_post_tx_carl_ft_balance = await getBalance(carl.pkh);
            const new_post_tx_custody_ft_balance = await getBalance(bids_storage.address);

            const new_expected_result = JSON.parse(`{
                    "prim":"Pair",
                    "args":[
                       [

                       ],
                       [

                       ],
                       {
                          "int": "${bid_amount}"
                       },
                       {
                          "prim": "Some",
                          "args": [
                            {
                              "string": "1970-01-08T00:00:01Z"
                            }
                          ]
                       },
                       {
                          "prim":"None"
                       },
                       {
                          "prim":"None"
                       }
                    ]
                 }`);
            assert(JSON.stringify(new_post_tx_bid) === JSON.stringify(new_expected_result));
            assert(new_post_tx_carl_ft_balance.isLessThan(carl_ft_balance.minus(BigNumber(bid_amount))));
            assert(new_post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(bid_amount))));
        });
    });
});

describe('Accept bid tests', async () => {
    describe('Accept FA2 bid tests', async () => {

        it('Accept FA2 bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset} (Pair {} {}))))))`,
                as: alice.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA2 bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_1}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair {Pair "${carl.pkh}" ${payout_value}} {Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_1, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA2 bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_2, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_2}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                    )))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_2, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept XTZ Bid tests', async () => {

        it('Accept XTZ Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_3}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset} (Pair {} {}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_4}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset}
                                        (Pair {Pair "${carl.pkh}" ${payout_value}} {Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_5}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                    )))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept FA12 Bid tests', async () => {

        it('Accept FA12 Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_0.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_0, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_6, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);


            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_6}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair {} {}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_0, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_6, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA12 Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_1.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_1, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_7}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_1, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_7, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA12 Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_2.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_2, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);
            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_8}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_2, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_8, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

    });

    describe('Common Accept bid tests', async () => {
        it('Accept a non existing bid should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_2.address);

                await bids.accept_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair 999999
                                (Pair "${bob.pkh}"
                                    (Pair ${parseInt(FA12)}
                                        (Pair 0x${bid_asset}
                                            (Pair {} {}))))))`,
                    as: alice.pkh,
                });
            }, '"MISSING_BID"');
        });
    });
});

describe('Accept floor bid tests', async () => {
    describe('Accept FA2 floor bid tests', async () => {

        it('Accept FA2 floor bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_1, token_id_0, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_1, token_id_0, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_1.address}"
                        (Pair ${token_id_0}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair {} {}))))))`,
                as: alice.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_1, token_id_0, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_1, token_id_0, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA2 floor bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_1.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_2, token_id_1, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_2, token_id_1, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_2.address}"
                        (Pair ${token_id_1}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_2, token_id_1, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_2, token_id_1, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA2 floor bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_2.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_3, token_id_2, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_3, token_id_2, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_3.address}"
                        (Pair ${token_id_2}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                    )))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_3, token_id_2, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_3, token_id_2, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept XTZ floor Bid tests', async () => {

        it('Accept XTZ floor Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_1, token_id_3, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_1, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_1, token_id_3, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_1.address}"
                        (Pair ${token_id_3}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset}
                                        (Pair {} {}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_1, token_id_3, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_1, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_1, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ floor Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_2, token_id_4, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_2, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_2, token_id_4, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_2.address}"
                        (Pair ${token_id_4}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_2, token_id_4, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_2, token_id_4, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_2, token_id_4, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ floor Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_3, token_id_5, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_3.address}"
                        (Pair ${token_id_5}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(XTZ)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                    )))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_3, token_id_5, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest - 4 * payout)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept FA12 floor Bid tests', async () => {

        it('Accept FA12 floor Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_3.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_3, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_3, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_3, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_3, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_1, token_id_6, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_1, token_id_6, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_1, token_id_6, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_1.address}"
                        (Pair ${token_id_6}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair {} {}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_3, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_3, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_3, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_3, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft_1, token_id_6, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_1, token_id_6, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_1, token_id_6, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA12 floor Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_4.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_4, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_4, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_4, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_4, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_2, token_id_7, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_2, token_id_7, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_2, token_id_7, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_2.address}"
                        (Pair ${token_id_7}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}}))))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_4, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_4, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_4, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_4, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft_2, token_id_7, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_2, token_id_7, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_2, token_id_7, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_2.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA12 floor Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_5.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_5, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_5, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_5, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_5, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft_3, token_id_8, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft_3, token_id_8, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft_3, token_id_8, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_3.address}"
                        (Pair ${token_id_8}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA12)}
                                    (Pair 0x${bid_asset}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})
                    )))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_5, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_5, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_5, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_5, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft_3, token_id_8, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft_3, token_id_8, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_3, token_id_8, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 4);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == 0 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.floor_bids),
                exprMichelineToJson(`(Pair "${nft_3.address}" (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset}))))`),
                exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

    });

    describe('Common Accept floor bid tests', async () => {
        it('Accept a non existing floor bid should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_5.address);
                await bids.accept_floor_bid({
                    argMichelson: `
                        (Pair "${nft_1.address}"
                            (Pair 99999999
                                (Pair "${bob.pkh}"
                                    (Pair ${parseInt(FA2)}
                                        (Pair 0x${bid_asset}
                                            (Pair {} {}))))))`,
                    as: alice.pkh,
                });
            }, '"MISSING_BID"');
        });
    });
});

describe('Accept bundle bid tests', async () => {
    describe('Accept FA2 bundle bid tests', async () => {

        it('Accept FA2 bundle bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_0.toString());

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair {} {})))))`,
                as: alice.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_0, daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);


            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA2 bundle bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_1.toString());
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA2)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_1, daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA2 bundle bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft_floor.address, token_id_2.toString());
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);
            const bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids_storage.address);
            const post_bids_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft_floor, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft_3, token_id_2, bids_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);


            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept XTZ bundle Bid tests', async () => {

        it('Accept XTZ bundle Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            var bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${bid_asset}
                                    (Pair {} {})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ bundle Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ bundle Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getBalance(bids_storage.address);
            const bids_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(XTZ)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_bids_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(bid_amount)));
            assert(post_bids_ft_balance.isEqualTo(bids_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest - 4 * payout)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });
    });

    describe('Accept FA12 bundle Bid tests', async () => {

        it('Accept FA12 bundle Bid (no royalties, no origin fees, no payouts,) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_3.address);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_3, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_3, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_3, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_3, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${bid_asset}
                                    (Pair {} {})))))`,
                as: alice.pkh,
            });


            const post_custody_ft_balance = await getFA12Balance(fa12_ft_3, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_3, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_3, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_3, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_3, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_3, daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA12 bundle Bid (single royalties, single origin fees, single payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_4.address);

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_4, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_4, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_4, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_4, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA12)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}} { Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_4, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_4, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_4, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_4, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_4, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_4, daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA12 bundle Bid (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_5.address);
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);
            const bids_ft_balance = await getFA12Balance(fa12_ft_5, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_5, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_5, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_5, daniel.pkh);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(bid_record != null);

            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}} { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}})))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_5, bids_storage.address);
            const post_bids_ft_balance = await getFA12Balance(fa12_ft_5, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_5, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_5, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_5, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_5, daniel.pkh);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);


            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_bids_ft_balance == bids_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bundle_bids),
                exprMichelineToJson(`(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`),
                exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
            );
            assert(post_tx_bid == null);
        });

    });

    describe('Common Accept bundle bid tests', async () => {
        it('Accept a non existing bundle bid should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_5.address);
                const bundle_items = [
                    mkBundleItem(nft_1.address, 99999999999, 1),
                    mkBundleItem(nft_3.address, token_id_5, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await bids.accept_bundle_bid({
                    argMichelson: `(Pair 0x${bundle} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} {})))))`,
                    as: alice.pkh,
                });
            }, '"MISSING_BID"');
        });
    });
});

describe('Cancel bid tests', async () => {
    it('Cancel a non existing bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFA12Asset(fa12_ft_2.address);

            await bids.cancel_bid({
                argMichelson: `(Pair "${nft.address}" (Pair 999999 (Pair ${parseInt(FA12)} 0x${bid_asset}))))`,
                as: bob.pkh,
            });
        }, '"MISSING_BID"');
    });

    it('Cancel a valid bid should succeed', async () => {
        const bid_asset = mkXTZAsset();

        await bids.cancel_bid({
            argMichelson: `(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair ${parseInt(XTZ)} 0x${bid_asset}))))`,
            as: carl.pkh,
        });
        const storage = await bids_storage.getStorage();

        var post_tx_bid = await getValueFromBigMap(
            parseInt(storage.bids),
            exprMichelineToJson(`(Pair "${nft_1.address}" (Pair ${token_id_9} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
            exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
        );
        assert(post_tx_bid == null);
    });
});

describe('Cancel floor bid tests', async () => {
    it('Cancel a non existing floor bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFA12Asset(fa12_ft_2.address);

            await bids.cancel_floor_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${parseInt(FA12)} 0x${bid_asset})))`,
                as: bob.pkh,
            });
        }, '"MISSING_BID"');
    });


    it('Cancel a valid floor bid should succeed', async () => {
        const bid_asset = mkXTZAsset();

        await bids.cancel_floor_bid({
            argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(XTZ)} 0x${bid_asset}))`,
            as: carl.pkh,
        });
        const storage = await bids_storage.getStorage();

        var post_tx_bid = await getValueFromBigMap(
            parseInt(storage.floor_bids),
            exprMichelineToJson(`(Pair "${nft_1.address}" (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
            exprMichelineToJson(`(pair address (pair address (pair int bytes)))`)
        );
        assert(post_tx_bid == null);
    });
});

describe('Cancel bundle bid tests', async () => {
    it('Cancel a non existing bundle bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFA12Asset(fa12_ft_2.address);
            const bundle_items = [
                mkBundleItem(nft_1.address, 99999999999, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            await bids.cancel_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA12)} 0x${bid_asset}))`,
                as: bob.pkh,
            });
        }, '"MISSING_BID"');
    });

    it('Cancel a valid bundle bid should succeed', async () => {
        const bid_asset = mkXTZAsset();

        const bundle_items = [
            mkBundleItem(nft_1.address, token_id_0, 1),
            mkBundleItem(nft_2.address, token_id_3, 1),
        ];
        const bundle = mkPackedBundle(bundle_items);

        await bids.cancel_bundle_bid({
            argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(XTZ)} 0x${bid_asset}))`,
            as: carl.pkh,
        });
        const storage = await bids_storage.getStorage();

        var post_tx_bid = await getValueFromBigMap(
            parseInt(storage.bundle_bids),
            exprMichelineToJson(`(Pair 0x${bundle} (Pair "${carl.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))`),
            exprMichelineToJson(`(pair bytes (pair address (pair int bytes)))`)
        );
        assert(post_tx_bid == null);
    });
});

describe('Expiry tests', async () => {

    it('Accept an expired bid should fail', async () => {
        await expectToThrow(async () => {

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            const start_date = Date.now() / 1000

            await setMockupNow(start_date);
            await bids.put_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None
                                                        (Pair None None))))))))))`,
                as: bob.pkh,
            });

            await setMockupNow(start_date + 907200);


            await bids.accept_bid({
                argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset} (Pair {} {}))))))`,
                as: alice.pkh,
            });
        }, '"EXPIRED_BID"');
    });

    it('Accept an expired floor bid should fail', async () => {
        await expectToThrow(async () => {

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            const start_date = Date.now() / 1000

            await setMockupNow(start_date);

            await bids.put_floor_bid({
                argMichelson: `(Pair "${nft_1.address}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None (Pair None None)))))))))`,
                as: bob.pkh,
            });

            await setMockupNow(start_date + 907200);


            await bids.accept_floor_bid({
                argMichelson: `
                    (Pair "${nft_1.address}"
                        (Pair ${token_id_0}
                            (Pair "${bob.pkh}"
                                (Pair ${parseInt(FA2)}
                                    (Pair 0x${bid_asset}
                                        (Pair {} {}))))))`,
                as: alice.pkh,
            });
        }, '"EXPIRED_BID"');
    });

    it('Accept an expired bundle bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const start_date = Date.now() / 1000

            await setMockupNow(start_date);

            await bids.put_bundle_bid({
                argMichelson: `(Pair 0x${bundle} (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair None (Pair None None))))))))`,
                as: bob.pkh,
            });

            await setMockupNow(start_date + 907200);


            await bids.accept_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair {} {})))))`,
                as: alice.pkh,
            });
        }, '"EXPIRED_BID"');
    });
});