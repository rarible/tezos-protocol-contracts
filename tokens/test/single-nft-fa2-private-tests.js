const {
    deploy,
    getAccount,
    getValueFromBigMap,
    setQuiet,
    expectToThrow,
    exprMichelineToJson,
    setMockupNow,
    isMockup,
    setEndpoint
} = require('@completium/completium-cli');
const { errors, mkTransferPermit, mkTransferGaslessArgs } = require('./utils');
const assert = require('assert');

require('mocha/package.json');
const mochaLogger = require('mocha-logger');

setQuiet('true');

const mockup_mode = true;

// contracts
let fa2;

// accounts
const alice  = getAccount(mockup_mode ? 'alice'      : 'alice');
const bob    = getAccount(mockup_mode ? 'bob'        : 'bob');
const carl   = getAccount(mockup_mode ? 'carl'       : 'carl');
const daniel = getAccount(mockup_mode ? 'daniel' : 'daniel');

const amount = 1;
let tokenId = 0;
const testAmount_1 = 1;
const testAmount_2 = 11;
let alicePermitNb = 0;
let bobPermitNb = 0;
let carlPermitNb = 0;

// permits
let permit;

async function expectToThrowMissigned(f, e) {
    const m = 'Failed to throw' + (e !== undefined ? e : '');
    try {
        await f();
        throw new Error(m);
    } catch (ex) {
        if ((ex.message && e !== undefined) || (ex && e !== undefined)) {
            if (ex.message)
                assert(
                    ex.message.includes(e),
                    `${e} was not found in the error message`
                );
            else
                assert(
                    ex.value.includes(e),
                    `${e} was not found in the error message`
                );
        } else if (ex.message === m) {
            throw e;
        }
    }
}

describe('[Single Private NFT] Contract deployment', async () => {
    it('Single FA2 Private collection contract deployment should succeed', async () => {
        [fa2, _] = await deploy(
            './contracts/single-nft-private/single-nft-fa2-private-collection.arl',
            {
                parameters: {
                    owner: alice.pkh,
                },
                as: alice.pkh,
            }
        );
    });
});

