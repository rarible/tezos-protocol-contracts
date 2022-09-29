import { blake2b, Bytes, expect_to_fail, get_account, Key, Nat, Option, Or, pair_to_mich, set_mockup, set_mockup_now, set_quiet, Signature, string_to_mich } from '@completium/experiment-ts'

const assert = require('assert');

/* Contracts */
import { fa12 } from './binding/fa12';
import {fa2} from "./binding/fa2";
import {royalties} from "./binding/royalties";
import {transfer_manager} from "./binding/transfer-manager";
import {sales_storage} from "./binding/sales-storage";
import {feeless_sales} from "./binding/feeless-sales";

/* Accounts ----------------------------------------------------------------- */

const alice = get_account('alice');
const bob   = get_account('bob');
const carl  = get_account('carl');
const daniel = get_account('daniel');

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Now --------------------------------------------------------------------- */

const now = new Date(Date.now())
set_mockup_now(now)

/* Constants & Utils ------------------------------------------------------- */

const token_id = new Nat(0)
const amount = new Nat(123)
const expiry = new Nat(31556952)
const initial_fa12_ft_amount = 100000000;
const fee = 250;
const payout_value = 100;
const max_fees = 10000;
const sale_amount = 1000000;
const qty = 1;

/* Scenarios --------------------------------------------------------------- */
describe('Contracts deployment', async () => {
  it('FA1.2 contract deployment should succeed', async () => {
    await fa12.deploy(alice.get_address(), new Nat(initial_fa12_ft_amount), { as: alice })
  });
  it('FA2 contract deployment should succeed', async () => {
    await fa2.deploy(alice.get_address(), { as: alice })
  });
  it('Royalties contract deployment should succeed', async () => {
    await royalties.deploy(alice.get_address(),  { as: alice })
  });
  it('Transfer manager contract deployment should succeed', async () => {
    await transfer_manager.deploy(alice.get_address(), bob.get_address(), bob.get_address(),  { as: alice })
  });
  it('Sales storage contract deployment should succeed', async () => {
    await sales_storage.deploy(alice.get_address(),  { as: alice })
  });
  it('Feeless Sales contract deployment should succeed', async () => {
    await feeless_sales.deploy(alice.get_address(), new Nat(99), royalties.get_address(), royalties.get_address(), { as: alice })
  });
});

describe('(Transfer manager)Authorize Sales, and Sales storage contract tests', async () => {
  it('Authorize Sales, and Sales storage contract as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await transfer_manager.authorize_contract(feeless_sales.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Authorize Sales, and Sales storage contract as admin should succeed', async () => {
    const pre_authorized_contracts = await transfer_manager.get_authorized_contracts()
    assert(pre_authorized_contracts.length == 0)
    await transfer_manager.authorize_contract(feeless_sales.get_address(), { as: alice });
    await transfer_manager.authorize_contract(sales_storage.get_address(), { as: alice });
    const post_authorized_contracts = await transfer_manager.get_authorized_contracts()
    assert(post_authorized_contracts.length == 2)
    assert(post_authorized_contracts.find(a => a.equals(feeless_sales.get_address())) != undefined)
    assert(post_authorized_contracts.find(a => a.equals(sales_storage.get_address())) != undefined)
  });
});

describe('Setter tests', async () => {
  it('Set sales contract as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await sales_storage.set_sales_contract(feeless_sales.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set transfer manager as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await sales_storage.set_transfer_manager(transfer_manager.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set Sales storage contract as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await feeless_sales.set_sales_storage(sales_storage.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set protocol fee as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await feeless_sales.set_protocol_fee(new Nat(fee), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set fee receiver as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await transfer_manager.set_default_fee_receiver(daniel.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set royalties provider as non admin should fail', async () => {
    await expect_to_fail(async () => {
      await transfer_manager.set_royalties_provider(royalties.get_address(), { as: bob });
    }, transfer_manager.errors.INVALID_CALLER);
  });

  it('Set sales contract as admin should succeed', async () => {
    const pre_sales_contract = await sales_storage.get_sales_contract()
    assert(pre_sales_contract.is_none())
    await sales_storage.set_sales_contract(feeless_sales.get_address(), { as: alice });
    const post_sales_contract = await sales_storage.get_sales_contract()
    assert(post_sales_contract.equals(Option.Some(feeless_sales.get_address())))
  });

  it('Set transfer manager contract as admin should succeed', async () => {
    const pre_transfer_manager_contract = await sales_storage.get_transfer_manager()
    assert(pre_transfer_manager_contract.is_none())
    await sales_storage.set_transfer_manager(transfer_manager.get_address(), { as: alice });
    const post_transfer_manager_contract = await sales_storage.get_transfer_manager()
    assert(post_transfer_manager_contract.equals(Option.Some(transfer_manager.get_address())))
  });

  it('Set Sales storage contract as admin should succeed', async () => {
    const pre_sales_storage = await feeless_sales.get_sales_storage();
    assert(pre_sales_storage.equals(royalties.get_address()));
    await feeless_sales.set_sales_storage(sales_storage.get_address(), { as: alice });
    const post_sales_storage = await feeless_sales.get_sales_storage();
    assert(post_sales_storage.equals(sales_storage.get_address()));
  });

  it('Set protocol fee as admin should succeed', async () => {
    const pre_protocol_fee = await feeless_sales.get_protocol_fee();
    assert(pre_protocol_fee.equals(new Nat(99)));
    await feeless_sales.set_protocol_fee(new Nat(fee), { as: alice });
    const post_protocol_fee = await feeless_sales.get_protocol_fee();
    assert(post_protocol_fee.equals(new Nat(fee)));
  });

  it('Set fee receiver as admin should succeed', async () => {
    const pre_fee_receiver = await transfer_manager.get_default_fee_receiver();
    assert(pre_fee_receiver.equals(bob.get_address()));
    await transfer_manager.set_default_fee_receiver(daniel.get_address(), { as: alice });
    const post_fee_receiver = await transfer_manager.get_default_fee_receiver();
    assert(post_fee_receiver.equals(daniel.get_address()));
  });

  it('Set royalties provider as admin should succeed', async () => {
    const pre_royalties_provider = await transfer_manager.get_royalties_provider();
    assert(pre_royalties_provider.equals(bob.get_address()));
    await transfer_manager.set_royalties_provider(royalties.get_address(), { as: alice });
    const post_royalties_provider = await transfer_manager.get_royalties_provider();
    assert(post_royalties_provider.equals(royalties.get_address()));
  });
});
