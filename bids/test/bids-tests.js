const {
    deploy,
    getAccount,
    getValueFromBigMap,
    setQuiet,
    expectToThrow,
    exprMichelineToJson,
    setMockupNow,
    getEndpoint,
    isMockup,
    setEndpoint,
    setNow,
    getBalance
} = require('@completium/completium-cli');
const {
    errors,
    mkAuction,
    FA12,
    FA2,
    XTZ,
    mkPart,
    mkFungibleFA2Asset,
    mkFA12Auction,
    mkFungibleFA2Auction,
    mkXTZAuction,
    mkBid,
    getFA2Balance,
    getFA12Balance,
    mkAuctionWithMissingFA2AssetContract,
    mkAuctionWithMissingFA2AssetId,
    mkAuctionWithMissingFA2AssetContractAndId,
    mkXTZAsset,
    mkFA12Asset
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
const bid_amount = "1000000";
const qty = "1";
const duration = 100;
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
            './test/test-contracts/test-fa12-ft.arl',
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
            './test/test-contracts/test-fa12-ft.arl',
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
            './test/test-contracts/test-fa12-ft.arl',
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
            './test/test-contracts/test-fa2-ft.arl',
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
            './test/test-contracts/test-nft.arl',
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
            './test/test-contracts/test-royalties-provider.arl',
            {
                parameters: {
                    owner: alice.pkh
                },
                as: alice.pkh,
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
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
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
        });

        it('Put bid with Fungible FA2 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
        });

        it('Put bid with Fungible FA2 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bob.pkh);
            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_2}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA2)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None None)
                                                )))))))))`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_3}
                    (Pair "${bob.pkh}"
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair {}
                                    (Pair {}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None None)
                                            )))))))))`,
                amount: `${total_bid_amount}utz`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(total_bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(total_bid_amount))));
        });

        it('Put bid with XTZ should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_4}
                    (Pair "${bob.pkh}"
                        (Pair ${parseInt(XTZ)}
                            (Pair 0x${bid_asset}
                                (Pair { Pair "${carl.pkh}" ${payout_value}}
                                    (Pair { Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair ${bid_amount}
                                            (Pair ${qty}
                                                (Pair None None)
                                            )))))))))`,
                amount: `${total_bid_amount}utz`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(total_bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(total_bid_amount))));
        });

        it('Put bid with XTZ should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkXTZAsset();
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            const bob_ft_balance = await getBalance(bob.pkh);
            const custody_ft_balance = await getBalance(bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                (Pair ${token_id_5}
                    (Pair "${bob.pkh}"
                    (Pair ${parseInt(XTZ)}
                        (Pair 0x${bid_asset}
                            (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                    (Pair ${bid_amount}
                                        (Pair ${qty}
                                            (Pair None None)
                                        )))))))))`,
                amount: `${total_bid_amount}utz`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance.isLessThan(bob_ft_balance.minus(BigNumber(total_bid_amount))));
            assert(post_tx_custody_ft_balance.isEqualTo(custody_ft_balance.plus(BigNumber(total_bid_amount))));
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
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
                        }, {
                            "prim": "None"
                        }, {
                            "prim": "None"
                        }
                    ]
                }
            `);
            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
        });

        it('Put bid with FA12 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_1.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
        });

        it('Put bid with FA12 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            const storage = await bids_storage.getStorage();
            const bid_asset = mkFA12Asset(fa12_ft_2.address);
            var bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))'`)
            );
            assert(bid == null);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);

            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}"
                    (Pair ${token_id_8}
                        (Pair "${bob.pkh}"
                            (Pair ${parseInt(FA12)}
                                (Pair 0x${bid_asset}
                                    (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                        (Pair { Pair "${carl.pkh}" ${payout_value}; Pair "${daniel.pkh}" ${payout_value}}
                                            (Pair ${bid_amount}
                                                (Pair ${qty}
                                                    (Pair None None)
                                                )))))))))`,
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
                      "prim":"None"
                   },
                   {
                      "prim":"None"
                   }
                ]
             }`);

            assert(JSON.stringify(post_tx_bid) === JSON.stringify(expected_result));
            assert(post_tx_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_tx_custody_ft_balance == custody_ft_balance + total_bid_amount);
        });
    });

    describe('Common args test', async () => {

        it('Put bid for another user should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pb1")');
        });

        it('Put bid with wrong buy asset payload (FA2) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA2_ASSET"');
        });

        it('Put bid with wrong buy asset payload (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"CANT_UNPACK_FA12_ASSET"');
        });

        it('Put bid with wrong buy asset payload (XTZ) should fail', async () => {
            await expectToThrow(async () => {
                    const bid_asset = mkFA12Asset(fa12_ft_0.address);
                    await bids.put_bid({
                        argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
                        as: bob.pkh,
                        amount: `${bid_amount}utz`,
                    });
            }, '"WRONG_XTZ_PAYLOAD"');
        });

        it('Put bid with amount = 0 duration should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                        argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair 0 (Pair 0 (Pair None None))))))))))`,
                        as: bob.pkh,
                    });
            }, '(Pair "InvalidCondition" "r_pb0")');
        });

        it('Put bid with wrong amount of XTZ should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None None))))))))))`,
                    as: bob.pkh,
                });
            }, '"BID_AMOUNT_MISMATCH"');
        });

        it('Put bid as non owner of the asset (FA2) should fail', async () => {
            try {
                await expectToThrow(async () => {
                    const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());
                    await bids.put_bid({
                        argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${carl.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None None))))))))))`,
                        as: carl.pkh,
                    });
                }, '(Pair "AssetNotFound" "ledger")');
            } catch (error) {
                assert(error.toString().includes("NO_ENTRY_FOR_USER"))
            }
        });

        it('Put bid as non owner of the asset (FA12) should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_0.address);
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${carl.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None None))))))))))`,
                    as: carl.pkh,
                });
            }, '(Pair "AssetNotFound" "ledger")');
        });

        it('Put bid with bid that already exists should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkXTZAsset();
                const total_sale_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None None))))))))))`,
                    as: bob.pkh,
                    amount: `${total_sale_amount}utz`
                });
                await bids.put_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} (Pair {} (Pair {} (Pair ${bid_amount} (Pair 0 (Pair None None))))))))))`,
                    as: bob.pkh,
                    amount: `${total_sale_amount}utz`
                });
            }, '(Pair "InvalidCondition" "r_pb2")');
        });
    });
});