describe('[Single Private NFT] Add Minter', async () => {
    it('Add minter as non owner should fail', async () => {
        await expectToThrow(async () => {
            await fa2.add_minter({
                argMichelson: `"${bob.pkh}"`,
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Add minter as owner should succeed', async () => {
        let storage = await fa2.getStorage();
        assert(storage.minters.length == 0);
        await fa2.add_minter({
            argMichelson: `"${bob.pkh}"`,
            as: alice.pkh,
        });
        storage = await fa2.getStorage();
        assert(storage.minters.length == 1);
        assert(storage.minters[0] == bob.pkh);
    });
});

describe('[Single Private NFT] Remove Minter', async () => {
    it('Remove minter as non owner should fail', async () => {
        await expectToThrow(async () => {
            await fa2.remove_minter({
                argMichelson: `"${bob.pkh}"`,
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Remove non existing minter as owner should succeed', async () => {
        let storage = await fa2.getStorage();
        assert(storage.minters.length == 1);
        await fa2.remove_minter({
            argMichelson: `"${carl.pkh}"`,
            as: alice.pkh,
        });
        storage = await fa2.getStorage();
        assert(storage.minters.length == 1);
    });

    it('Remove minter as owner should succeed', async () => {
        let storage = await fa2.getStorage();
        assert(storage.minters.length == 1);
        await fa2.remove_minter({
            argMichelson: `"${bob.pkh}"`,
            as: alice.pkh,
        });
        storage = await fa2.getStorage();
        assert(storage.minters.length == 0);
    });
});

describe('[Single Private NFT] Minting', async () => {
    it('Mint tokens on Single FA2 Private collection contract as owner for ourself should succeed', async () => {
        await fa2.mint({
            arg: {
                itokenid: tokenId,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });
        const storage = await fa2.getStorage();
        var balance = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(balance.string == alice.pkh);
    });

    it('Mint tokens on Single FA2 Private collection contract as non owner for ourself should fail', async () => {
        await expectToThrow(async () => {
            await fa2.mint({
                arg: {
                    itokenid: tokenId + 1,
                    iowner: bob.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iroyalties: [
                        [alice.pkh, 1000],
                        [bob.pkh, 500],
                    ],
                },
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Mint tokens on Single FA2 Private collection contract as non owner for someone else should fail', async () => {
        await expectToThrow(async () => {
            await fa2.mint({
                arg: {
                    itokenid: tokenId + 2,
                    iowner: carl.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iroyalties: [
                        [alice.pkh, 1000],
                        [bob.pkh, 500],
                    ],
                },
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Mint tokens on Single FA2 Private collection contract as owner for someone else should succeed', async () => {
        await fa2.mint({
            arg: {
                itokenid: tokenId + 3,
                iowner: carl.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });
        const storage = await fa2.getStorage();
        var balance = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 3}`),
            exprMichelineToJson(`nat`)
        );
        assert(balance.string == carl.pkh);
    });

    it('Re-Mint same tokens on Single FA2 Private collection contract should fail', async () => {
        await expectToThrow(async () => {
            await fa2.mint({
                arg: {
                    itokenid: tokenId,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iroyalties: [
                        [alice.pkh, 1000],
                        [bob.pkh, 500],
                    ],
                },
                as: alice.pkh,
            });
        }, errors.KEY_EXISTS);
    });

    it('Mint tokens on Single FA2 Private collection contract as minter should succeed', async () => {
        await fa2.add_minter({
            argMichelson: `"${bob.pkh}"`,
            as: alice.pkh,
        });
        await fa2.mint({
            arg: {
                itokenid: tokenId + 10,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: bob.pkh,
        });
        const storage = await fa2.getStorage();
        var balance = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 10}`),
            exprMichelineToJson(`nat`)
        );
        assert(balance.string == alice.pkh);
    });
});

describe('[Single Private NFT] Update operators', async () => {
    it('Add an operator for ourself should succeed', async () => {
        const storage = await fa2.getStorage();
        var initialOperators = await getValueFromBigMap(
            parseInt(storage.operators),
            exprMichelineToJson(
                `(Pair "${fa2.address}" (Pair ${tokenId} "${alice.pkh}"))`
            ),
            exprMichelineToJson(`(pair address (pair nat address))'`)
        );
        assert(initialOperators == null);
        await fa2.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${fa2.address}" ${tokenId})}`,
            as: alice.pkh,
        });
        var operatorsAfterAdd = await getValueFromBigMap(
            parseInt(storage.operators),
            exprMichelineToJson(
                `(Pair "${fa2.address}" (Pair ${tokenId} "${alice.pkh}"))`
            ),
            exprMichelineToJson(`(pair address (pair nat address))'`)
        );
        assert(operatorsAfterAdd.prim == 'Unit');
    });

    it('Remove a non existing operator should succeed', async () => {
        await fa2.update_operators({
            argMichelson: `{Right (Pair "${alice.pkh}" "${bob.pkh}" ${tokenId})}`,
            as: alice.pkh,
        });
    });

    it('Remove an existing operator for another user should fail', async () => {
        await expectToThrow(async () => {
            await fa2.update_operators({
                argMichelson: `{Right (Pair "${alice.pkh}" "${fa2.address}" ${tokenId})}`,
                as: bob.pkh,
            });
        }, errors.CALLER_NOT_OWNER);
    });

    it('Add operator for another user should fail', async () => {
        await expectToThrow(async () => {
            await fa2.update_operators({
                argMichelson: `{Left (Pair "${bob.pkh}" "${fa2.address}" ${tokenId})}`,
                as: alice.pkh,
            });
        }, errors.CALLER_NOT_OWNER);
    });

    it('Remove an existing operator should succeed', async () => {
        const storage = await fa2.getStorage();
        var initialOperators = await getValueFromBigMap(
            parseInt(storage.operators),
            exprMichelineToJson(
                `(Pair "${fa2.address}" (Pair ${tokenId} "${alice.pkh}"))`
            ),
            exprMichelineToJson(`(pair address (pair nat address))'`)
        );
        assert(initialOperators.prim == 'Unit');
        await fa2.update_operators({
            argMichelson: `{Right (Pair "${alice.pkh}" "${fa2.address}" ${tokenId})}`,
            as: alice.pkh,
        });
        var operatorsAfterRemoval = await getValueFromBigMap(
            parseInt(storage.operators),
            exprMichelineToJson(
                `(Pair "${fa2.address}" (Pair ${tokenId} "${alice.pkh}"))`
            ),
            exprMichelineToJson(`(pair address (pair nat address))'`)
        );
        assert(operatorsAfterRemoval == null);
    });
});

describe('[Single Private NFT] Add permit', async () => {
    it('Add a permit with the wrong signature should fail', async () => {
        await expectToThrowMissigned(async () => {
            permit = await mkTransferPermit(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            const argM = `(Pair "${alice.pubk}" (Pair "edsigu3QDtEZeSCX146136yQdJnyJDfuMRsDxiCgea3x7ty2RTwDdPpgioHWJUe86tgTCkeD2u16Az5wtNFDdjGyDpb7MiyU3fn" 0x${permit.hash}))`;
            await fa2.permit({
                argMichelson: argM,
                as: bob.pkh,
            });
        }, errors.MISSIGNED);
    });

    it('Add a permit with the wrong hash should fail', async () => {
        await expectToThrowMissigned(async () => {
            permit = await mkTransferPermit(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x9aabe91d035d02ffb550bb9ea6fe19970f6fb41b5e69459a60b1ae401192a2dc))`;
            await fa2.permit({
                argMichelson: argM,
                as: bob.pkh,
            });
        }, errors.MISSIGNED);
    });

    it('Add a permit with the wrong public key should fail', async () => {
        await expectToThrowMissigned(async () => {
            permit = await mkTransferPermit(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            const argM = `(Pair "${bob.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
            await fa2.permit({
                argMichelson: argM,
                as: bob.pkh,
            });
        }, errors.MISSIGNED);
    });

    it('Add a permit with the good hash, signature and public key should succeed', async () => {
        permit = await mkTransferPermit(
            alice,
            bob,
            fa2.address,
            amount,
            tokenId,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;

        const storage = await fa2.getStorage();
        var initialPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(initialPermit == null);

        await fa2.permit({
            argMichelson: argM,
            as: bob.pkh,
        });
        alicePermitNb++;

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            addedPermit.args.length == 3 &&
            addedPermit.prim == 'Pair' &&
            addedPermit.args[0].int == '' + alicePermitNb &&
            addedPermit.args[1].prim == 'None' &&
            addedPermit.args[2][0].prim == 'Elt' &&
            addedPermit.args[2][0].args[0].bytes == permit.hash &&
            addedPermit.args[2][0].args[1].prim == 'Pair' &&
            addedPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            addedPermit.args[2][0].args[1].args[0].args[0].int == '31556952'
        );
    });

    it('Add a duplicated permit should succeed', async () => {
        const storage = await fa2.getStorage();
        var initialPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            initialPermit.args.length == 3 &&
            initialPermit.prim == 'Pair' &&
            initialPermit.args[0].int == '' + alicePermitNb &&
            initialPermit.args[1].prim == 'None' &&
            initialPermit.args[2][0].prim == 'Elt' &&
            initialPermit.args[2][0].args[0].bytes == permit.hash &&
            initialPermit.args[2][0].args[1].prim == 'Pair' &&
            initialPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            initialPermit.args[2][0].args[1].args[0].args[0].int == '31556952'
        );

        permit = await mkTransferPermit(
            alice,
            bob,
            fa2.address,
            amount,
            tokenId,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM,
            as: bob.pkh,
        });
        alicePermitNb++;

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            addedPermit.args.length == 3 &&
            addedPermit.prim == 'Pair' &&
            addedPermit.args[0].int == '' + alicePermitNb &&
            addedPermit.args[1].prim == 'None' &&
            addedPermit.args[2][0].prim == 'Elt' &&
            addedPermit.args[2][0].args[0].bytes == permit.hash &&
            addedPermit.args[2][0].args[1].prim == 'Pair' &&
            addedPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            addedPermit.args[2][0].args[1].args[0].args[0].int == '31556952'
        );
    });

    it('Expired permit are removed when a new permit is added should succeed', async () => {
        const expiry = 1;
        const storage = await fa2.getStorage();
        const now = new Date();
        if (isMockup()) setMockupNow(now);
        permit = await mkTransferPermit(
            alice,
            bob,
            fa2.address,
            amount,
            tokenId,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM,
            as: bob.pkh,
        });

        const firstPermit = permit.hash;

        alicePermitNb++;

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            addedPermit.args.length == 3 &&
            addedPermit.prim == 'Pair' &&
            addedPermit.args[0].int == '' + alicePermitNb &&
            addedPermit.args[1].prim == 'None' &&
            addedPermit.args[2][0].prim == 'Elt' &&
            addedPermit.args[2][0].args[0].bytes == firstPermit &&
            addedPermit.args[2][0].args[1].prim == 'Pair' &&
            addedPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            addedPermit.args[2][0].args[1].args[0].args[0].int == '31556952'
        );

        const argMExp = `(Pair (Some ${expiry}) (Some 0x${firstPermit}))`;

        await fa2.set_expiry({
            argMichelson: argMExp,
            as: alice.pkh,
        });

        var expiryRes = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            expiryRes.args.length == 3 &&
            expiryRes.prim == 'Pair' &&
            expiryRes.args[0].int == '' + alicePermitNb &&
            expiryRes.args[1].prim == 'None' &&
            expiryRes.args[2][0].prim == 'Elt' &&
            expiryRes.args[2][0].args[0].bytes == firstPermit &&
            expiryRes.args[2][0].args[1].prim == 'Pair' &&
            expiryRes.args[2][0].args[1].args[0].prim == 'Some' &&
            expiryRes.args[2][0].args[1].args[0].args[0].int == '' + expiry
        );

        if (isMockup()) setMockupNow(new Date(Date.now() + 1100));

        permit = await mkTransferPermit(
            alice,
            carl,
            fa2.address,
            amount,
            10,
            alicePermitNb
        );
        const argM2 = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM2,
            as: bob.pkh,
        });
        alicePermitNb++;

        var afterSecondPermitRes = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            afterSecondPermitRes.args.length == 3 &&
            afterSecondPermitRes.prim == 'Pair' &&
            afterSecondPermitRes.args[0].int == '' + alicePermitNb &&
            afterSecondPermitRes.args[1].prim == 'None' &&
            afterSecondPermitRes.args[2].length == 1 &&
            afterSecondPermitRes.args[2][0].prim == 'Elt' &&
            afterSecondPermitRes.args[2][0].args[0].bytes == permit.hash &&
            afterSecondPermitRes.args[2][0].args[1].prim == 'Pair' &&
            afterSecondPermitRes.args[2][0].args[1].args[0].prim == 'Some' &&
            afterSecondPermitRes.args[2][0].args[1].args[0].args[0].int == '31556952'
        );
    });
});

describe('[Single Private NFT] Transfers', async () => {
    it('Transfer a token not owned should fail', async () => {
        await expectToThrow(async () => {
            await fa2.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, 666, 1]]]],
                },
                as: alice.pkh,
            });
        }, errors.LEDGER_NOT_FOUND);
    });

    it('Transfer a token from another user without a permit or an operator should fail', async () => {
        await expectToThrow(async () => {
            await fa2.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, tokenId, 1]]]],
                },
                as: bob.pkh,
            });
        }, errors.FA2_NOT_OPERATOR);
    });

    it('Transfer more tokens that owned should fail', async () => {
        await expectToThrow(async () => {
            await fa2.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, tokenId, 666]]]],
                },
                as: alice.pkh,
            });
        }, errors.INVALID_AMOUNT);
    });

    it('Transfer tokens without operator and an expired permit should fail', async () => {
        if (isMockup()) setMockupNow(new Date());

        permit = await mkTransferPermit(
            alice,
            bob,
            fa2.address,
            amount,
            tokenId,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM,
            as: bob.pkh,
        });

        alicePermitNb++;

        const argMExp = `(Pair (Some 1) (Some 0x${permit.hash}))`;

        await fa2.set_expiry({
            argMichelson: argMExp,
            as: alice.pkh,
        });

        if (isMockup()) setMockupNow(new Date(Date.now() + 1100));

        await expectToThrow(async () => {
            await fa2.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, tokenId, amount]]]],
                },
                as: carl.pkh,
            });
        }, errors.EXPIRED_PERMIT);
    });

    it('Transfer tokens with an operator and with permit (permit not consumed) should succeed', async () => {
        const storage = await fa2.getStorage();

        permit = await mkTransferPermit(
            alice,
            carl,
            fa2.address,
            amount,
            tokenId,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM,
            as: carl.pkh,
        });

        alicePermitNb++;

        var initState = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        const permits_nb = initState.args[2].length

        await fa2.update_operators({
            argMichelson: `{Left (Pair "${alice.pkh}" "${carl.pkh}" ${tokenId})}`,
            as: alice.pkh,
        });

        var aliceBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(aliceBalances.string == alice.pkh);
        var bobBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobBalances.string == alice.pkh);

        await fa2.transfer({
            arg: {
                txs: [[alice.pkh, [[bob.pkh, tokenId, amount]]]],
            },
            as: carl.pkh,
        });

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            permits_nb == addedPermit.args[2].length &&
            JSON.stringify(initState.args[2]) == JSON.stringify(addedPermit.args[2])
        );

        var alicePostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(alicePostTransferBalances.string == bob.pkh);
        var bobPostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobPostTransferBalances.string == bob.pkh);
    });

    it('Transfer tokens without an operator and a valid permit (permit consumed)', async () => {
        // permit to transfer from payer to usdsReceiver
        const storage = await fa2.getStorage();

        await fa2.mint({
            arg: {
                itokenid: tokenId + 11,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });

        permit = await mkTransferPermit(
            alice,
            bob,
            fa2.address,
            amount,
            tokenId + 11,
            alicePermitNb
        );
        const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
        await fa2.permit({
            argMichelson: argM,
            as: alice.pkh,
        });

        var initState = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        const permits_nb = initState.args[2].length

        alicePermitNb++;

        var aliceBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 11}`),
            exprMichelineToJson(`nat`)
        );
        assert(aliceBalances.string == alice.pkh);
        var bobBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 11}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobBalances.string == alice.pkh);

        await fa2.update_operators({
            argMichelson: `{Right (Pair "${alice.pkh}" "${bob.pkh}" ${tokenId + 11})}`,
            as: alice.pkh,
        });

        await fa2.transfer({
            arg: {
                txs: [[alice.pkh, [[bob.pkh, tokenId + 11, amount]]]],
            },
            as: bob.pkh,
        });

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            permits_nb > addedPermit.args[2].length
        );

        var alicePostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 11}`),
            exprMichelineToJson(`nat`)
        );
        assert(alicePostTransferBalances.string == bob.pkh);
        var bobPostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${tokenId + 11}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobPostTransferBalances.string == bob.pkh);
    });
});

