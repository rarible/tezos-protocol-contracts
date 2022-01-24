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
    setNow
} = require('@completium/completium-cli');
const { errors, mkTransferPermit, mkApproveForAllSingle, mkDeleteApproveForAllSingle, mkTransferGaslessArgs, mkAuction, FA_2_FT, mkPart, mkFA12Auction, mkFungibleFA2Auction, mkXTZAuction, FA_2_NFT, mkBid } = require('./utils');
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
let fa12_ft;
let fa2_ft;

const initial_fa2_ft_amount = 10000000;
const initial_fa12_ft_amount = 10000000;
const initial_nft_amount = 100;
const nft_token_id = 0;
const fa2_ft_token_id = 0;
const fee = 100;

// accounts
const alice = getAccount(mockup_mode ? 'alice' : 'alice');
const bob = getAccount(mockup_mode ? 'bob' : 'bob');
const carl = getAccount(mockup_mode ? 'carl' : 'carl');
const daniel = getAccount(mockup_mode ? 'bootstrap1' : 'bootstrap1');

//set endpointhead
//setEndpoint(mockup_mode ? 'mockup' : 'https://hangzhounet.smartpy.io');

const a = exprMichelineToJson('(Pair (Pair (Right (Right (Left 1))) (Pair (Some "KT1WJ4kHmQW5v6pBs3wLFMcpFS81eWCCLaUJ") (Some 0))) (Pair 1 (Pair (Pair (Right (Right (Left 0))) (Pair (Some "KT1B69UKZVwPP1tnjCDXJH7tDUZTjmJ21QF7") (Some 0))) (Pair "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" (Pair (Some 1642148097) (Pair 6 (Pair 5 (Pair 4 (Pair 3 (Pair { Pair "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" 2 } { Pair "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb" 1 }))))))))))');
describe('Contract deployments', async () => {

    it('Fungible token (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft, _] = await deploy(
            './test/test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: initial_fa12_ft_amount
                },
                as: alice.pkh,
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
            const extension = 1800;
            const storage = await auction.getStorage();
            assert(storage.extension_duration.toFixed() == BigNumber(900).toFixed());
            await auction.set_extension_duration({
                arg: {
                    sed: extension
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.extension_duration.toFixed() == BigNumber(extension).toFixed());
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
            await fa12_ft.approve({
                arg: {
                    spender: alice.pkh,
                    value: initial_fa12_ft_amount / 2,
                },
                as: alice.pkh,
            });
            await fa12_ft.transfer({
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
                    itokenid: fa2_ft_token_id,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_fa2_ft_amount,
                    iroyalties: [],
                },
                as: alice.pkh,
            });
            await fa2_ft.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, 0, initial_fa2_ft_amount / 2]]]],
                },
                as: alice.pkh,
            });
        });
    });

    describe('NFT FA2 tokens setup', async () => {
        it('Mint NFT FA2 tokens should succeed', async () => {
            await nft.mint({
                arg: {
                    itokenid: nft_token_id,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iamount: initial_nft_amount,
                    iroyalties: [
                        [alice.pkh, 100],
                        [bob.pkh, 100],
                    ],
                },
                as: alice.pkh,
            });
        });
    });

    it('Add auction contract as operator for NFT and FT', async () => {
        await nft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${nft_token_id})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${auction.address}" ${fa2_ft_token_id})}`,
            as: alice.pkh,
        });
        await fa2_ft.update_operators({
            argMichelson: `{Left (Pair "${bob.pkh}" "${auction.address}" ${fa2_ft_token_id})}`,
            as: bob.pkh,
        });
    });
});