describe('Accept bid tests', async () => {
    describe('Accept FA2 bid tests', async () => {

        it('Accept FA2 bid (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_0.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_0, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });


            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bids.address);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_0, alice.pkh);
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_0, bob.pkh);
            const post_carl_ft_balance = await getFA2Balance(fa2_ft, token_id_0, carl.pkh);
            const post_daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_0, daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_0, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_0, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_0, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_0} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA2 bid (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_1.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_1, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_1, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_1, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_1, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_1, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_1, bids.address);
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
            const rest = bid_amount - protocol_fees - royalties -  fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_1} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA2 bid (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFungibleFA2Asset(fa2_ft.address, token_id_2.toString());

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids.address);
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

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_2} (Pair "${bob.pkh}" (Pair ${parseInt(FA2)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids_storage.address);
            const post_auction_ft_balance = await getFA2Balance(fa2_ft, token_id_2, bids.address);
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
            const rest = bid_amount - protocol_fees - 2 * royalties - 2 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 2 + royalties);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
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

        it('Accept XTZ Bid (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const auction_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_3} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_auction_ft_balance = await getBalance(bids.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, bids_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(total_bid_amount)));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2)));
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

        it('Accept XTZ Bid (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const auction_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_auction_ft_balance = await getBalance(bids.address);
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
            const rest = bid_amount - protocol_fees - royalties -  fee_value;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(total_bid_amount)));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2).plus(fee_value)));
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_4} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept XTZ Bid (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkXTZAsset();

            const custody_ft_balance = await getBalance(bids_storage.address);
            const auction_ft_balance = await getBalance(bids.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_5} (Pair "${bob.pkh}" (Pair ${parseInt(XTZ)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getBalance(bids_storage.address);
            const post_auction_ft_balance = await getBalance(bids.address);
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
            const rest = bid_amount - protocol_fees - 2 * royalties - 2 * fee_value;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance.minus(total_bid_amount)));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isLessThan(alice_ft_balance.plus(rest)));
            assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2).plus(fee_value * 2 + royalties)));
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
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

        it('Accept FA12 Bid (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_0.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_0, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_6, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_0, bids_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_0, bids.address);
            const post_alice_ft_balance = await getFA12Balance(fa12_ft_0, alice.pkh);
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            const post_carl_ft_balance = await getFA12Balance(fa12_ft_0, carl.pkh);
            const post_daniel_ft_balance = await getFA12Balance(fa12_ft_0, daniel.pkh);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_6, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_6, bob.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_6, bids_storage.address);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_6} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);

        });

        it('Accept FA12 Bid (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_1.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_1, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_1, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_1, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_1, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_7, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_7, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_7, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_1, bids_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_1, bids.address);
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
            const rest = bid_amount - protocol_fees - royalties -  fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance - 1);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_bid = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_7} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(post_tx_bid == null);
        });

        it('Accept FA12 Bid (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            const storage = await bids_storage.getStorage();

            const bid_asset = mkFA12Asset(fa12_ft_2.address);

            const custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);
            const auction_ft_balance = await getFA12Balance(fa12_ft_2, bids.address);
            const alice_ft_balance = await getFA12Balance(fa12_ft_2, alice.pkh);
            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            const carl_ft_balance = await getFA12Balance(fa12_ft_2, carl.pkh);
            const daniel_ft_balance = await getFA12Balance(fa12_ft_2, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_8, bids_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_8, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_8, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            var bid_record = await getValueFromBigMap(
                parseInt(storage.bids),
                exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
                exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
            );
            assert(bid_record != null);

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 0);
            assert(alice_nft_balance == initial_nft_amount);
            assert(bob_nft_balance == 0);

            await bids.accept_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_8} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                as: alice.pkh,
            });

            const post_custody_ft_balance = await getFA12Balance(fa12_ft_2, bids_storage.address);
            const post_auction_ft_balance = await getFA12Balance(fa12_ft_2, bids.address);
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
            const rest = bid_amount - protocol_fees - 2 * royalties - 2 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 2 + royalties);
            assert(post_custody_nft_balance == custody_nft_balance  && post_custody_nft_balance == 0);
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
                    argMichelson: `(Pair "${nft.address}" (Pair 999999 (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                    as: alice.pkh,
                });
            }, '"MISSING_BID"');
        });

        it('Accept someone else bid should fail', async () => {
            await expectToThrow(async () => {
                const bid_asset = mkFA12Asset(fa12_ft_2.address);

                await bids.accept_bid({
                    argMichelson: `(Pair "${nft.address}" (Pair 999999 (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} "${alice.pkh}")))))`,
                    as: bob.pkh,
                });
            }, '(Pair "InvalidCondition" "r_ab0")');
        });
    });
});

describe('Cancel auction tests', async () => {
    it('Cancel a non existing bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFA12Asset(fa12_ft_2.address);

            await bids.cancel_bid({
                argMichelson: `(Pair "${nft.address}" (Pair 999999 (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`,
                as: bob.pkh,
            });
        }, '"MISSING_BID"');
    });

    it('Accept someone else bid should fail', async () => {
        await expectToThrow(async () => {
            const bid_asset = mkFA12Asset(fa12_ft_2.address);
            await bids.put_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_9} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} (Pair 0x${bid_asset} (Pair { Pair "${carl.pkh}" ${payout_value}} (Pair { Pair "${daniel.pkh}" ${payout_value}} (Pair ${bid_amount} (Pair ${qty} (Pair None None))))))))))`,
                as: bob.pkh,
            });
            await bids.cancel_bid({
                argMichelson: `(Pair "${nft.address}" (Pair ${token_id_9} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`,
                as: alice.pkh,
            });
        }, '(Pair "InvalidCondition" "r_cb0")');
    });


    it('Cancel a valid auction should succeed', async () => {
        const bid_asset = mkFA12Asset(fa12_ft_2.address);

        await bids.cancel_bid({
            argMichelson: `(Pair "${nft.address}" (Pair ${token_id_9} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`,
            as: bob.pkh,
        });
        const storage = await bids_storage.getStorage();

        var post_tx_bid = await getValueFromBigMap(
            parseInt(storage.bids),
            exprMichelineToJson(`(Pair "${nft.address}" (Pair ${token_id_9} (Pair "${bob.pkh}" (Pair ${parseInt(FA12)} 0x${bid_asset})))))`),
            exprMichelineToJson(`(pair address (pair nat (pair address (pair int bytes))))`)
        );
        assert(post_tx_bid == null);
    });
});
