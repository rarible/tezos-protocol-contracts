const {
    deploy,
    getAccount,
    setQuiet,
    setEndpoint,
    sign
} = require('@completium/completium-cli');
const { mk_payload} = require('./utils');
const assert = require('assert');
const axios = require('axios');
require('mocha/package.json');

setQuiet('true');

const mockup_mode = true;

// contracts
let signature_checker;

// accounts
const alice  = getAccount(mockup_mode ? 'alice' : 'alice');

const node = "https://rpc.ithacanet.teztnets.xyz";

setEndpoint(node);


describe('Contract deployment', async () => {
    it('Deploy signature contract should succeed', async () => {
        [signature_checker, _] = await deploy(
            './contracts/signature-checker.arl',
            {
                as: alice.pkh
            }
        );
    });
});

describe('Signature tests', async () => {
    it('Checking a good signature should succeed', async () => {
        const payload_to_sign = "message to sign"
        const sig = await sign(mk_payload(payload_to_sign), { as : alice.name})
        const payload = {
            "chain_id": "NetXnHfVqm9iesp",
            "contract": signature_checker.address,
            "entrypoint": "check_signature",
            "gas": "100000",
            "input": {
                "prim": "Pair",
                "args": [{
                    "string": "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "string": payload_to_sign
                    }, {
                        "string": sig.prefixSig
                    }]
                }]
            },
            "payer": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "unparsing_mode": "Readable"
        }
        const response = await axios.post(node+'/chains/main/blocks/head/helpers/scripts/run_view', payload)
        assert(response.data.data.prim == 'True')
    });

    it('Checking a bad signature should fail', async () => {
        const payload_to_sign = "message to sign"
        const sig = await sign(mk_payload(payload_to_sign), { as : alice.name})
        const payload = {
            "chain_id": "NetXnHfVqm9iesp",
            "contract": signature_checker.address,
            "entrypoint": "check_signature",
            "gas": "100000",
            "input": {
                "prim": "Pair",
                "args": [{
                    "string": "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "string": payload_to_sign
                    }, {
                        "string": sig.prefixSig
                    }]
                }]
            },
            "payer": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "unparsing_mode": "Readable"
        }
        const response = await axios.post(node+'/chains/main/blocks/head/helpers/scripts/run_view', payload)
        assert(response.data.data.prim == 'False')
    });

    it('Checking a bad signature payload should fail', async () => {
        const payload_to_sign = "message to sign"
        const sig = await sign(mk_payload(payload_to_sign), { as : alice.name})
        const payload = {
            "chain_id": "NetXnHfVqm9iesp",
            "contract": signature_checker.address,
            "entrypoint": "check_signature",
            "gas": "100000",
            "input":
                 {
                    "prim": "Pair",
                    "args": [{
                        "string": payload_to_sign
                    }, {
                        "string": sig.prefixSig
                    }]
            },
            "payer": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "unparsing_mode": "Readable"
        }
        try{
            await axios.post(node+'/chains/main/blocks/head/helpers/scripts/run_view', payload)
        } catch (e) {
            assert(e.response.status == 500)
        }
    });

    it('Checking an incorrect signature payload should fail', async () => {
        const payload_to_sign = "message to sign"
        const payload = {
            "chain_id": "NetXnHfVqm9iesp",
            "contract": signature_checker.address,
            "entrypoint": "check_signature",
            "gas": "100000",
            "input": {
                "prim": "Pair",
                "args": [{
                    "string": "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4"
                }, {
                    "prim": "Pair",
                    "args": [{
                        "string": payload_to_sign
                    }, {
                        "string": ""
                    }]
                }]
            },
            "payer": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "source": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            "unparsing_mode": "Readable"
        }
        try{
            await axios.post(node+'/chains/main/blocks/head/helpers/scripts/run_view', payload)
        } catch (e) {
            assert(e.response.status == 500)
        }
    });
});
