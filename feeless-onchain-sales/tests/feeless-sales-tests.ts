import {
	Address, Bytes,
	exec_batch,
	expect_to_fail,
	get_account,
	Nat,
	Option,
	pack,
	set_mockup,
	set_mockup_now,
	set_quiet, sign
} from '@completium/experiment-ts'

import {Fa12, fa12} from './binding/fa12';
import {
	add_for_all,
	Fa2,
	transfer_destination,
	transfer_param
} from "./binding/fa2";
import {Royalties} from "./binding/royalties";
import {
	asset_type, FA12_asset, FA12_asset_mich_type,
	FA2,
	FA2_asset,
	FA2_asset_mich_type,
	Feeless_sales, part,
	sale,
	sale_mich_type
} from "./binding/feeless_sales";
import {sales_key, Sales_storage} from "./binding/sales_storage";
import {transfer_manager, Transfer_manager} from "./binding/transfer_manager";
import * as ex from "@completium/experiment-ts";

const assert = require('assert');

/* Contracts */
const sales_storage_contract = new Sales_storage();
const transfer_manager_contract = new Transfer_manager();
const feeless_sales_contract = new Feeless_sales();
const royalties_contract = new Royalties();
const fa2_nft_contract = new Fa2();
const fa2_ft_contract = new Fa2();
const fa12_ft_0_contract = new Fa12();
const fa12_ft_1_contract = new Fa12();
const fa12_ft_2_contract = new Fa12();
/* Accounts ----------------------------------------------------------------- */

const alice = get_account('alice');
const bob = get_account('bob');
const carl = get_account('carl');
const daniel = get_account('daniel');

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Now --------------------------------------------------------------------- */

const now = new Date(Date.now())
set_mockup_now(now)

/* Constants ------------------------------------------------------- */
const initial_ft_amount = 100000000;
const fee = 250;
const payout_value = 100;
const max_fees = 10000;
const sale_amount = 1000000;
const qty = 1;

/* Sale order --------------------------------------------------------------- */
async function sumbit_and_verify_sale_order(
	nft_token_id: Nat,
	origin_fees: part[],
	payouts: part[],
	asset_type: asset_type,
	sale_asset_contract?: Fa2 | Fa12,
	sale_asset_token_id?: Nat
) {
	const is_fa2 = sale_asset_contract && sale_asset_token_id
	const is_fa12 = sale_asset_contract && !sale_asset_token_id
	const sale_asset = is_fa2 ? pack(new FA2_asset(sale_asset_contract.get_address(),
			new Nat(1)).to_mich(),
		FA2_asset_mich_type) : is_fa12 ? pack(sale_asset_contract.get_address().to_mich(),
		FA12_asset_mich_type) : new Bytes("")
	const sale_key = new sales_key(fa2_nft_contract.get_address(),
		nft_token_id,
		alice.get_address(),
		asset_type,
		sale_asset)
	const pre_sale = await sales_storage_contract.get_sales_value(sale_key)
	assert(pre_sale == undefined)
	const sale_data = new sale(fa2_nft_contract.get_address(),
		nft_token_id,
		alice.get_address(),
		asset_type,
		sale_asset,
		origin_fees,
		payouts,
		new Nat(sale_amount),
		new Nat(qty),
		Option.None(),
		Option.None(),
		new Nat(max_fees),
		Option.None(),
		Option.None())
	const signature = await sign(pack(sale_data.to_mich(), sale_mich_type), alice)
	await feeless_sales_contract.sell(sale_data, alice.get_public_key(), signature, {as: alice})
	const post_sale = await sales_storage_contract.get_sales_value(sale_key)
	assert(post_sale != undefined)
	assert(post_sale?.sale_amount.equals(new Nat(sale_amount)))
	assert(post_sale?.sale_asset_qty.equals(new Nat(qty)))
	assert(post_sale?.sale_origin_fees.length == origin_fees.length)
	assert(post_sale?.sale_payouts.length == payouts.length)
	for(let i = 0; i < origin_fees.length - 1; i++) {
		assert(post_sale?.sale_origin_fees[i].part_account.equals(origin_fees[0].part_account))
		assert(post_sale?.sale_origin_fees[i].part_value.equals(origin_fees[0].part_value))
	}
	for(let i = 0; i < origin_fees.length - 1; i++) {
		assert(post_sale?.sale_payouts[i].part_account.equals(payouts[0].part_account))
		assert(post_sale?.sale_payouts[i].part_value.equals(payouts[0].part_value))
	}
}

