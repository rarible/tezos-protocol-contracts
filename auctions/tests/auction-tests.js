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

describe('Contracts deployment', async () => {

    it('Fungible token (FA1.2) contract deployment should succeed', async () => {
        [fa12_ft, _] = await deploy(
            './tests/test-contracts/test-fa12-ft.arl',
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
            './tests/test-contracts/test-fa2-ft.arl',
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
            './tests/test-contracts/test-nft.arl',
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
            './tests/test-contracts/test-royalties-provider.arl',
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
                    protocol_fee: 100,
                    royalties_provider: royalties.address
                },
                as: alice.pkh,
            }
        );
    });
});
