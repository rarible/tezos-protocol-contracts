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
    FA_1_2,
    FA_2_FT,
    FA_2_NFT,
    XTZ,
    mkPart,
    mkFA12Auction,
    mkFungibleFA2Auction,
    mkXTZAuction,
    mkBid,
    getFA2Balance,
    getFA12Balance,
    mkAuctionWithMissingFA2AssetContract,
    mkAuctionWithMissingFA2AssetId,
    mkAuctionWithMissingFA2AssetContractAndId
} = require('./utils');
const assert = require('assert');
const BigNumber = require('bignumber.js');

require('mocha/package.json');

setQuiet('true');

const mockup_mode = true;

// contracts
let auction_storage;
let auction;
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
const duration = 100;

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

    it('Auction contract deployment should succeed', async () => {
        [auction, _] = await deploy(
            './contracts/auction.arl',
            {
                parameters: {
                    owner: alice.pkh,
                    default_fee_receiver: carl.pkh,
                    protocol_fee: 0,
                    royalties_provider: nft.address
                },
                as: alice.pkh,
            }
        );
        console.log();
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
});

describe('Auction contract setter tests', async () => {
    describe('Auction storage contract setter tests', async () => {
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
            assert(storage.auction_storage == null);
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
            const storage = await auction.getStorage();
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
                await auction.set_default_fee_receiver({
                    arg: {
                        sfr: daniel.pkh
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set fee receiver as admin should succeed', async () => {
            const receiver = daniel.pkh;
            const storage = await auction.getStorage();
            assert(storage.default_fee_receiver == carl.pkh);
            await auction.set_default_fee_receiver({
                arg: {
                    sfr: receiver
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.default_fee_receiver == receiver);
        });
    });

    describe('Royalties provider setter tests', async () => {
        it('Set royalties provider as non admin should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_royalties_provider({
                    arg: {
                        srp: royalties.address
                    },
                    as: bob.pkh
                });
            }, errors.INVALID_CALLER);
        });

        it('Set royalties provider as admin should succeed', async () => {
            const provider = royalties.address;
            const storage = await auction.getStorage();
            assert(storage.royalties_provider == nft.address);
            await auction.set_royalties_provider({
                arg: {
                    srp: provider
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
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
                    spender: auction.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_0.approve({
                arg: {
                    spender: auction.address,
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
                    spender: auction.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_1.approve({
                arg: {
                    spender: auction.address,
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
                    spender: auction.address,
                    value: initial_fa12_ft_amount,
                },
                as: alice.pkh,
            });
            await fa12_ft_2.approve({
                arg: {
                    spender: auction.address,
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

    it('Add auction contract as operator for NFT and FT', async () => {
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_0})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_1})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_2})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_3})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_4})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_5})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_6})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_7})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_8})}`,
            as: alice.pkh,
        });
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_9})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_0})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_1})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_2})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_3})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_4})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_5})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_6})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_7})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_8})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${token_id_9})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_0})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_1})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_2})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_3})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_4})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_5})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_6})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_7})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_8})}`,
            as: bob.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${token_id_9})}`,
            as: bob.pkh,
        });
    });
});

describe('Start Auction tests', async () => {
    describe('Auction with bids in Fungible FA2', async () => {
        it('Starting auction buying with Fungible FA2 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_0.toString(),
                    fa2_ft.address,
                    token_id_0.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [],
                    [],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_0}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "0"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${fa2_ft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "0"
                        }]
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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
        });

        it('Starting auction buying with Fungible FA2 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_1.toString(),
                    fa2_ft.address,
                    token_id_1.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_1}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "0"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${fa2_ft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_1}"
                        }]
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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
        });

        it('Starting auction buying with Fungible FA2 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_2})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_2.toString(),
                    fa2_ft.address,
                    token_id_2.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_2})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_2}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "0"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${fa2_ft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_2}"
                        }]
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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

        });
    });

    describe('Auction with bids in XTZ', async () => {
        it('Starting auction buying with XTZ should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_3.toString(),
                    null,
                    null,
                    XTZ,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [],
                    [],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_3}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }, {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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
        });

        it('Starting auction buying with XTZ should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_4.toString(),
                    null,
                    null,
                    XTZ,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_4}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }, {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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
        });

        it('Starting auction buying with XTZ should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_5.toString(),
                    null,
                    null,
                    XTZ,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
                [{
                    "prim": "Pair",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Right",
                            "args": [{
                                "prim": "Left",
                                "args": [{
                                    "int": "1"
                                }]
                            }]
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "string": "${nft.address}"
                        }]
                    }, {
                        "prim": "Some",
                        "args": [{
                            "int": "${token_id_5}"
                        }]
                    }]
                }, {
                    "int": "1"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }, {
                        "prim": "None"
                    }, {
                        "prim": "None"
                    }]
                }, {
                    "prim": "None"
                }, {
                    "string": "${alice.pkh}"
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
                    "int": "${fee}"
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
        });
    });

    describe('Auction with bids in FA12', async () => {
        it('Starting auction buying with FA12 should succeed (no royalties, no auction payouts, no auction origin fees, no bid payouts, no bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_6})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_6.toString(),
                    fa12_ft_0.address,
                    null,
                    FA_1_2,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [],
                    [],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_6})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
            [{
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Left",
                            "args": [{
                                "int": "1"
                            }]
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${nft.address}"
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "int": "${token_id_6}"
                    }]
                }]
            }, {
                "int": "1"
            }, {
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${fa12_ft_0.address}"
                    }]
                }, {
                    "prim": "None"
                }]
            }, {
                "prim": "None"
            }, {
                "string": "${alice.pkh}"
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
                "int": "${fee}"
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
        });

        it('Starting auction buying with FA12 should succeed (single royalties, single auction payouts, single auction origin fees, single bid payouts, single bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_7})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_7.toString(),
                    fa12_ft_1.address,
                    null,
                    FA_1_2,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_7})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
            [{
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Left",
                            "args": [{
                                "int": "1"
                            }]
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${nft.address}"
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "int": "${token_id_7}"
                    }]
                }]
            }, {
                "int": "1"
            }, {
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${fa12_ft_1.address}"
                    }]
                }, {
                    "prim": "None"
                }]
            }, {
                "prim": "None"
            }, {
                "string": "${alice.pkh}"
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
                "int": "${fee}"
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
        });

        it('Starting auction buying with Fungible FA2 should succeed (multiple royalties, multiple auction payouts, multiple auction origin fees, multiple bid payouts, multiple bid origin fees)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 34);
            }
            const start_time = Math.floor(Date.now() / 1000 + 35);
            const storage = await auction_storage.getStorage();
            var auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_8})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auctions == null);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_8.toString(),
                    fa12_ft_2.address,
                    null,
                    FA_1_2,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null),
                as: alice.pkh,
            });

            var post_tx_auctions = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_8})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const expected_result = JSON.parse(`
            [{
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Right",
                        "args": [{
                            "prim": "Left",
                            "args": [{
                                "int": "1"
                            }]
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${nft.address}"
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "int": "${token_id_8}"
                    }]
                }]
            }, {
                "int": "1"
            }, {
                "prim": "Pair",
                "args": [{
                    "prim": "Right",
                    "args": [{
                        "prim": "Left",
                        "args": [{
                            "prim": "Unit"
                        }]
                    }]
                }, {
                    "prim": "Some",
                    "args": [{
                        "string": "${fa12_ft_2.address}"
                    }]
                }, {
                    "prim": "None"
                }]
            }, {
                "prim": "None"
            }, {
                "string": "${alice.pkh}"
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
                "int": "${fee}"
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

        });
    });

    describe('Common args test', async () => {

        it('Starting auction for FA12 to purchase should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkFA12Auction(
                        fa12_ft_0.address,
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa0")');
        });

        it('Starting auction for Fungible FA2 to purchase should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkFungibleFA2Auction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa0")');
        });

        it('Starting auction for XTZ to purchase should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkXTZAuction(
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")]),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa0")');
        });

        it('Starting auction for buying with Non Fungible FA2 should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        fa2_ft.address,
                        token_id_0.toString(),
                        nft.address,
                        token_id_0.toString(),
                        FA_2_NFT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa1")');
        });

        it('Starting auction with duration < extension duration should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa2")');
        });

        it('Starting auction with duration > max_duration should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "999999999999999999999",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa3")');
        });

        it('Starting auction with buyout price < min price should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "100",
                        "1",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa4")');
        });

        it('Starting auction as non owner of the NFT should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: carl.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa7")');
        });

        it('Starting auction with missing asset contract should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuctionWithMissingFA2AssetContract(
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '"MISSING_ASSET_CONTRACT"');
        });

        it('Starting auction with missing asset id should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuctionWithMissingFA2AssetId(
                        nft.address,
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '"MISSING_ASSET_ID"');
        });

        it('Starting auction with missing asset contract and id should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuctionWithMissingFA2AssetContractAndId(
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "100",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '"MISSING_ASSET_ID"');
        });

        it('Starting auction buying when auction storage is not set should fail', async () => {
            await expectToThrow(async () => {
                await auction.set_auction_storage_contract({
                    arg: {
                        sacs_contract: null
                    },
                    as: alice.pkh
                });
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "10000000000",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '(Pair "InvalidCondition" "r_sa8")');
            await auction.set_auction_storage_contract({
                arg: {
                    sacs_contract: auction_storage.address
                },
                as: alice.pkh
            });
        });

        it('Starting auction buying with Fungible FA2 that already exists should fail', async () => {
            await expectToThrow(async () => {
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_0.toString(),
                        fa2_ft.address,
                        token_id_0.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        Date.now(),
                        "1000000",
                        "10",
                        "10000000000",
                        "2",
                        [mkPart(alice.pkh, "100")],
                        [mkPart(alice.pkh, "100")],
                        null,
                        null),
                    as: alice.pkh,
                });
            }, '"AUCTION_ALREADY_EXISTS"');
        });
    });
});

