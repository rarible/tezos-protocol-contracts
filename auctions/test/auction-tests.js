const {
    deploy,
    getAccount,
    getValueFromBigMap,
    setQuiet,
    expectToThrow,
    exprMichelineToJson,
    setMockupNow,
    isMockup,
    getBalance } = require('@completium/completium-cli');
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
let auction_storage;
let transfer_manager;
let auction;
let royalties;
let nft;
let nft_1;
let nft_2;
let nft_3;
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
const minimal_price = 10;
const buyout_price = 1000000000;
const min_step = 2;
const payout_value = 100;
const bid_amount = 1000000;
const duration = 1000;
const max_fees = 1000;
const auction_amount = "1";
const start_date = Date.now() / 1000;
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
            }
        );
    });

    it('Auction storage contract deployment should succeed', async () => {
        [auction_storage, _] = await deploy(
            './contracts/auction-storage.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
            }
        );
    });

    it('Transfer manager contract deployment should succeed', async () => {
        [transfer_manager, _] = await deploy(
            '../transfer-manager/contracts/transfer-manager.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    auction_storage: royalties.address,
                    royalties_provider: nft.address,
                    default_fee_receiver: carl.pkh,
                },
                as: alice.pkh,
            }
        );
    });

    it('Auction contract deployment should succeed', async () => {
        [auction, _] = await deploy(
            './contracts/auction.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    protocol_fee: 0,
                    transfer_manager: transfer_manager.address,
                    auction_storage: royalties.address,
                },
                as: alice.pkh,
            }
        );
    });
});

