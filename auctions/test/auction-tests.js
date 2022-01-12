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
    setEndpoint
} = require('@completium/completium-cli');
const { errors, mkTransferPermit, mkApproveForAllSingle, mkDeleteApproveForAllSingle, mkTransferGaslessArgs } = require('./utils');
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



// accounts
const alice  = getAccount(mockup_mode ? 'alice'      : 'alice');
const bob    = getAccount(mockup_mode ? 'bob'        : 'bob');
const carl   = getAccount(mockup_mode ? 'carl'       : 'carl');
const daniel = getAccount(mockup_mode ? 'bootstrap1' : 'bootstrap1');

//set endpointhead
setEndpoint(mockup_mode ? 'mockup' : 'https://hangzhounet.smartpy.io');

describe('Contract deployments', async () => {

    it('Fungible token (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft, _] = await deploy(
            './test/test-contracts/test-fa12-ft.arl',
            {
                parameters: {
                    initialholder: alice.pkh,
                    totalsupply: 100000000000
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
                    fee_receiver: carl.pkh,
                    protocol_fee: 0,
                    royalties_provider: nft.address
                },
                as: alice.pkh,
            }
        );
    });
});

describe('Auction storage Auction contract setter tests', async () => {
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
            const fee = 100;
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
                await auction.set_fee_receiver({
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
            assert(storage.fee_receiver == carl.pkh);
            await auction.set_fee_receiver({
                arg: {
                    sfr: receiver
                },
                as: alice.pkh
            });
            const post_test_storage = await auction.getStorage();
            assert(post_test_storage.fee_receiver == receiver);
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