describe('Put bid tests', async () => {
    describe('Put bid common tests', async () => {
        it('Put bid with amount = 0 should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        0,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pb0")');
        });

        it('Put bid for another user should fail should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        100,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: carl.pkh,
                });
            }, '(Pair "InvalidCondition" "r_pb1")');
        });

        it('Put bid on a non existing auction should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        fa2_ft.address,
                        token_id_3.toString(),
                        111,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Put bid on an auction not started should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) - 400);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        bid_amount,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_IN_PROGRESS"');

        });

        it('Put bid on an auction already finished should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 400000000);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        bid_amount,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"AUCTION_FINISHED"');

        });

        it('Put bid with an amount < minimal step should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        1,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');

        });
    });

    describe('Put bid with exiting bids or buyout tests', async () => {

        it('Put bid with existing bid should send back funds to previous bidder', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const start_time = Math.floor(Date.now() / 1000 + 41);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_9.toString(),
                    fa2_ft.address,
                    token_id_9.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    start_time,
                    duration.toString(),
                    minimal_price.toString(),
                    `${parseInt(bid_amount) + 2}`,
                    "1",
                    [],
                    [],
                    null,
                    null),
                as: alice.pkh,
            });

            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 42);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                await delay(40000);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_9})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_9.toString(),
                    `${parseInt(bid_amount) - 1}`,
                    bob.pkh,
                    [],
                    [],
                    null,
                    null
                ),
                as: bob.pkh,
            });
            const post_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            const bob_total_bid_amount = Math.ceil(parseInt(bid_amount - 1) * (1 + fee / 10000));

            assert(post_bob_ft_balance == bob_ft_balance - bob_total_bid_amount + 1);
            assert(alice_ft_balance == post_alice_ft_balance);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_9})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount - 1 &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );

            const alice_total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_9.toString(),
                    bid_amount,
                    alice.pkh,
                    [],
                    [],
                    null,
                    null
                ),
                as: alice.pkh,
            });

            const post_alice_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_9})`),
                exprMichelineToJson(`(pair address nat)'`)
            );

            assert(
                post_alice_bid.args[3].prim == 'Some' &&
                post_alice_bid.args[3].args[0].args[2].int == bid_amount &&
                post_alice_bid.args[3].args[0].args[3].string == alice.pkh
            );

            const post_alice_bid_bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const post_alice_bid_alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);

            assert(post_alice_bid_bob_ft_balance == post_bob_ft_balance + bob_total_bid_amount - 1 && post_alice_bid_bob_ft_balance == bob_ft_balance);
            assert(alice_ft_balance == post_alice_bid_alice_ft_balance + alice_total_bid_amount);
        });

        it('Put bid > buyout should close auction and succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }

            const new_bid_amount = parseInt(bid_amount) + 100;

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction_storage.address);
            const auction_ft_balance = await getFA2Balance(fa2_ft, token_id_9, auction.address);
            const alice_ft_balance = await getFA2Balance(fa2_ft, token_id_9, alice.pkh);
            const bob_ft_balance = await getFA2Balance(fa2_ft, token_id_9, bob.pkh);
            const carl_ft_balance = await getFA2Balance(fa2_ft, token_id_9, carl.pkh);
            const daniel_ft_balance = await getFA2Balance(fa2_ft, token_id_9, daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_9, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_9, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_9, bob.pkh);

            const alice_total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            const total_bid_amount = Math.ceil(parseInt(new_bid_amount) * (1 + fee / 10000)) - 1;

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_9})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_9.toString(),
                    new_bid_amount.toString(),
                    bob.pkh,
                    [],
                    [],
                    null,
                    null
                ),
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

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + alice_total_bid_amount + rest - 1);
            assert(post_bob_ft_balance == bob_ft_balance - total_bid_amount);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + 1);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_9})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Put bid Fungible FA2 tests', async () => {
        it('Put bid with good amount of Fungible FA2 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_0.toString(),
                    bid_amount,
                    bob.pkh,
                    [],
                    [],
                    null,
                    null
                ),
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );
        });

        it('Put bid with good amount of Fungible FA2 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');

            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_1.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });

        it('Put bid with good amount of Fungible FA2 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }

            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_2})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');

            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_2.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_2})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });

        it('Put identical bid should fail', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        bid_amount + 1,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_ALREADY_EXISTS"');
        });

        it('Put bid with amount < last bid should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_0.toString(),
                        bid_amount - 1,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_TOO_LOW"');
        });
    });

    describe('Put bid XTZ tests', async () => {
        it('Put bid with mismatch between bid amount and XTZ transferred', async () => {
            await expectToThrow(async () => {

                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 40);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(40000);
                }

                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_3.toString(),
                        bid_amount,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    amount: `${bid_amount + 1}utz`,
                    as: bob.pkh,
                });
            }, '"AUCTION_BID_AMOUNT_MISMATCH"');
        });

        it('Put bid with good amount of XTZ (no bid origin fees, no payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_3.toString(),
                    bid_amount,
                    bob.pkh,
                    [],
                    [],
                    null,
                    null
                ),
                amount: `${total_bid_amount}utz`,
                as: bob.pkh,
            });
            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );
        });

        it('Put bid with good amount of XTZ (single bid origin fees, single payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (bid_amount * (payout_value / 10000)));
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_4.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                amount: `${total_bid_amount}utz`,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });

        it('Put bid with good amount of XTZ (multiple bid origin fees, multiple payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();
            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_5.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                amount: `${total_bid_amount}utz`,
                as: bob.pkh,
            });

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });
    });

    describe('Put bid FA12 tests', async () => {
        it('Put bid with good amount of FA12 should succeed (no bid origin fees, no payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            assert(bob_ft_balance == initial_fa12_ft_amount / 2);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_6})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_6.toString(),
                    bid_amount,
                    bob.pkh,
                    [],
                    [],
                    null,
                    null
                ),
                as: bob.pkh,
            });
            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_0, bob.pkh);
            assert(post_bob_ft_balance == initial_fa12_ft_amount / 2 - total_bid_amount);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_6})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(
                post_bid.args[3].prim == 'Some' &&
                post_bid.args[3].args[0].args[2].int == bid_amount &&
                post_bid.args[3].args[0].args[3].string == bob.pkh
            );
        });

        it('Put bid with good amount of FA12 should succeed (single bid origin fees, single payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            assert(bob_ft_balance == initial_fa12_ft_amount / 2);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_7})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_7.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value)],
                    [mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                as: bob.pkh,
            });

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            const post_bob_ft_balance = await getFA12Balance(fa12_ft_1, bob.pkh);
            assert(post_bob_ft_balance == initial_fa12_ft_amount / 2 - total_bid_amount);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_7})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });

        it('Put bid with good amount of FA12 should succeed (multiple bid origin fees, multiple payouts)', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 40);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const storage = await auction_storage.getStorage();

            const bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            assert(bob_ft_balance == initial_fa12_ft_amount / 2);

            const bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_8})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(bid.args[3].prim == 'None');
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_8.toString(),
                    bid_amount,
                    bob.pkh,
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    [mkPart(carl.pkh, payout_value), mkPart(daniel.pkh, payout_value)],
                    null,
                    null
                ),
                as: bob.pkh,
            });

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));
            const post_bob_ft_balance = await getFA12Balance(fa12_ft_2, bob.pkh);
            assert(post_bob_ft_balance == initial_fa12_ft_amount / 2 - total_bid_amount);

            const post_bid = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_8})`),
                exprMichelineToJson(`(pair address nat)'`)
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
        });
    });


});