describe('Start Auction tests', async () => {
    it('Starting auction for FA12 to purchase should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkFA12Auction(
                    fa12_ft.address,
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
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

    it('Starting auction for Fungible FA2 to purchase should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkFungibleFA2Auction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
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

    it('Starting auction for XTZ to purchase should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkXTZAuction(
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
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
                    fa2_ft_token_id.toString(),
                    nft.address,
                    nft_token_id.toString(),
                    FA_2_NFT,
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
        }, '(Pair "InvalidCondition" "r_sa1")');
    });

    it('Starting auction with duration < extension duration should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    Date.now(),
                    "1",
                    "10",
                    "100",
                    "2",
                    [mkPart(alice.pkh, "100")],
                    [mkPart(alice.pkh, "100")]),
                as: alice.pkh,
            });
        }, '(Pair "InvalidCondition" "r_sa2")');
    });

    it('Starting auction with duration > max_duration should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    Date.now(),
                    "999999999999999999999",
                    "10",
                    "100",
                    "2",
                    [mkPart(alice.pkh, "100")],
                    [mkPart(alice.pkh, "100")]),
                as: alice.pkh,
            });
        }, '(Pair "InvalidCondition" "r_sa3")');
    });

    it('Starting auction with buyout price < min price should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
                    FA_2_FT,
                    "1",
                    alice.pkh,
                    Date.now(),
                    "1000000",
                    "100",
                    "1",
                    "2",
                    [mkPart(alice.pkh, "100")],
                    [mkPart(alice.pkh, "100")]),
                as: alice.pkh,
            });
        }, '(Pair "InvalidCondition" "r_sa4")');
    });

    it('Starting auction as non owner of the NFT should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
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
                as: carl.pkh,
            });
        }, '(Pair "InvalidCondition" "r_sa7")');
    });

    // it('Starting auction with missing asset contract should fail', async () => {
    //     await expectToThrow(async () => {
    //         await auction.start_auction({
    //             argJsonMichelson: mkAuction(
    //                 "",
    //                 nft_token_id.toString(),
    //                 fa2_ft.address,
    //                 fa2_ft_token_id.toString(),
    //                 FA_2_FT,
    //                 "1",
    //                 alice.pkh,
    //                 Date.now(),
    //                 "1000000",
    //                 "10",
    //                 "100",
    //                 "2",
    //                 [mkPart(alice.pkh, "100")],
    //                 [mkPart(alice.pkh, "100")]),
    //             as: alice.pkh,
    //         });
    //     }, '"MISSING_ASSET_CONTRACT"');
    // });

    // it('Starting auction with missing asset id should fail', async () => {
    //     await expectToThrow(async () => {
    //         await auction.start_auction({
    //             argJsonMichelson: mkAuction(
    //                 nft.address,
    //                 "",
    //                 fa2_ft.address,
    //                 fa2_ft_token_id.toString(),
    //                 FA_2_FT,
    //                 "1",
    //                 alice.pkh,
    //                 Date.now(),
    //                 "1000000",
    //                 "10",
    //                 "100",
    //                 "2",
    //                 [mkPart(alice.pkh, "100")],
    //                 [mkPart(alice.pkh, "100")]),
    //             as: alice.pkh,
    //         });
    //     }, '"MISSING_ASSET_ID"');
    // });

    it('Starting auction buying with Fungible FA2 should succeed', async () => {
        if (isMockup()){
            await setMockupNow((Date.now() / 1000));
        }
        const start_time = Date.now();
        const duration = 10000;
        const storage = await auction_storage.getStorage();
        const minimal_price = 10;
        const buyout_price = 100;
        const min_step = 2;
        const payout_value = 100;
        var auctions = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" ${nft_token_id})`),
            exprMichelineToJson(`(pair address nat)'`)
        );
        assert(auctions == null);
        await auction.start_auction({
            argJsonMichelson: mkAuction(
                nft.address,
                nft_token_id.toString(),
                fa2_ft.address,
                fa2_ft_token_id.toString(),
                FA_2_FT,
                "1",
                alice.pkh,
                start_time,
                duration.toString(),
                minimal_price.toString(),
                buyout_price.toString(),
                min_step.toString(),
                [mkPart(alice.pkh, "100")],
                [mkPart(alice.pkh, "100")]),
            as: alice.pkh,
        });

        var post_tx_auctions = await getValueFromBigMap(
            parseInt(storage.auctions),
            exprMichelineToJson(`(Pair "${nft.address}" ${nft_token_id})`),
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
                        "int": "${nft_token_id}"
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
                "int": "${start_time}"
            }, {
                "int": "${start_time + duration}"
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
                    "string": "${alice.pkh}"
                }, {
                    "int": "${payout_value}"
                }]
            }],
            [{
                "prim": "Pair",
                "args": [{
                    "string": "${alice.pkh}"
                }, {
                    "int": "${payout_value}"
                }]
            }]
        ]`);
        assert(JSON.stringify(post_tx_auctions.args) === JSON.stringify(expected_result));
    });

    it('Starting auction buying with Fungible FA2 that already exists should fail', async () => {
        await expectToThrow(async () => {
            await auction.start_auction({
                argJsonMichelson: mkAuction(
                    nft.address,
                    nft_token_id.toString(),
                    fa2_ft.address,
                    fa2_ft_token_id.toString(),
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
        }, '"AUCTION_ALREADY_EXISTS"');
    });
});

describe('Put bid tests', async () => {
    it('Put bid should succeed', async () => {
        if (isMockup()){
            await setMockupNow((Date.now() / 1000) + 9000);
        }
        await auction.put_bid({
            argJsonMichelson: mkBid(
                nft.address,
                nft_token_id.toString(),
                "10",
                bob.pkh,
                [mkPart(alice.pkh, "100")],
                [mkPart(alice.pkh, "100")]
            ),
            as: bob.pkh,
        });
    });
});

describe('Finish auction tests', async () => {
    it('Finish auction succeed', async () => {
        if (isMockup()){
            await setMockupNow((Date.now() / 1000) + 1000);
        }
        await auction.finish_auction({
            argMichelson: `(Pair "${nft.address}" ${nft_token_id})`,
            as: bob.pkh,
        });
    });
});