describe('[Single Public NFT] Transfers gasless ', async () => {
    it('Transfer a token not owned should fail', async () => {
        await expectToThrowMissigned(async () => {
            const testTokenId = 666
            permit = await mkTransferGaslessArgs(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            await fa2.transfer_gasless({
                argMichelson: `{ Pair { Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${testTokenId} ${amount}) } } (Pair "${alice.pubk}" "${permit.sig.prefixSig}" )}`,
                as: alice.pkh,
            });
        }, errors.MISSIGNED);
    });

    it('Transfer a token from another user with wrong a permit should fail', async () => {
        await expectToThrowMissigned(async () => {
            const testTokenId = 1
            permit = await mkTransferGaslessArgs(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            await fa2.transfer_gasless({
                argMichelson: `{ Pair { Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${testTokenId} ${amount}) } } (Pair "${bob.pubk}" "${permit.sig.prefixSig}" )}`,
                as: bob.pkh,
            });
        }, errors.MISSIGNED);
    });

    it('Transfer more tokens that owned should fail', async () => {
        await expectToThrowMissigned(async () => {
            const testTokenId = 1
            permit = await mkTransferGaslessArgs(
                alice,
                bob,
                fa2.address,
                666666,
                testTokenId,
                alicePermitNb
            );
            await fa2.transfer_gasless({
                argMichelson: `{ Pair { Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${testTokenId} ${amount}) } } (Pair "${bob.pubk}" "${permit.sig.prefixSig}" )}`,
                as: alice.pkh,
            });
        }, errors.MISSIGNED);
    });


    it('Transfer tokens with permit should succeed', async () => {
        const storage = await fa2.getStorage();
        const testTokenId = 11111

        await fa2.mint({
            arg: {
                itokenid: testTokenId,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });

        permit = await mkTransferGaslessArgs(
            alice,
            bob,
            fa2.address,
            amount,
            testTokenId,
            alicePermitNb
        );

        alicePermitNb++;

        var aliceBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(aliceBalances.string == alice.pkh);
        var bobBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobBalances.string == alice.pkh);

        await fa2.transfer_gasless({
            argMichelson: `{ Pair { Pair "${alice.pkh}" { Pair "${bob.pkh}" (Pair ${testTokenId} ${amount}) } } (Pair "${alice.pubk}" "${permit.sig.prefixSig}" )}`,
            as: bob.pkh,
        });

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${alice.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            ""+alicePermitNb == addedPermit.args[0].int
        );

        var alicePostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(alicePostTransferBalances.string == bob.pkh);
        var bobPostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(bobPostTransferBalances.string == bob.pkh);
    });

});

describe('[Single Private NFT] Set metadata', async () => {
    it('Set metadata with empty content should succeed', async () => {
        const argM = `(Pair "key" 0x)`;
        const storage = await fa2.getStorage();
        await fa2.set_metadata({
            argMichelson: argM,
            as: alice.pkh,
        });
        var metadata = await getValueFromBigMap(
            parseInt(storage.metadata),
            exprMichelineToJson(`""`),
            exprMichelineToJson(`string'`)
        );
        assert(metadata.bytes == '');
    });

    it('Set metadata called by not owner should fail', async () => {
        await expectToThrow(async () => {
            const argM = `(Pair "key" 0x)`;
            await fa2.set_metadata({
                argMichelson: argM,
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Set metadata with valid content should succeed', async () => {
        const bytes =
            '0x05070707070a00000016016a5569553c34c4bfe352ad21740dea4e2faad3da000a00000004f5f466ab070700000a000000209aabe91d035d02ffb550bb9ea6fe19970f6fb41b5e69459a60b1ae401192a2dc';
        const argM = `(Pair "" ${bytes})`;
        const storage = await fa2.getStorage();

        await fa2.set_metadata({
            argMichelson: argM,
            as: alice.pkh,
        });

        var metadata = await getValueFromBigMap(
            parseInt(storage.metadata),
            exprMichelineToJson(`""`),
            exprMichelineToJson(`string'`)
        );
        assert('0x' + metadata.bytes == bytes);
    });
});

describe('[Single Private NFT] Set expiry', async () => {

    it('Set global expiry with too big value should fail', async () => {
        const argMExp = `(Pair (Some 999999999999999999999999999999999999999) (None))`;
        await expectToThrow(async () => {
            await fa2.set_expiry({
                argMichelson: argMExp,
                as: alice.pkh,
            });
        }, errors.EXPIRY_TOO_BIG);
    });

    it('Set expiry for an existing permit with too big value should fail', async () => {
        await expectToThrow(async () => {
            const testAmount = 11;
            permit = await mkTransferPermit(
                alice,
                bob,
                fa2.address,
                testAmount,
                tokenId,
                alicePermitNb
            );
            const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;
            await fa2.permit({
                argMichelson: argM,
                as: alice.pkh,
            });
            alicePermitNb++;
            const argMExp = `(Pair (Some 999999999999999999999999999999999999999) (Some 0x${permit.hash}))`;

            await fa2.set_expiry({
                argMichelson: argMExp,
                as: bob.pkh,
            });
        }, errors.EXPIRY_TOO_BIG);
    });

    it('Set expiry with 0 (permit get deleted) should succeed', async () => {
        const testAmount = testAmount_2;
        const storage = await fa2.getStorage();
        permit = await mkTransferPermit(
            carl,
            alice,
            fa2.address,
            testAmount,
            tokenId,
            carlPermitNb
        );
        const argM = `(Pair "${carl.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;

        var initialPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(initialPermit == null);

        await fa2.permit({
            argMichelson: argM,
            as: alice.pkh,
        });
        carlPermitNb++;

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            addedPermit.args.length == 3 &&
            addedPermit.prim == 'Pair' &&
            addedPermit.args[0].int == '' + carlPermitNb &&
            addedPermit.args[1].prim == 'None' &&
            addedPermit.args[2].length == 1 &&
            addedPermit.args[2][0].prim == 'Elt' &&
            addedPermit.args[2][0].args[0].bytes == permit.hash &&
            addedPermit.args[2][0].args[1].prim == 'Pair' &&
            addedPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            addedPermit.args[2][0].args[1].args[0].args[0].int == '31556952'
        );

        const argMExp = `(Pair (Some 0) (Some 0x${permit.hash}))`;

        await fa2.set_expiry({
            argMichelson: argMExp,
            as: carl.pkh,
        });

        var finalPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            finalPermit.args.length == 3 &&
            finalPermit.prim == 'Pair' &&
            finalPermit.args[0].int == '' + carlPermitNb &&
            finalPermit.args[1].prim == 'None' &&
            finalPermit.args[2].length == 0
        );

    });

    it('Set expiry with a correct value should succeed', async () => {
        const testAmount = 11;
        const expiry = 8;
        const storage = await fa2.getStorage();

        permit = await mkTransferPermit(
            carl,
            bob,
            fa2.address,
            testAmount,
            tokenId,
            carlPermitNb
        );
        const argM = `(Pair "${carl.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;

        var initialPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            initialPermit.args.length == 3 &&
            initialPermit.prim == 'Pair' &&
            initialPermit.args[0].int == '' + carlPermitNb &&
            initialPermit.args[1].prim == 'None' &&
            initialPermit.args[2].length == 0
        );
        await fa2.permit({
            argMichelson: argM,
            as: alice.pkh,
        });

        carlPermitNb++;

        var createdAt = await await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );

        assert(
            createdAt.args.length == 3 &&
            createdAt.prim == 'Pair' &&
            createdAt.args[0].int == '' + carlPermitNb &&
            createdAt.args[1].prim == 'None' &&
            createdAt.args[2].length == 1 &&
            createdAt.args[2][0].prim == 'Elt' &&
            createdAt.args[2][0].args[0].bytes == permit.hash &&
            createdAt.args[2][0].args[1].prim == 'Pair' &&
            createdAt.args[2][0].args[1].args[0].prim == 'Some' &&
            createdAt.args[2][0].args[1].args[0].args[0].int == '31556952'
        );

        var creationDate = createdAt.args[2][0].args[1].args[1].string;

        const argMExp = `(Pair (Some ${expiry}) (Some 0x${permit.hash}))`;

        await fa2.set_expiry({
            argMichelson: argMExp,
            as: carl.pkh,
        });

        var addedPermit = await getValueFromBigMap(
            parseInt(storage.permits),
            exprMichelineToJson(`"${carl.pkh}"`),
            exprMichelineToJson(`address'`)
        );
        assert(
            addedPermit.args.length == 3 &&
            addedPermit.prim == 'Pair' &&
            addedPermit.args[0].int == '' + carlPermitNb &&
            addedPermit.args[1].prim == 'None' &&
            addedPermit.args[2].length == 1 &&
            addedPermit.args[2][0].prim == 'Elt' &&
            addedPermit.args[2][0].args[0].bytes == permit.hash &&
            addedPermit.args[2][0].args[1].prim == 'Pair' &&
            addedPermit.args[2][0].args[1].args[0].prim == 'Some' &&
            addedPermit.args[2][0].args[1].args[0].args[0].int == expiry &&
            addedPermit.args[2][0].args[1].args[1].string == creationDate
        );
    });
});

describe('[Single Private NFT] Burn', async () => {
    it('Burn without tokens should fail', async () => {
        await expectToThrow(async () => {
            await fa2.burn({
                argMichelson: `${tokenId}`,
                as: alice.pkh,
            });
        }, errors.CALLER_NOT_OWNER);
    });

    it('Burn tokens of someone else should fail', async () => {
        await expectToThrow(async () => {
            await fa2.burn({
                argMichelson: `${tokenId}`,
                as: alice.pkh,
            });
        }, errors.CALLER_NOT_OWNER);
    });

    it('Burn tokens with enough tokens should succeed', async () => {
        const storage = await fa2.getStorage();
        const testTokenId = tokenId + 666;
        await fa2.mint({
            arg: {
                itokenid: testTokenId,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });

        var aliceTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(aliceTransferBalances.string === alice.pkh);
        await fa2.burn({
            argMichelson: `${testTokenId}`,
            as: alice.pkh,
        });

        var alicePostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(alicePostTransferBalances === null);
    });

    it('Re-mint a burnt token', async () => {
        const storage = await fa2.getStorage();
        const testTokenId = tokenId + 666;
        await fa2.mint({
            arg: {
                itokenid: testTokenId,
                iowner: alice.pkh,
                itokenMetadata: [{ key: '', value: '0x' }],
                iroyalties: [
                    [alice.pkh, 1000],
                    [bob.pkh, 500],
                ],
            },
            as: alice.pkh,
        });

        var aliceTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(aliceTransferBalances.string === alice.pkh);
        await fa2.burn({
            argMichelson: `${testTokenId}`,
            as: alice.pkh,
        });

        var alicePostTransferBalances = await getValueFromBigMap(
            parseInt(storage.ledger),
            exprMichelineToJson(`${testTokenId}`),
            exprMichelineToJson(`nat`)
        );
        assert(alicePostTransferBalances === null);
    });
});

describe('[Single Private NFT] Pause', async () => {
    it('Set pause should succeed', async () => {
        await fa2.pause({
            as: alice.pkh,
        });
        const storage = await fa2.getStorage();
        assert(storage.paused == true);
    });

    it('Minting is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.mint({
                arg: {
                    itokenid: tokenId,
                    iowner: alice.pkh,
                    itokenMetadata: [{ key: '', value: '0x' }],
                    iroyalties: [
                        [alice.pkh, 1000],
                        [bob.pkh, 500],
                    ],
                },
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Update operators is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.update_operators({
                argMichelson: `{Left (Pair "${alice.pkh}" "${bob.pkh}" ${tokenId})}`,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Add permit is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            permit = await mkTransferPermit(
                alice,
                bob,
                fa2.address,
                amount,
                tokenId,
                alicePermitNb
            );
            const argM = `(Pair "${alice.pubk}" (Pair "${permit.sig.prefixSig}" 0x${permit.hash}))`;

            await fa2.permit({
                argMichelson: argM,
                as: bob.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Transfer is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.transfer({
                arg: {
                    txs: [[alice.pkh, [[bob.pkh, tokenId, 666]]]],
                },
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Set metadata is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            const bytes =
            '0x05070707070a00000016016a5569553c34c4bfe352ad21740dea4e2faad3da000a00000004f5f466ab070700000a000000209aabe91d035d02ffb550bb9ea6fe19970f6fb41b5e69459a60b1ae401192a2dc';
            const argM = `(Pair "" ${bytes})`;
            await fa2.set_metadata({
                argMichelson: argM,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Set expiry is not possible when contract is paused should fail', async () => {
        const testAmount = 11;
        const expiry = 8;

        permit = await mkTransferPermit(
            carl,
            bob,
            fa2.address,
            testAmount,
            tokenId,
            carlPermitNb
        );
        const argMExp = `(Pair (Some ${expiry}) (Some 0x${permit.hash}))`;
        await expectToThrow(async () => {
            await fa2.set_expiry({
                argMichelson: argMExp,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Burn is not possible when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.burn({
                argMichelson: `${tokenId}`,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Transfer ownership when contract is paused should succeed', async () => {
        let storage = await fa2.getStorage();
        assert(storage.owner == alice.pkh);
        await fa2.declare_ownership({
            argMichelson: `"${alice.pkh}"`,
            as: alice.pkh,
        });
        storage = await fa2.getStorage();
        assert(storage.owner == alice.pkh);
    });

    it('Add minter when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.add_minter({
                argMichelson: `"${bob.pkh}"`,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });

    it('Remove minter when contract is paused should fail', async () => {
        await expectToThrow(async () => {
            await fa2.remove_minter({
                argMichelson: `"${bob.pkh}"`,
                as: alice.pkh,
            });
        }, errors.CONTRACT_PAUSED);
    });
});

describe('[Single Private NFT] Transfer ownership', async () => {
    it('Transfer ownership as non owner should fail', async () => {
        await fa2.unpause({
            as: alice.pkh,
        });
        await expectToThrow(async () => {
            await fa2.declare_ownership({
                argMichelson: `"${bob.pkh}"`,
                as: bob.pkh,
            });
        }, errors.INVALID_CALLER);
    });

    it('Transfer ownership as owner should succeed', async () => {
        let storage = await fa2.getStorage();
        assert(storage.owner == alice.pkh);
        await fa2.declare_ownership({
            argMichelson: `"${bob.pkh}"`,
            as: alice.pkh,
        });
        await fa2.claim_ownership({
            as: bob.pkh,
        });
        storage = await fa2.getStorage();
        assert(storage.owner == bob.pkh);
    });
});