describe('Finish auction tests', async () => {
    describe('Finish Fungible FA2 auction tests', async () => {

        it('Finish Fungible FA2 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_0})`,
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

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_0})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish Fungible FA2 auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_1})`,
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
            const rest = bid_amount - protocol_fees - royalties - 3 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);

        });

        it('Finish Fungible FA2 auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_2})`,
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
            const rest = bid_amount - protocol_fees - 2 * royalties - 6 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 4 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 4 + royalties);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_2})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish XTZ auction tests', async () => {

        it('Finish XTZ auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
            }
            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_3})`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_3, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_3, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_3, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const rest = bid_amount - protocol_fees;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - total_bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2)));
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_3})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish XTZ auction (single royalties, single auction origin fees, single auction payouts, single bid origin fees, single bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_4})`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_4, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_4, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_4, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - royalties - 3 * fee_value;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - total_bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 2 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2).plus(fee_value * 2)));
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_4})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });

        it('Finish XTZ auction (multiple royalties, multiple auction origin fees, multiple auction payouts, multiple bid origin fees, multiple bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
            }

            const storage = await auction_storage.getStorage();

            const custody_ft_balance = await getBalance(auction_storage.address);
            const auction_ft_balance = await getBalance(auction.address);
            const alice_ft_balance = await getBalance(alice.pkh);
            //const bob_ft_balance = await getBalance(bob.pkh);
            const carl_ft_balance = await getBalance(carl.pkh);
            const daniel_ft_balance = await getBalance(daniel.pkh);
            const custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);
            const alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            var auction_record = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(auction_record != null);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_5})`,
                as: bob.pkh,
            });

            const post_custody_ft_balance = await getBalance(auction_storage.address);
            const post_auction_ft_balance = await getBalance(auction.address);
            const post_alice_ft_balance = await getBalance(alice.pkh);
            //const post_bob_ft_balance = await getBalance(bob.pkh);
            const post_carl_ft_balance = await getBalance(carl.pkh);
            const post_daniel_ft_balance = await getBalance(daniel.pkh);
            const post_custody_nft_balance = await getFA2Balance(nft, token_id_5, auction_storage.address);
            const post_alice_nft_balance = await getFA2Balance(nft, token_id_5, alice.pkh);
            const post_bob_nft_balance = await getFA2Balance(nft, token_id_5, bob.pkh);

            const protocol_fees = bid_amount * (fee / 10000);
            const royalties = bid_amount * (payout_value / 10000);
            const fee_value = bid_amount * (payout_value / 10000);
            const rest = bid_amount - protocol_fees - 2 * royalties - 6 * fee_value;

            assert(post_custody_ft_balance.isEqualTo(custody_ft_balance - total_bid_amount));
            assert(post_auction_ft_balance.isEqualTo(auction_ft_balance));
            assert(post_alice_ft_balance.isEqualTo(alice_ft_balance.plus(rest)));
            //Can't do this assert because bob balance will change because of gas fees
            //assert(post_bob_ft_balance.isEqualTo(bob_ft_balance));
            assert(post_carl_ft_balance.isEqualTo(carl_ft_balance.plus(fee_value * 4 + royalties)));
            assert(post_daniel_ft_balance.isEqualTo(daniel_ft_balance.plus(protocol_fees * 2).plus(fee_value * 4 + royalties)));
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_5})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });
    });

    describe('Finish FA12 auction tests', async () => {

        it('Finish FA12 auction (no royalties, no auction origin fees, no auction payouts, no bid origin fees, no bid payouts) should succeed', async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 10000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(100000);
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_6})`,
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

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_6})`),
                exprMichelineToJson(`(pair address nat)'`)
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000)));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_7})`,
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
            const rest = bid_amount - protocol_fees - royalties - 3 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 2 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 2);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_7})`),
                exprMichelineToJson(`(pair address nat)'`)
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

            const total_bid_amount = Math.ceil(parseInt(bid_amount) * (1 + fee / 10000) + (parseInt(bid_amount) * (payout_value / 10000) * 2));

            assert(custody_ft_balance == total_bid_amount);
            assert(auction_ft_balance == 0);
            assert(alice_ft_balance == initial_fa2_ft_amount / 2);
            assert(bob_ft_balance == initial_fa2_ft_amount / 2 - total_bid_amount);
            assert(carl_ft_balance == 0);
            assert(daniel_ft_balance == 0);
            assert(custody_nft_balance == 1);
            assert(alice_nft_balance == initial_nft_amount - 1);
            assert(bob_nft_balance == 0);

            await auction.finish_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_8})`,
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
            const rest = bid_amount - protocol_fees - 2 * royalties - 6 * fee_value;

            assert(post_custody_ft_balance == 0);
            assert(post_auction_ft_balance == auction_ft_balance);
            assert(post_alice_ft_balance == alice_ft_balance + rest);
            assert(post_bob_ft_balance == bob_ft_balance);
            assert(post_carl_ft_balance == carl_ft_balance + fee_value * 4 + royalties);
            assert(post_daniel_ft_balance == daniel_ft_balance + protocol_fees * 2 + fee_value * 4 + royalties);
            assert(post_custody_nft_balance == custody_nft_balance - 1 && post_custody_nft_balance == 0);
            assert(post_alice_nft_balance == alice_nft_balance);
            assert(post_bob_nft_balance == bob_nft_balance + 1);

            var post_tx_auction = await getValueFromBigMap(
                parseInt(storage.auctions),
                exprMichelineToJson(`(Pair "${nft.address}" ${token_id_8})`),
                exprMichelineToJson(`(pair address nat)'`)
            );
            assert(post_tx_auction == null);
        });

    });

    describe('Common Finish auction tests', async () => {
        it('Finish a non existing auction should fail', async () => {
            await expectToThrow(async () => {
                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" 99)`,
                    as: bob.pkh,
                });
            }, '"MISSING_AUCTION"');
        });

        it('Finish an auction not started should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000));
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(40000);
                }
                const start_time = Math.floor(Date.now() / 1000 + 100);
                await auction.start_auction({
                    argJsonMichelson: mkAuction(
                        nft.address,
                        token_id_6.toString(),
                        fa2_ft.address,
                        token_id_6.toString(),
                        FA_2_FT,
                        "1",
                        alice.pkh,
                        start_time,
                        "200",
                        minimal_price.toString(),
                        buyout_price.toString(),
                        min_step.toString(),
                        [],
                        [],
                        null,
                        null),
                    as: alice.pkh,
                });

                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" ${token_id_6})`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish an auction not ended (without bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000));
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(40000);
                }
                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" ${token_id_6})`,
                    as: bob.pkh,
                });
            }, '"AUCTION_NOT_FINISHABLE"');
        });

        it('Finish an auction not ended (with bid) should fail', async () => {
            await expectToThrow(async () => {
                if (isMockup()) {
                    await setMockupNow((Date.now() / 1000) + 100);
                } else {
                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(40000);
                }
                await auction.put_bid({
                    argJsonMichelson: mkBid(
                        nft.address,
                        token_id_6.toString(),
                        10000,
                        bob.pkh,
                        [],
                        [],
                        null,
                        null
                    ),
                    as: bob.pkh,
                });
                await auction.finish_auction({
                    argMichelson: `(Pair "${nft.address}" ${token_id_6})`,
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

    it('Cancel someone else auction should fail', async () => {
        await expectToThrow(async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000));
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(40000);
            }
            const start_time = Math.floor(Date.now() / 1000 + 1);
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    token_id_0.toString(),
                    fa2_ft.address,
                    token_id_0.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    start_time,
                    "200",
                    minimal_price.toString(),
                    buyout_price.toString(),
                    min_step.toString(),
                    [],
                    []),
                as: alice.pkh,
            });
            await auction.cancel_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_0})`,
                as: bob.pkh,
            });
        }, '"ONLY_SELLER_CAN_CANCEL_AUCTION"');
    });

    it('Cancel an already finished auction should fail', async () => {
        await expectToThrow(async () => {

            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 100000000);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                await delay(100000);
            }
            await auction.cancel_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_0})`,
                as: alice.pkh,
            });
        }, '"FINISHED_AUCTION_NON_CANCELLABLE"');
    });

    it('Cancel an auction with an existing bid should fail', async () => {
        await expectToThrow(async () => {
            if (isMockup()) {
                await setMockupNow((Date.now() / 1000) + 2);
            } else {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                await delay(42000);
            }
            await auction.put_bid({
                argJsonMichelson: mkBid(
                    nft.address,
                    token_id_0.toString(),
                    10000,
                    bob.pkh,
                    [],
                    []
                ),
                as: bob.pkh,
            });
            await auction.cancel_auction({
                argMichelson: `(Pair "${nft.address}" ${token_id_0})`,
                as: alice.pkh,
            });
        }, '"AUCTION_WITH_BID_NON_CANCELLABLE"');
    });

    it('Cancel a valid auction should succeed', async () => {
        const start_time = Math.floor(Date.now() / 1000 + 1);
        await auction.start_auction({
            argJsonMichelson: mkAuction(
                nft.address,
                token_id_1.toString(),
                fa2_ft.address,
                token_id_1.toString(),
                FA_2_FT,
                "1",
                alice.pkh,
                start_time,
                "200",
                minimal_price.toString(),
                buyout_price.toString(),
                min_step.toString(),
                [],
                []),
            as: alice.pkh,
        });
        const storage = await auction_storage.getStorage();
        var auction_record = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
            exprMichelineToJson(`(pair address nat)'`)
        );
        assert(auction_record != null);

        await auction.cancel_auction({
            argMichelson: `(Pair "${nft.address}" ${token_id_1})`,
            as: alice.pkh,
        });

        var post_tx_auction = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" ${token_id_1})`),
            exprMichelineToJson(`(pair address nat)'`)
        );
        assert(post_tx_auction == null);
    });
});
