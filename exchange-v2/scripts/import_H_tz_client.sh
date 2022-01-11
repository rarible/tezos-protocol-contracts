#! /bin/bash

NETWORK=https://hangzhounet.smartpy.io

tezos-client --endpoint $NETWORK activate account rarible_admin with ./faucets/rarible_admin.json --force
tezos-client --endpoint $NETWORK activate account rarible_account1 with ./faucets/rarible_account1.json --force
tezos-client --endpoint $NETWORK activate account rarible_account2 with ./faucets/rarible_account2.json --force
tezos-client --endpoint $NETWORK activate account rarible_account3 with ./faucets/rarible_account3.json --force
tezos-client --endpoint $NETWORK activate account rarible_account4 with ./faucets/rarible_account4.json --force
tezos-client --endpoint $NETWORK activate account rarible_account5 with ./faucets/rarible_account5.json --force
tezos-client --endpoint $NETWORK activate account rarible_account6 with ./faucets/rarible_account6.json --force
tezos-client --endpoint $NETWORK activate account rarible_account7 with ./faucets/rarible_account7.json --force