describe('Auction storage setter tests', async () => {
    it('Set auction contract as non admin should fail', async () => {
        await expectToThrow(async () => {
            await auction_storage.set_auction_contract({
                arg: {
                    sac_contract: auction.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set auction contract as admin should succeed', async () => {
        const storage = await auction_storage.getStorage();
        assert(storage.auction_contract == null);
        await auction_storage.set_auction_contract({
            arg: {
                sac_contract: auction.address
            },
            as: alice.pkh
        });
        const post_test_storage = await auction_storage.getStorage();
        assert(post_test_storage.auction_contract == auction.address);
    });

    it('Set transfer manager as non admin should fail', async () => {
        await expectToThrow(async () => {
            await auction_storage.set_transfer_manager({
                arg: {
                    stm_contract: transfer_manager.address
                },
                as: bob.pkh
            });
        }, errors.INVALID_CALLER);
    });

    it('Set transfer manager as admin should succeed', async () => {
        const storage = await auction_storage.getStorage();
        assert(storage.transfer_manager == null);
        await auction_storage.set_transfer_manager({
            arg: {
                stm_contract: transfer_manager.address
            },
            as: alice.pkh
        });
        const post_test_storage = await auction_storage.getStorage();
        assert(post_test_storage.transfer_manager == transfer_manager.address);
    });
});

describe('Auction contract setter tests', async () => {
    describe('Auction storage (Auction contract) contract setter tests', async () => {
        it('Set auction storage contract as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_auction_storage_contract({
                    arg: {
                        sacs_contract: auction_storage.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set auction storage contract as admin should succeed', async () => {
            const storage = await auction.getStorage();
            assert(storage.auction_storage == royalties.address);
            await auction.set_auction_storage_contract({
                arg: {
                    sacs_contract: auction_storage.address
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.auction_storage == auction_storage.address);
        });
    });

    describe('Bundle and fees setter tests', async () => {
        it('Set bundle max limit as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_max_bundle_items({
                    arg: {
                        smbi_number: 11
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set max fees limit as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_fees_limit({
                    arg: {
                        sfl: 11
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set bundle max limit as admin should succeed', async () => {
            const storage = await auction.getStorage();
            assert(storage.max_bundle_items == 10);
            await auction.set_max_bundle_items({
                arg: {
                    smbi_number: 11
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.max_bundle_items == 11);
            await auction.set_max_bundle_items({
                arg: {
                    smbi_number: 10
                },
                as: alice.pkh
            });
            const final_test_storage = await auction.getStorage();
            assert(final_test_storage.max_bundle_items == 10);
        });

        it('Set max fees limit as admin should succeed', async () => {
            const storage = await auction.getStorage();
            assert(storage.max_fees_limit == 10000);
            await auction.set_fees_limit({
                arg: {
                    sfl: 11
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.max_fees_limit == 11);
            await auction.set_fees_limit({
                arg: {
                    sfl: 10000
                },
                as: alice.pkh
            });
            const final_test_storage = await auction.getStorage();
            assert(final_test_storage.max_fees_limit == 10000);
        });
    });

    describe('(Transfer manager)Authorize Auction, and auction storage contract tests', async () => {
        it('Authorize Auction, and auction storage contract as non admin should fail', async () => {
            await expectToThrow(async () => {
                await transfer_manager.authorize_contract({
                    arg: {
                        ac_contract: auction_storage.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Authorize Auction, and auction storage contract as admin should succeed', async () => {
            const storage = await transfer_manager.getStorage();
            assert(storage.authorized_contracts.length == 0);
            await transfer_manager.authorize_contract({
                arg: {
                    ac_contract: auction_storage.address
                },
                as: alice.pkh
            });
            await transfer_manager.authorize_contract({
                arg: {
                    ac_contract: auction.address
                },
                as: alice.pkh
            });
            const post_test_storage = await transfer_manager.getStorage();
            assert(post_test_storage.authorized_contracts.length == 2);
            assert(
                post_test_storage.authorized_contracts.includes(auction_storage.address) &&
                post_test_storage.authorized_contracts.includes(auction.address)

            );

        });
    });

    describe('Extension duration setter tests', async () => {
        it('Set extension duration as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_extension_duration({
                    arg: {
                        sed: 999
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set extension duration as admin should succeed', async () => {
            const extension = 10;
            //const storage = await auction.getStorage();
            //assert(storage.extension_duration.toFixed() == BigNumber(900).toFixed());
            await auction.set_extension_duration({
                arg: {
                    sed: extension
                },
                as: alice.pkh
            });
            //const post_test_storage = await auction.getStorage();
            //assert(post_test_storage.extension_duration.toFixed() == BigNumber(extension).toFixed());
        });
    });

    describe('Max duration setter tests', async () => {
        it('Set max duration as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_max_duration({
                    arg: {
                        smd: 999
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set max duration as admin should succeed', async () => {
            const max = 43200000;
            const storage = await auction.getStorage();
            assert(storage.max_duration.toFixed() == BigNumber(86400000).toFixed());
            await auction.set_max_duration({
                arg: {
                    smd: max
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.max_duration.toFixed() == BigNumber(max).toFixed());
        });
    });

    describe('Protocol fee setter tests', async () => {
        it('Set protocol fee as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_protocol_fee({
                    arg: {
                        smd: 999
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set protocol fee as admin should succeed', async () => {
            const storage = await auction.getStorage();
            assert(storage.protocol_fee.toFixed() == BigNumber(0).toFixed());
            await auction.set_protocol_fee({
                arg: {
                    spf: fee
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
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

    it('Add auction contract as operator for NFT and FT', async () => {
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
            as: alice.pkh,
        });
        await fa2_ft.update_operators_for_all({
            argMichelson: `{Left "${transfer_manager.address}"}`,
            as: bob.pkh,
        });
    });
});

describe('Start Auction tests', async () => {
    describe('Auction with bids in Fungible FA2', async () => {
        it('Starting auction buying with Fungible FA2 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_0.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA2}
                                    (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString())}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );

            const expected_result = JSON.parse(`
                [
                    {
                        "int": "${auction_amount}"
                    }, {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
                    [],
                    [], {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
                ]
            `);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));

            const post_alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with Fungible FA2 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_1.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA2}
                                    (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString())}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );

            const expected_result = JSON.parse(`
                [
                    {
                        "int": "${auction_amount}"
                    }, {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
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
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
                ]
            `);

            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_1, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with Fungible FA2 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_2, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_2.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA2}
                                    (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString())}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );

            const expected_result = JSON.parse(`
            [
                    {
                        "int": "${auction_amount}"
                    }, {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
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
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
            ]`);

            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_2, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });
    });

    describe('Auction with bids in XTZ', async () => {
        it('Starting auction buying with XTZ should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_3.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`
            [
                    {
                        "int": "${auction_amount}"
                    }, {
                        "int": "${XTZ}"
                    }, {
                        "bytes": "${mkXTZAsset()}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
                    [],
                    [],
                    {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with XTZ should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_4.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`[
                {
                    "int": "${auction_amount}"
                }, {
                    "int": "${XTZ}"
                }, {
                    "bytes": "${mkXTZAsset()}"
                }, {
                    "prim": "None"
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
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
                    "prim": "None"
                },
                {
                    "prim": "None"
                }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with XTZ should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_5.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`
                [{
                    "int": "${auction_amount}"
                }, {
                    "int": "${XTZ}"
                }, {
                    "bytes": "${mkXTZAsset()}"
                }, {
                    "prim": "None"
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
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
                    "prim": "None"
                },
                {
                    "prim": "None"
                }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });
    });

    describe('Auction with bids in FA12', async () => {
        it('Starting auction buying with FA12 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_6, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_6.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA12}
                                    (Pair 0x${mkFA12Asset(fa12_ft_0.address)}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`
            [{
                "int": "${auction_amount}"
            }, {
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_0.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
            [],
            [],
            {
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_6, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with FA12 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_7.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA12}
                                    (Pair 0x${mkFA12Asset(fa12_ft_1.address)}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`
            [{
                "int": "${auction_amount}"
            }, {
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_1.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
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
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_7, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });

        it('Starting auction buying with Fungible FA12 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auctions == null);

            const alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, auction_storage.address);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_8.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA12}
                                    (Pair 0x${mkFA12Asset(fa12_ft_2.address)}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            const expected_result = JSON.parse(`
            [{
                "int": "${auction_amount}"
            }, {
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_2.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
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
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_8, auction_storage.address);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_custody_nft_balance == custody_nft_balance + 1);
        });
    });

    describe('Common args test', async () => {
        it('Starting auction with unknown buy asset payload should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                            (Pair ${token_id_9.toString()}
                                (Pair ${auction_amount}
                                    (Pair 99
                                        (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa1")');
        });

        it('Starting auction with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                            (Pair ${token_id_9.toString()}
                                (Pair ${auction_amount}
                                    (Pair ${FA2}
                                        (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA2_BUY_ASSET"');
        });

        it('Starting auction with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA12}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA12_BUY_ASSET"');
        });

        it('Starting auction with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkFA12Asset(fa12_ft_0.address)}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '"WRONG_BUY_ASSET_PAYLOAD"');
        });

        it('Starting auction with NFT amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair 0
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa7")');
        });

        it('Starting auction with not enough NFT balance should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair 999999999999999
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '"FA2_INSUFFICIENT_BALANCE"');
        });

        it('Starting auction with duration < extension duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair 1
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa2")');
        });

        it('Starting auction with duration > max_duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair 9999999999999999999
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa3")');
        });

        it('Starting auction with buyout price < min price should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${buyout_price}
                                                        (Pair ${minimal_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa4")');
        });

        it('Starting auction with min step = 0 should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair 0
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa6")');
        });

        it('Starting auction with start date in the past should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some 123456)
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '"AUCTION_START_DATE_IN_THE_PAST"');
        });

        it('Starting auction buying with Fungible FA2 that already exists should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_0.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA2}
                                    (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString())}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa8")');
        });

        it('Starting auction with max seller fees = 0 should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair 0
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa9")');
        });

        it('Starting auction with max seller fees > max possible fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair 999999999999
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa9")');
        });

        it('Starting auction with max seller fees < protocol fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair 100
                                                                    (Pair {}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa9")');
        });

        it('Starting auction with origin fees + protocol fees > max fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                        (Pair ${token_id_9.toString()}
                            (Pair ${auction_amount}
                                (Pair ${XTZ}
                                    (Pair 0x${mkXTZAsset()}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair 100
                                                                    (Pair {Pair "${alice.pkh}" 11000}
                                                                        (Pair {}
                                                                            (Pair None None)
                    )))))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa9")');
        });
    });
});

describe('Start bundle Auction tests', async () => {
    describe('Bundle Auction with bids in Fungible FA2', async () => {
        it('Starting bundle auction buying with Fungible FA2 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_1.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA2}
                            (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString())}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair {}
                                                            (Pair {}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
                [
                    {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
                    [],
                    [], {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
                ]
            `);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });

        it('Starting bundle auction buying with Fungible FA2 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_1, 1),
                mkBundleItem(nft_1.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA2}
                            (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString())}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                            (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
                [
                    {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
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
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
                ]
            `);

            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });

        it('Starting bundle auction buying with Fungible FA2 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_1.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA2}
                            (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString())}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
            [
                    {
                        "int": "${FA2}"
                    }, {
                        "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString())}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
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
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
            ]`);

            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });
    });

    describe('Bundle Auction with bids in XTZ', async () => {
        it('Starting bundle auction buying with XTZ should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${XTZ}
                            (Pair 0x${mkXTZAsset()}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair {}
                                                            (Pair {}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
            [
                    {
                        "int": "${XTZ}"
                    }, {
                        "bytes": "${mkXTZAsset()}"
                    }, {
                        "prim": "None"
                    }, {
                        "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                    }, {
                        "int": "${minimal_price}"
                    }, {
                        "int": "${buyout_price}"
                    }, {
                        "int": "${min_step}"
                    }, {
                        "int": "${max_fees}"
                    },
                    [],
                    [],
                    {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });

        it('Starting bundle auction buying with XTZ should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();
            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_2.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${XTZ}
                            (Pair 0x${mkXTZAsset()}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                            (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`[
                {
                    "int": "${XTZ}"
                }, {
                    "bytes": "${mkXTZAsset()}"
                }, {
                    "prim": "None"
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
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
                    "prim": "None"
                },
                {
                    "prim": "None"
                }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });

        it('Starting bundle auction buying with XTZ should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_2, 1),
                mkBundleItem(nft_2.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${XTZ}
                            (Pair 0x${mkXTZAsset()}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
                [{
                    "int": "${XTZ}"
                }, {
                    "bytes": "${mkXTZAsset()}"
                }, {
                    "prim": "None"
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
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
                    "prim": "None"
                },
                {
                    "prim": "None"
                }
            ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });
    });

    describe('Bundle Auction with bids in FA12', async () => {
        it('Starting bundle auction buying with FA12 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_0, 1),
                mkBundleItem(nft_3.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA12}
                            (Pair 0x${mkFA12Asset(fa12_ft_0.address)}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair {}
                                                            (Pair {}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
            [{
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_0.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
            [],
            [],
            {
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });

        it('Starting bundle auction buying with FA12 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA12}
                            (Pair 0x${mkFA12Asset(fa12_ft_1.address)}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}}
                                                            (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
            [{
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_1.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
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
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);

        });

        it('Starting bundle auction buying with Fungible FA12 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date);
            }
            const start_time = Math.floor(start_date + 1);
            const storage = await auction_storage.getStorage();

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auctions == null);

            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA12}
                            (Pair 0x${mkFA12Asset(fa12_ft_2.address)}
                                (Pair (Some ${start_time})
                                    (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                                                (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            const expected_result = JSON.parse(`
            [{
                "int": "${FA12}"
            }, {
                "bytes": "${mkFA12Asset(fa12_ft_2.address)}"
            }, {
                "prim": "None"
            }, {
                "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "string": "${new Date((start_time + duration) * 1000).toISOString().split('.')[0] + "Z"}"
            }, {
                "int": "${minimal_price}"
            }, {
                "int": "${buyout_price}"
            }, {
                "int": "${min_step}"
            }, {
                "int": "${max_fees}"
            },
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
                "prim": "None"
            },
            {
                "prim": "None"
            }
        ]`);
            assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 + 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 + 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0 - 1);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1 - 1);
        });
    });

    describe('Common bundle args test', async () => {

        it('Starting bundle auction with unknown buy asset payload should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair 99
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                        (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });

            }, '(Pair "InvalidCondition" "r_sba1")');
        });

        it('Starting bundle auction with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${FA2}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                        (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });

            }, '"CANT_UNPACK_FA2_BUY_ASSET"');
        });

        it('Starting bundle auction with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${FA12}
                                (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_FA12_BUY_ASSET"');
        });

        it('Starting bundle auction with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkFA12Asset(fa12_ft_0.address)}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"WRONG_BUY_ASSET_PAYLOAD"');
        });

        it('Starting bundle auction with NFT amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 0),
                    mkBundleItem(nft_1.address, token_id_8, 0),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"INVALID_BUNDLE_ITEM_QTY"');
        });

        it('Starting bundle auction with not enough NFT balance should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 99999999999),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"FA2_INSUFFICIENT_BALANCE"');
        });

        it('Starting bundle auction with too many NFT in bundle should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);
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

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "MAX_BUNDLE_SIZE" 10)');
        });

        it('Starting bundle auction with duration < extension duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                        (Pair 1
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });

            }, '(Pair "InvalidCondition" "r_sba2")');
        });

        it('Starting bundle auction with duration > max_duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair 9999999999999999
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba3")');
        });

        it('Starting bundle auction with buyout price < min price should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${buyout_price}
                                                    (Pair ${minimal_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba4")');
        });

        it('Starting bundle auction with min_step = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair 0
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba6")');
        });

        it('Starting bundle auction with start date in the past should fail', async () => {
            await expectToThrow(async () => {
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some 15678)
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"AUCTION_START_DATE_IN_THE_PAST"');
        });

        it('Starting bundle auction with invalid bundle should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x1234
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '"CANT_UNPACK_BUNDLE"');
        });

        it('Starting bundle auction buying with Fungible FA2 that already exists should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                        )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba7")');
        });

        it('Starting auction with max seller fees = 0 should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair 0
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba8")');
        });

        it('Starting auction with max seller fees > max possible fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                    (Pair (Some ${start_time})
                                        (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair 9999999999
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba8")');
        });

        it('Starting auction with max seller fees < protocol fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair 100
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba8")');
        });

        it('Starting auction with origin fees + protocol fees > max fees should fail', async () => {
            await expectToThrow(async () => {
                const start_time = Math.floor(start_date + 1);
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_9, 1),
                    mkBundleItem(nft_1.address, token_id_8, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${XTZ}
                                (Pair 0x${mkXTZAsset()}
                                        (Pair (Some ${start_time})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair 100
                                                                (Pair {Pair "${alice.pkh}" 11000}
                                                                    (Pair {}
                                                                        (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sba8")');
        });
    });
});

describe('Put bid tests', async () => {
    describe('Put bid common tests', async () => {
        it('Put bid with amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 0
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pb0")');
        });

        it('Put bid with not enough balance should fail', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            try {
                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 9999999999999999
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            } catch (error) {
                error.value.includes('"FA2_INSUFFICIENT_BALANCE"')
            }
        });

        it('Put bid for another user should fail should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: carl.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pb1")');
        });

        it('Put bid on a non existing auction should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair 123456
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Put bid on an auction not started should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) - 400);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_IN_PROGRESS"');

        });

        it('Put bid on an auction already finished should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 400000000);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_FINISHED"');

        });

        it('Put bid with an amount < minimal step should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                await auction.put_bid({
                    argMichelson: `
                        (Pair "${nft.address}"
                            (Pair ${token_id_0}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 1
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');

        });
    });

    describe('Put bid with exiting bids or buyout tests', async () => {

        it('Put bid with existing bid should send back funds to previous bidder', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const start_time = Math.floor(Date.now() / 1000 + 41);

            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                    (Pair ${token_id_9.toString()}
                        (Pair ${auction_amount}
                            (Pair ${FA2}
                                (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                                        (Pair (Some ${start_time})
                                            (Pair 200
                                                (Pair ${minimal_price}
                                                    (Pair ${parseInt(bid_amount) + 2}
                                                        (Pair 1
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });

            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 42);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_9}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount - 1}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount + 1);
            assert(alice_ft_balance == post_alice_ft_balance);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount - 1 &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_9}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair "${alice.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: alice.pkh,
            });



            const post_alice_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );

            assert(
                post_alice_bid.args[3].prim == 'Some' &&
                post_alice_bid.args[3].args[0].args[2].int == bid_amount &&
                post_alice_bid.args[3].args[0].args[3].string == alice.pkh
            );

            const post_alice_bid_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_bid_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            assert(post_alice_bid_bob_ft_balance == post_bob_ft_balance + bid_amount - 1 && post_alice_bid_bob_ft_balance == bob_ft_balance);
            assert(alice_ft_balance == post_alice_bid_alice_ft_balance + bid_amount);
        });

        it('Put bid > buyout should close auction and succeed', async () => {
            const new_bid_amount = parseInt(bid_amount) + 100;

            const storage = await auction_storage.getStorage();

            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_9, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_9, daniel.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction_storage.address);
            const custody_nft_balance = await getFA2Balance(nft, token_id_9, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_9, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_9, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_9}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${new_bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_9, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_9, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_9, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_9, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_9, bob.pkh);

            const protocol_fees = Math.floor(new_bid_amount * (fee / 10000));
            const rest = new_bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + bid_amount + rest);
            assert(post_bob_ft_balance == bob_ft_balance - new_bid_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Put bid Fungible FA2 tests', async () => {
        it('Put bid with good amount of Fungible FA2 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_0}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bid with good amount of Fungible FA2 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_1}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}}
                                (Pair {Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bid with good amount of Fungible FA2 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_2}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][1].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put identical bid should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                await auction.put_bid({
                    argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount + 3}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_ALREADY_EXISTS"');
        });

        it('Put bid with amount < last bid should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                await auction.put_bid({
                    argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_0}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount - 1}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');
        });
    });

    describe('Put bid XTZ tests', async () => {
        it('Put bid with mismatch between bid amount and XTZ transferred', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                await auction.put_bid({
                    argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id_3}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                        )))))))
                    `,
                    amount: `${bid_amount + 1}utz`,
                    as: bob.pkh,
                });
            }, '(Pair "AUCTION_BID_AMOUNT_MISMATCH" (Pair 1000001 1000000))');
        });

        it('Put bid with good amount of XTZ (no bid origin fees, no payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_3}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );

            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });

        it('Put bid with good amount of XTZ (single bid origin fees, single payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_4}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}}
                                (Pair {Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value
            );

            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });

        it('Put bid with good amount of XTZ (multiple bid origin fees, multiple payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_5}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][1].args[1].int == payout_value
            );


            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });
    });

    describe('Put bid FA12 tests', async () => {
        it('Put bid with good amount of FA12 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_6}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bid with good amount of FA12 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_7}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}}
                                (Pair {Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });


            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bid with good amount of FA12 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair "${alice.pkh}"
                            (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair {Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh &&
                post_bid.args[3].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[3].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[3].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[3].args[0].args[1][1].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });
    });
});

describe('Put bundle bid tests', async () => {
    describe('Put bundle bid common tests', async () => {
        it('Put bundle bid with amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 0
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pbb0")');
        });

        it('Put bundle bid with not enough balance should fail', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            try {
                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 9999999999999999
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            } catch (error) {
                assert(error.value.includes('"FA2_INSUFFICIENT_BALANCE"'));
            }
        });

        it('Put bundle bid for another user should fail should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 9999999999999999
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: carl.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pbb1")');
        });

        it('Put bundle bid on a non existing auction should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_8, 1),
                    mkBundleItem(nft_1.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Put bundle bid on an auction not started should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date - 400);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_IN_PROGRESS"');

        });

        it('Put bundle bid on an auction already finished should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 400000000);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_FINISHED"');

        });

        it('Put bundle bid with an amount < minimal step should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 2);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair 1
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');

        });
    });

    describe('Put bundle bid with exiting bids or buyout tests', async () => {

        it('Put bundle bid with existing bid should send back funds to previous bidder', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const storage = await auction_storage.getStorage();
            const start_time = Math.floor(Date.now() / 1000 + 41);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_9, 1),
                mkBundleItem(nft_2.address, token_id_9, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA2}
                            (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                                    (Pair (Some ${start_time})
                                        (Pair 200
                                            (Pair ${minimal_price}
                                                (Pair ${parseInt(bid_amount) + 2}
                                                    (Pair 1
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                )))))))))))`,
                as: alice.pkh,
            });

            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 42);
            }

            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${parseInt(bid_amount) - 1}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount + 1);
            assert(alice_ft_balance == post_alice_ft_balance);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount - 1 &&
                post_bid.args[2].args[0].args[3].string == bob.pkh
            );

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${parseInt(bid_amount)}
                                            (Pair "${alice.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: alice.pkh,
            });

            const post_alice_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_alice_bid.args[2].prim == 'Some' &&
                post_alice_bid.args[2].args[0].args[2].int == bid_amount &&
                post_alice_bid.args[2].args[0].args[3].string == alice.pkh
            );

            const post_alice_bid_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_bid_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            assert(post_alice_bid_bob_ft_balance == post_bob_ft_balance + bid_amount - 1 && post_alice_bid_bob_ft_balance == bob_ft_balance);
            assert(alice_ft_balance == post_alice_bid_alice_ft_balance + bid_amount);
        });

        it('Put bundle bid > buyout should close auction and succeed', async () => {
            const new_bid_amount = parseInt(bid_amount) + 100;

            const storage = await auction_storage.getStorage();

            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_9, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_9, daniel.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction_storage.address);
            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_9, 1),
                mkBundleItem(nft_2.address, token_id_9, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${parseInt(new_bid_amount)}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_9, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_9, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_9, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_9, bob.pkh);

            const protocol_fees = Math.floor(new_bid_amount * (fee / 10000));
            const rest = new_bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + bid_amount + rest);
            assert(post_bob_ft_balance == bob_ft_balance - new_bid_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Put bundle bid Fungible FA2 tests', async () => {
        it('Put bundle bid with good amount of Fungible FA2 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_1.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bundle bid with good amount of Fungible FA2 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_1, 1),
                mkBundleItem(nft_1.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bundle bid with good amount of Fungible FA2 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_1.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][1].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put identical bundle bid should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount + 3}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_ALREADY_EXISTS"');
        });

        it('Put bundle bid with amount < last bid should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                const bundle_items = [
                    mkBundleItem(nft_1.address, token_id_0, 1),
                    mkBundleItem(nft_1.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount - 1}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');
        });
    });

    describe('Put bundle bid XTZ tests', async () => {
        it('Put bundle bid with mismatch between bid amount and XTZ transferred', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow(start_date + 3);
                }

                const bundle_items = [
                    mkBundleItem(nft_2.address, token_id_0, 1),
                    mkBundleItem(nft_2.address, token_id_3, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    amount: `${bid_amount + 1}utz`,
                    as: bob.pkh,
                });
            }, '(Pair "AUCTION_BID_AMOUNT_MISMATCH" (Pair 1000001 1000000))');
        });

        it('Put bundle bid with good amount of XTZ (no bid origin fees, no payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh
            );

            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });

        it('Put bundle bid with good amount of XTZ (single bid origin fees, single payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_2.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair { Pair "${carl.pkh}" ${payout_value}}
                                (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value
            );

            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });

        it('Put bundle bid with good amount of XTZ (multiple bid origin fees, multiple payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_2, 1),
                mkBundleItem(nft_2.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                amount: `${bid_amount}utz`,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][1].args[1].int == payout_value
            );

            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);

            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance - bid_amount));
        });
    });

    describe('Put bundle bid FA12 tests', async () => {
        it('Put bundle bid with good amount of FA12 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_0, 1),
                mkBundleItem(nft_3.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bundle bid with good amount of FA12 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });

        it('Put bundle bid with good amount of FA12 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(bid.args[2].prim == 'None');

            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);

            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );

            assert(
                post_bid.args[2].prim == 'Some' &&
                post_bid.args[2].args[0].args[2].int == bid_amount &&
                post_bid.args[2].args[0].args[3].string == bob.pkh &&
                post_bid.args[2].args[0].args[0][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[0][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[0][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[0][1].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][0].args[0].string == carl.pkh &&
                post_bid.args[2].args[0].args[1][0].args[1].int == payout_value &&
                post_bid.args[2].args[0].args[1][1].args[0].string == daniel.pkh &&
                post_bid.args[2].args[0].args[1][1].args[1].int == payout_value
            );

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);

            assert(post_bob_ft_balance == bob_ft_balance - bid_amount);
            assert(alice_ft_balance == post_alice_ft_balance);
        });
    });
});