/* Scenarios --------------------------------------------------------------- */
describe('Contracts deployment', async () => {
	it('FA1.2 contract deployment should succeed', async () => {
		await fa12_ft_0_contract.deploy(alice.get_address(), new Nat(initial_ft_amount), {as: alice})
		await fa12_ft_1_contract.deploy(alice.get_address(), new Nat(initial_ft_amount), {as: alice})
		await fa12_ft_2_contract.deploy(alice.get_address(), new Nat(initial_ft_amount), {as: alice})
	});
	it('FA2 contract deployment should succeed', async () => {
		await fa2_nft_contract.deploy(alice.get_address(), {as: alice})
		await fa2_ft_contract.deploy(alice.get_address(), {as: alice})
	});
	it('Royalties contract deployment should succeed', async () => {
		await royalties_contract.deploy(alice.get_address(), {as: alice})
	});
	it('Transfer manager contract deployment should succeed', async () => {
		await transfer_manager_contract.deploy(alice.get_address(), bob.get_address(), bob.get_address(), {as: alice})
	});
	it('Sales storage contract deployment should succeed', async () => {
		await sales_storage_contract.deploy(alice.get_address(), {as: alice})
	});
	it('Feeless Sales contract deployment should succeed', async () => {
		await feeless_sales_contract.deploy(alice.get_address(),
			new Nat(99),
			royalties_contract.get_address(),
			royalties_contract.get_address(),
			{as: alice})
	});
});

describe('(Transfer manager)Authorize Sales, and Sales storage contract tests', async () => {
	it('Authorize Sales, and Sales storage contract as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await transfer_manager_contract.authorize_contract(feeless_sales_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Authorize Sales, and Sales storage contract as admin should succeed', async () => {
		const pre_authorized_contracts = await transfer_manager_contract.get_authorized_contracts()
		assert(pre_authorized_contracts.length == 0)
		await transfer_manager_contract.authorize_contract(feeless_sales_contract.get_address(), {as: alice});
		await transfer_manager_contract.authorize_contract(sales_storage_contract.get_address(), {as: alice});
		const post_authorized_contracts = await transfer_manager_contract.get_authorized_contracts()
		assert(post_authorized_contracts.length == 2)
		assert(post_authorized_contracts.find(a => a.equals(feeless_sales_contract.get_address())) != undefined)
		assert(post_authorized_contracts.find(a => a.equals(sales_storage_contract.get_address())) != undefined)
	});
});

describe('Setter tests', async () => {
	it('Set sales contract as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await sales_storage_contract.set_sales_contract(feeless_sales_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set transfer manager as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await sales_storage_contract.set_transfer_manager(transfer_manager_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set Sales storage contract as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_sales_storage(sales_storage_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set protocol fee as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_protocol_fee(new Nat(fee), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set fee receiver as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await transfer_manager_contract.set_default_fee_receiver(daniel.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set royalties provider as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await transfer_manager_contract.set_royalties_provider(royalties_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set sales contract as admin should succeed', async () => {
		const pre_sales_contract = await sales_storage_contract.get_sales_contract()
		assert(pre_sales_contract.is_none())
		await sales_storage_contract.set_sales_contract(feeless_sales_contract.get_address(), {as: alice});
		const post_sales_contract = await sales_storage_contract.get_sales_contract()
		assert(post_sales_contract.equals(Option.Some(feeless_sales_contract.get_address())))
	});

	it('Set transfer manager contract as admin should succeed', async () => {
		const pre_transfer_manager_contract = await sales_storage_contract.get_transfer_manager()
		assert(pre_transfer_manager_contract.is_none())
		await sales_storage_contract.set_transfer_manager(transfer_manager_contract.get_address(), {as: alice});
		const post_transfer_manager_contract = await sales_storage_contract.get_transfer_manager()
		assert(post_transfer_manager_contract.equals(Option.Some(transfer_manager_contract.get_address())))
	});

	it('Set Sales storage contract as admin should succeed', async () => {
		const pre_sales_storage = await feeless_sales_contract.get_sales_storage();
		assert(pre_sales_storage.equals(royalties_contract.get_address()));
		await feeless_sales_contract.set_sales_storage(sales_storage_contract.get_address(), {as: alice});
		const post_sales_storage = await feeless_sales_contract.get_sales_storage();
		assert(post_sales_storage.equals(sales_storage_contract.get_address()));
	});

	it('Set protocol fee as admin should succeed', async () => {
		const pre_protocol_fee = await feeless_sales_contract.get_protocol_fee();
		assert(pre_protocol_fee.equals(new Nat(99)));
		await feeless_sales_contract.set_protocol_fee(new Nat(fee), {as: alice});
		const post_protocol_fee = await feeless_sales_contract.get_protocol_fee();
		assert(post_protocol_fee.equals(new Nat(fee)));
	});

	it('Set fee receiver as admin should succeed', async () => {
		const pre_fee_receiver = await transfer_manager_contract.get_default_fee_receiver();
		assert(pre_fee_receiver.equals(bob.get_address()));
		await transfer_manager_contract.set_default_fee_receiver(daniel.get_address(), {as: alice});
		const post_fee_receiver = await transfer_manager_contract.get_default_fee_receiver();
		assert(post_fee_receiver.equals(daniel.get_address()));
	});

	it('Set royalties provider as admin should succeed', async () => {
		const pre_royalties_provider = await transfer_manager_contract.get_royalties_provider();
		assert(pre_royalties_provider.equals(bob.get_address()));
		await transfer_manager_contract.set_royalties_provider(royalties_contract.get_address(), {as: alice});
		const post_royalties_provider = await transfer_manager_contract.get_royalties_provider();
		assert(post_royalties_provider.equals(royalties_contract.get_address()));
	});
});