describe('Finish auction tests', async () => {
    describe('Finish Fungible FA2 auction tests', async () => {

        it('Finish Fungible FA2 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`,
                as: bob.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish Fungible FA2 auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_1, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);

        });

        it('Finish Fungible FA2 auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_2, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_2, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_2, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_2, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish XTZ auction tests', async () => {

        it('Finish XTZ auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }
            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish XTZ auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish XTZ auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - 4 * payout)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties + payout * 2)));
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish FA12 auction tests', async () => {

        it('Finish FA12 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_0, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_6, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_0, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_6, auction_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);

        });

        it('Finish FA12 auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_1, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_1, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_7, auction_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish FA12 auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_2, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_2, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_8, auction_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties + payout * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} "${alice.pkh}"))`),
                exprMichelineToJson(`(pair address (pair nat address))`)
            );
            assert(post_tx_auction == null);
        });

    });

    describe('Common Finish auction tests', async () => {
        it('Finish a non existing auction should fail', async () => {
            await expectToThrow(async () => {
                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" (Pair 99 "${alice.pkh}"))`,
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Finish an auction not started should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date);
                }
                const start_time = Math.floor(start_date + 100);
                const token_id = 9;
                await auction.start_auction({
                    argMichelson:
                        `(Pair "${nft.address}"
                            (Pair ${token_id.toString()}
                                (Pair ${auction_amount}
                                    (Pair ${FA2}
                                        (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id.toString())}
                                            (Pair (Some ${start_time})
                                                (Pair ${duration}
                                                    (Pair ${minimal_price}
                                                        (Pair ${buyout_price}
                                                            (Pair ${min_step}
                                                                (Pair ${max_fees}
                                                                    (Pair { Pair "${alice.pkh}" 100}
                                                                        (Pair { Pair "${alice.pkh}" 100}
                                                                            (Pair None None)
                )))))))))))))`,
                    as: alice.pkh,
                });

                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id} "${alice.pkh}"))`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish an auction not ended (without bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 101);
                }
                const token_id = 9;

                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id} "${alice.pkh}"))`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish an auction not ended (with bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 103);
                }

                const token_id = 9;

                await auction.put_bid({
                    argMichelson: `
                    (Pair "${nft.address}"
                        (Pair ${token_id}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                        )))))))
                    `,
                    as: bob.pkh,
                });
                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id} "${alice.pkh}"))`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });
    });
});

describe('Finish bundle auction tests', async () => {
    describe('Finish bundle Fungible FA2 auction tests', async () => {

        it('Finish bundle Fungible FA2 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_0, 1),
                mkBundleItem(nft_1.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish bundle Fungible FA2 auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_1, 1),
                mkBundleItem(nft_1.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);

        });

        it('Finish bundle Fungible FA2 auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_1.address, token_id_2, 1),
                mkBundleItem(nft_1.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, auction.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_2, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_2, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_2, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_1, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_1, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish bundle XTZ auction tests', async () => {

        it('Finish bundle XTZ auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }
            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_0, 1),
                mkBundleItem(nft_2.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });


            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees)));
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish bundle XTZ auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_1, 1),
                mkBundleItem(nft_2.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - payout * 2)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(payout * 2)));
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish bundle XTZ auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_2.address, token_id_2, 1),
                mkBundleItem(nft_2.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_2, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_2, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest - 4 * payout)));
            assert(post_bob_ft_balance.isLessThan(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees).plus(fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2)));
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish bundle FA12 auction tests', async () => {

        it('Finish bundle FA12 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 10000000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_0, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_0, 1),
                mkBundleItem(nft_3.address, token_id_3, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_0, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_0, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);

        });

        it('Finish bundle FA12 auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_1, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_1, 1),
                mkBundleItem(nft_3.address, token_id_4, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_1, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_1, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_4, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties_per_nft * bundle_items.length - fee_value * 2;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - payout * 2);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + payout * 2);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish bundle FA12 auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, auction_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_2, auction.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, auction_storage.address);
            const custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, auction_storage.address);
            const alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, bob.pkh);
            const bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_2, 1),
                mkBundleItem(nft_3.address, token_id_5, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(auction_record != null);

            await auction.finish_bundle_auction({
                argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, auction_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_2, auction.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const post_custody_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, auction_storage.address);
            const post_custody_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, auction_storage.address);
            const post_alice_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, alice.pkh);
            const post_alice_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, alice.pkh);
            const post_bob_nft_balance_0 = await getFA2Balance(nft_3, token_id_2, bob.pkh);
            const post_bob_nft_balance_1 = await getFA2Balance(nft_3, token_id_5, bob.pkh);

            const nft_share = Math.abs(Math.floor(10000 / bundle_items.length));
            const price_per_nft = Math.abs(Math.floor(bid_amount * nft_share / 10000));
            const royalties_per_nft = price_per_nft * (payout_value / 10000);

            const protocol_fees = bid_amount * (fee / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties_per_nft * bundle_items.length - 4 * fee_value;
            const payout = rest * (payout_value / 10000);

            assert(post_custody_ft_balance == custody_ft_balance - bid_amount);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest - 4 * payout);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees + fee_value * 2 + royalties_per_nft * bundle_items.length + payout * 2);
            assert(post_custody_nft_balance_0 == custody_nft_balance_0 - 1);
            assert(post_custody_nft_balance_1 == custody_nft_balance_1 - 1);
            assert(post_alice_nft_balance_0 == alice_nft_balance_0);
            assert(post_alice_nft_balance_1 == alice_nft_balance_1);
            assert(post_bob_nft_balance_0 == bob_nft_balance_0 + 1);
            assert(post_bob_nft_balance_1 == bob_nft_balance_1 + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.bundle_auctions),
                exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
                exprMichelineToJson(`(pair bytes address)`)
            );
            assert(post_tx_auction == null);
        });

    });

    describe('Common Finish bundle auction tests', async () => {
        it('Finish a non existing bundle auction should fail', async () => {
            await expectToThrow(async () => {
                await auction.finish_bundle_auction({
                    argMichelson: `(Pair 0x "${carl.pkh}")`,
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Finish a bundle auction not started should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date);
                }
                const start_time = Math.floor(start_date + 100);
                const bundle_items = [
                    mkBundleItem(nft_2.address, token_id_9, 1),
                    mkBundleItem(nft_3.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.start_bundle_auction({
                    argMichelson:
                        `(Pair 0x${bundle}
                            (Pair ${FA2}
                                (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                                    (Pair (Some ${start_time})
                                        (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
                    )))))))))))`,
                    as: alice.pkh,
                });

                await auction.finish_bundle_auction({
                    argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish a bundle auction not ended (without bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 101);
                }
                const bundle_items = [
                    mkBundleItem(nft_2.address, token_id_9, 1),
                    mkBundleItem(nft_3.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);
                await auction.finish_bundle_auction({
                    argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish a bundle auction not ended (with bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow(start_date + 103);
                }

                const bundle_items = [
                    mkBundleItem(nft_2.address, token_id_9, 1),
                    mkBundleItem(nft_3.address, token_id_9, 1),
                ];

                const bundle = mkPackedBundle(bundle_items);

                await auction.put_bundle_bid({
                    argMichelson: `
                        (Pair 0x${bundle}
                                (Pair "${alice.pkh}"
                                    (Pair {}
                                        (Pair {}
                                            (Pair ${bid_amount}
                                                (Pair "${bob.pkh}"
                                                    (Pair None None)
                        ))))))
                    `,
                    as: bob.pkh,
                });
                await auction.finish_bundle_auction({
                    argMichelson: `(Pair 0x${bundle} "${alice.pkh}")`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });
    });
});

describe('Cancel auction tests', async () => {
    it('Cancel a non existing auction should fail', async () => {
        await expectToThrow(async () => {
            await auction.cancel_auction({
                argMichelson: `(Pair "${nft.address}" 999999)`,
                as: bob.pkh,
            });
        }, '"MISSING_AUCTION"');
    });

    it('Cancel an auction with an existing bid should fail', async () => {
        await expectToThrow(async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            await auction.start_auction({
                argMichelson:
                    `(Pair "${nft.address}"
                        (Pair ${token_id_8.toString()}
                            (Pair ${auction_amount}
                                (Pair ${FA2}
                                    (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_8.toString())}
                                        (Pair (Some ${Math.floor(start_date + 3)})
                                            (Pair ${duration}
                                                (Pair ${minimal_price}
                                                    (Pair ${buyout_price}
                                                        (Pair ${min_step}
                                                            (Pair ${max_fees}
                                                                (Pair {}
                                                                    (Pair {}
                                                                        (Pair None None)
                )))))))))))))`,
                as: alice.pkh,
            });
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            await auction.put_bid({
                argMichelson: `
                (Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair 10000
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                    )))))))
                `,
                as: bob.pkh,
            });
            await auction.cancel_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_8})`,
                as: alice.pkh,
            });
        }, '"AUCTION_WITH_BID_NON_CANCELLABLE"');
    });

    it('Cancel a valid auction should succeed', async () => {
        if (isMockup()) {
            await setMockupNow(start_date);
        }
        const start_time = Math.floor(start_date + 1);
        await auction.start_auction({
            argMichelson:
                `(Pair "${nft.address}"
                    (Pair ${token_id_1.toString()}
                        (Pair ${auction_amount}
                            (Pair ${FA2}
                                (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString())}
                                    (Pair (Some ${start_time})
                                        (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
            )))))))))))))`,
            as: alice.pkh,
        });
        const storage = await auction_storage.getStorage();
        var auction_record = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
            exprMichelineToJson(`(pair address (pair nat address))`)
        );
        assert(auction_record != null);

        await auction.cancel_auction({
            argMichelson: `(Pair "${nft.address}" ${token_id_1}))`,
            as: alice.pkh,
        });

        var post_tx_auction = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} "${alice.pkh}"))`),
            exprMichelineToJson(`(pair address (pair nat address))`)
        );
        assert(post_tx_auction == null);
    });
});

describe('Cancel bundle auction tests', async () => {
    it('Cancel a non existing bundle auction should fail', async () => {
        await expectToThrow(async () => {
            const bundle_items = [
                mkBundleItem(nft_2.address, 11987655, 1),
                mkBundleItem(nft_3.address, token_id_9, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);
            await auction.cancel_bundle_auction({
                argMichelson: `0x${bundle}`,
                as: bob.pkh,
            });
        }, '"MISSING_AUCTION"');
    });

    it('Cancel a bundle auction with an existing bid should fail', async () => {
        await expectToThrow(async () => {
            if (isMockup()) {
                await setMockupNow(start_date + 2);
            }
            const bundle_items = [
                mkBundleItem(nft_3.address, token_id_8, 1),
                mkBundleItem(nft_3.address, token_id_9, 1),
            ];

            const bundle = mkPackedBundle(bundle_items);

            await auction.start_bundle_auction({
                argMichelson:
                    `(Pair 0x${bundle}
                        (Pair ${FA2}
                            (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                                (Pair (Some ${Math.floor(start_date + 3)})
                                    (Pair ${duration}
                                            (Pair ${minimal_price}
                                                (Pair ${buyout_price}
                                                    (Pair ${min_step}
                                                        (Pair ${max_fees}
                                                            (Pair {}
                                                                (Pair {}
                                                                    (Pair None None)
            )))))))))))))`,
                as: alice.pkh,
            });
            if (isMockup()) {
                await setMockupNow(start_date + 3);
            }
            await auction.put_bundle_bid({
                argMichelson: `
                    (Pair 0x${bundle}
                            (Pair "${alice.pkh}"
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair "${bob.pkh}"
                                                (Pair None None)
                    ))))))
                `,
                as: bob.pkh,
            });
            await auction.cancel_bundle_auction({
                argMichelson: `0x${bundle}`,
                as: alice.pkh,
            });
        }, '"AUCTION_WITH_BID_NON_CANCELLABLE"');
    });

    it('Cancel a valid bundle auction should succeed', async () => {
        if (isMockup()) {
            await setMockupNow(start_date);
        }
        const start_time = Math.floor(start_date + 1);
        const bundle_items = [
            mkBundleItem(nft_3.address, token_id_7, 1),
            mkBundleItem(nft_3.address, token_id_9, 1),
        ];

        const bundle = mkPackedBundle(bundle_items);

        await auction.start_bundle_auction({
            argMichelson:
                `(Pair 0x${bundle}
                    (Pair ${FA2}
                        (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                            (Pair (Some ${start_time})
                                (Pair ${duration}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair {}
                                                            (Pair {}
                                                                (Pair None None)
            )))))))))))))`,
            as: alice.pkh,
        });
        const storage = await auction_storage.getStorage();
        var auction_record = await getValueFromBigMap(
            parseInt(storage.bundle_auctions),
            exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
            exprMichelineToJson(`(pair bytes address)`)
        );
        assert(auction_record != null);

        await auction.cancel_bundle_auction({
            argMichelson: `0x${bundle}`,
            as: alice.pkh,
        });

        var post_tx_auction = await getValueFromBigMap(
            parseInt(storage.bundle_auctions),
            exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
            exprMichelineToJson(`(pair bytes address)`)
        );
        assert(post_tx_auction == null);
    });
});

describe('Miscellaneous tests', async () => {
    it('Putting a bid on an auction close to max duration should not increase the end time', async () => {

        const storage = await auction_storage.getStorage();
        const bundle_items = [
            mkBundleItem(nft_3.address, token_id_8, 2),
            mkBundleItem(nft_3.address, token_id_9, 2),
        ];

        const bundle = mkPackedBundle(bundle_items);
        const max_duration = 43200000;
        const start_time = Math.floor(start_date);
        if (isMockup()) {
            await setMockupNow(start_time - 1);
        }
        await auction.start_bundle_auction({
            argMichelson:
                `(Pair 0x${bundle}
                    (Pair ${FA2}
                        (Pair 0x${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}
                            (Pair (Some ${Math.floor(start_time)})
                                (Pair ${max_duration - 1}
                                        (Pair ${minimal_price}
                                            (Pair ${buyout_price}
                                                (Pair ${min_step}
                                                    (Pair ${max_fees}
                                                        (Pair {}
                                                            (Pair {}
                                                                (Pair None None)
        )))))))))))))`,
            as: alice.pkh,
        });

        var auctions = await getValueFromBigMap(
            parseInt(storage.bundle_auctions),
            exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
            exprMichelineToJson(`(pair bytes address)`)
        );

        const expected_result = JSON.parse(`
            [
                {
                    "int": "${FA2}"
                }, {
                    "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}"
                }, {
                    "prim": "None"
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + max_duration - 1) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
                [],
                [], {
                    "prim": "None"
                }, {
                    "prim": "None"
                }
            ]
        `);

        assert(JSON.stringify(auctions.args) === JSON.stringify(expected_result));

        if (isMockup()) {
            await setMockupNow(start_time + max_duration - 20);
        }
        await auction.put_bundle_bid({
            argMichelson: `
                (Pair 0x${bundle}
                        (Pair "${alice.pkh}"
                            (Pair {}
                                (Pair {}
                                    (Pair ${bid_amount}
                                        (Pair "${bob.pkh}"
                                            (Pair None None)
                ))))))
            `,
            as: bob.pkh,
        });

        var post_tx_auction = await getValueFromBigMap(
            parseInt(storage.bundle_auctions),
            exprMichelineToJson(`(Pair 0x${bundle} "${alice.pkh}")`),
            exprMichelineToJson(`(pair bytes address)`)
        );

        const post_tx_expected_result = JSON.parse(`
            [
                {
                    "int": "${FA2}"
                }, {
                    "bytes": "${mkFungibleFA2Asset(fa2_ft.address, token_id_9.toString())}"
                }, {
                    "prim":"Some",
                    "args": [
                        {
                            "prim":"Pair",
                            "args":[
                                [],
                                [],
                                {"int":"${bid_amount}"},
                                {"string":"${bob.pkh}"},
                                {"prim":"None"},
                                {"prim":"None"}
                            ]
                        }
                    ]
                }, {
                    "string": "${new Date(start_time * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "string": "${new Date((start_time + max_duration - 1) * 1000).toISOString().split('.')[0] + "Z"}"
                }, {
                    "int": "${minimal_price}"
                }, {
                    "int": "${buyout_price}"
                }, {
                    "int": "${min_step}"
                }, {
                    "int": "${max_fees}"
                },
                [],
                [], {
                    "prim": "None"
                }, {
                    "prim": "None"
                }
            ]
        `);

        assert(JSON.stringify(post_tx_auction.args) === JSON.stringify(post_tx_expected_result));
    });
});