describe('Tokens setup', async () => {
	it('FA1.2 tokens setup should succeed', async () => {
		await exec_batch([
			await fa12_ft_0_contract.get_approve_param(alice.get_address(), new Nat(initial_ft_amount), {as: alice}),
			await fa12_ft_0_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa12_ft_1_contract.get_approve_param(alice.get_address(), new Nat(initial_ft_amount), {as: alice}),
			await fa12_ft_1_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa12_ft_2_contract.get_approve_param(alice.get_address(), new Nat(initial_ft_amount), {as: alice}),
			await fa12_ft_2_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa12_ft_0_contract.get_transfer_param(alice.get_address(),
				bob.get_address(),
				new Nat(initial_ft_amount / 2),
				{as: alice}),
			await fa12_ft_1_contract.get_transfer_param(alice.get_address(),
				bob.get_address(),
				new Nat(initial_ft_amount / 2),
				{as: alice}),
			await fa12_ft_2_contract.get_transfer_param(alice.get_address(),
				bob.get_address(),
				new Nat(initial_ft_amount / 2),
				{as: alice})
		], {as: alice})

		await exec_batch([
			await fa12_ft_0_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa12_ft_1_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa12_ft_2_contract.get_approve_param(transfer_manager_contract.get_address(),
				new Nat(initial_ft_amount),
				{as: alice})
		], {as: bob})
	});

	it('FA2 tokens setup should succeed', async () => {
		await exec_batch([
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(0),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(1),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(2),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(3),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(4),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(5),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(6),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(7),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(8),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(9),
				new Nat(initial_ft_amount),
				{as: alice}),
			await fa2_ft_contract.get_transfer_param(
				[
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(0), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(1), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(2), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(3), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(4), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(5), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(6), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(7), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(8), new Nat(initial_ft_amount / 2))]),
					new transfer_param(alice.get_address(),
						[new transfer_destination(bob.get_address(), new Nat(9), new Nat(initial_ft_amount / 2))]),
				],
				{as: alice})
		], {as: alice})
	});

	it('Add transfer manager contract as operator for NFT and FT', async () => {
		await fa2_nft_contract.update_operators_for_all([new add_for_all(transfer_manager_contract.get_address())],
			{as: alice})
		await fa2_ft_contract.update_operators_for_all([new add_for_all(transfer_manager_contract.get_address())],
			{as: alice})
		await fa2_ft_contract.update_operators_for_all([new add_for_all(transfer_manager_contract.get_address())],
			{as: bob})
	});
});

describe('Set feeless sales tests', async () => {
	describe('Set feeless sale in Fungible FA2', async () => {
		it('Set feeless sale buying with Fungible FA2 should succeed (no royalties, no sale payouts, no sale origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(0), [], [], new FA2(), fa2_ft_contract, new Nat(0))
			});
	});

	describe('Set feeless sale in Fungible FA2', async () => {
		it('Set sale buying with Fungible FA2 should succeed (single royalties, single sale payouts, single sale origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(1), [new part(carl.get_address(), new Nat(payout_value))], [new part(daniel.get_address(), new Nat(payout_value))], new FA2(), fa2_ft_contract, new Nat(0))
			});
	});
});