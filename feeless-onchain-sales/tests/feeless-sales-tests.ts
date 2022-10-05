import {
	Account,
	exec_batch,
	expect_to_fail,
	get_account, get_balance, is_mockup,
	pack,
	set_mockup,
	set_mockup_now,
	set_quiet, sign
} from '@completium/experiment-ts'

import {Fa12, ledger_key as ledger_key_fa12} from './binding/fa12';
import {Royalties} from "./binding/royalties";
import {
	asset_type,
	FA12,
	FA12_asset_mich_type,
	FA2,
	FA2_asset,
	FA2_asset_mich_type,
	Feeless_sales,
	sale,
	sale_mich_type,
	XTZ,
	part as sales_part,
	sale_arg,
	sale_arg_mich_type,
	cancel_sale_param,
	cancel_sale_param_mich_type
} from "./binding/feeless_sales";
import {sales_key, Sales_storage} from "./binding/sales_storage";
import {transfer_manager, Transfer_manager} from "./binding/transfer_manager";
import {add, permits, Permits} from "./binding/permits";
import {
	Address,
	Bytes, mich_array_to_mich, Nat,
	pair_array_to_mich_type,
	prim_annot_to_mich_type, string_to_mich, Option, Tez
} from '@completium/archetype-ts-types';
import {add_for_all, Fa2, transfer_destination, transfer_param, ledger_key as ledger_key_fa2, part as royalties_part} from './binding/fa2';
import BigNumber from "bignumber.js";
const assert = require('assert');

/* Contracts */
const permits_contract = new Permits();
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
const eddy = get_account('eddy');

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Now --------------------------------------------------------------------- */

const now = new Date(Date.now())
set_mockup_now(now)

/* Constants ------------------------------------------------------- */
const initial_ft_amount = 100000000;
const initial_nft_amount = 100;
const fee = 250;
const payout_value = 100;
const max_fees = 10000;
let sale_amount = 1000000;
const qty = 1;

/* Utils --------------------------------------------------------------- */

const permit_data_type = pair_array_to_mich_type([
	pair_array_to_mich_type([
		prim_annot_to_mich_type("address", []),
		prim_annot_to_mich_type("chain_id", [])
	]),
	pair_array_to_mich_type([
		prim_annot_to_mich_type("nat", []),
		prim_annot_to_mich_type("bytes", [])
	])
])

const get_permit_data = (ptps: Bytes, contract: Address, permit_counter: Nat | undefined): Bytes => {
	let counter = new Nat(0)
	if (permit_counter != undefined) {
		counter = permit_counter
	}
	const chain_id = is_mockup() ? 'NetXynUjJNZm7wi' : 'NetXq4AxoF7BoxJ';
	const permit_data = mich_array_to_mich([
		mich_array_to_mich([contract.to_mich(), string_to_mich(chain_id)]),
		mich_array_to_mich([counter.to_mich(), ptps.to_mich()])
	])
	return pack(permit_data, permit_data_type);
}

async function get_permit_counter(owner: Account) {
	const permit = await permits_contract.get_permits_value(owner.get_address())
	return permit?.counter
}

async function get_balance_wrapper(type: asset_type, user: Address, asset_contract?: Fa2 | Fa12, asset_token_id?: Nat): Promise<Nat> {
	if(type.type() == new FA2().type()){
		const balance = await (asset_contract as Fa2)?.get_ledger_value(new ledger_key_fa2(user, asset_token_id!))
		if (balance == undefined){
			return new Nat(0)
		} else {
			return balance
		}
	} else if (type.type() == new FA12().type()){
		const fa12_contract: Fa12 = asset_contract! as Fa12;
		const balance = await fa12_contract.get_ledger_value(user as ledger_key_fa12)
		if (balance == undefined){
			return new Nat(0)
		} else {
			return balance
		}
	} else{
		const balance = await get_balance(user)
		return new Nat(balance.to_big_number().toNumber())
	}
}

async function submit_and_verify_cancel_order(
	nft_token_id: Nat,
	owner: Account,
	asset_type: asset_type,
	sender: Account,
	sale_asset_contract?: Fa2 | Fa12,
	sale_asset_token_id?: Nat,
) {
	const counter = await get_permit_counter(owner)
	const is_fa2 = sale_asset_contract && sale_asset_token_id
	const is_fa12 = sale_asset_contract && !sale_asset_token_id
	const sale_asset = is_fa2 ? pack(new FA2_asset(sale_asset_contract.get_address(),
			nft_token_id).to_mich(),
		FA2_asset_mich_type) : is_fa12 ? pack(sale_asset_contract.get_address().to_mich(),
		FA12_asset_mich_type) : new Bytes("")
	const cancel_data = new cancel_sale_param(fa2_nft_contract.get_address(), nft_token_id, asset_type, sale_asset, owner.get_address())
	const packed_sales_data = pack(cancel_data.to_mich(), cancel_sale_param_mich_type)
	const after_permit_data = await get_permit_data(
		packed_sales_data,
		permits_contract.get_address(),
		counter);
	const signature = await sign(after_permit_data, owner)
	await feeless_sales_contract.cancel_sale(cancel_data, owner.get_public_key(), signature, {as: sender})
}

async function sumbit_and_verify_sale_order(
	nft_token_id: Nat,
	owner: Account,
	sale_order_amount: Nat,
	sale_order_qty: Nat,
	sale_max_fees: Nat,
	asset_type: asset_type,
	sale_start: Option<Date>,
	sale_end: Option<Date>,
	origin_fees: sales_part[],
	payouts: sales_part[],
	sale_asset_contract?: Fa2 | Fa12,
	sale_asset_token_id?: Nat,
) {
	const counter = await get_permit_counter(owner)
	const is_fa2 = sale_asset_contract && sale_asset_token_id
	const is_fa12 = sale_asset_contract && !sale_asset_token_id
	const sale_asset = is_fa2 ? pack(new FA2_asset(sale_asset_contract.get_address(),
			nft_token_id).to_mich(),
		FA2_asset_mich_type) : is_fa12 ? pack(sale_asset_contract.get_address().to_mich(),
		FA12_asset_mich_type) : new Bytes("")
	const sale_key = new sales_key(fa2_nft_contract.get_address(),
		nft_token_id,
		owner.get_address(),
		asset_type,
		sale_asset)
	const sale_data = new sale_arg(fa2_nft_contract.get_address(),
		nft_token_id,
		owner.get_address(),
		asset_type,
		sale_asset,
		origin_fees,
		payouts,
		sale_order_amount,
		sale_order_qty,
		sale_start,
		sale_end,
		sale_max_fees,
		Option.None(),
		Option.None())
	const packed_sales_data = pack(sale_data.to_mich(), sale_arg_mich_type)
	const after_permit_data = await get_permit_data(
		packed_sales_data,
		permits_contract.get_address(),
		counter);
	const signature = await sign(after_permit_data, owner)
	await feeless_sales_contract.sell(sale_data, owner.get_public_key(), signature, {as: daniel})
	const post_sale = await sales_storage_contract.get_sales_value(sale_key)
	assert(post_sale != undefined)
	assert(post_sale?.sale_amount.equals(sale_order_amount))
	assert(post_sale?.sale_asset_qty.equals(sale_order_qty))
	assert(post_sale?.sale_start.equals(sale_start))
	assert(post_sale?.sale_end.equals(sale_end))
	assert(post_sale?.sale_origin_fees.length == origin_fees.length)
	assert(post_sale?.sale_payouts.length == payouts.length)
	for (let i = 0; i < origin_fees.length - 1; i++) {
		assert(post_sale?.sale_origin_fees[i].part_account.equals(origin_fees[0].part_account))
		assert(post_sale?.sale_origin_fees[i].part_value.equals(origin_fees[0].part_value))
	}
	for (let i = 0; i < origin_fees.length - 1; i++) {
		assert(post_sale?.sale_payouts[i].part_account.equals(payouts[0].part_account))
		assert(post_sale?.sale_payouts[i].part_value.equals(payouts[0].part_value))
	}
}

async function sumbit_and_verify_buy_order(
	nft_token_id: Nat,
	owner: Account,
	buyer: Account,
	sale_order_qty: Nat,
	asset_type: asset_type,
	origin_fees: sales_part[],
	payouts: sales_part[],
	sale_asset_contract?: Fa2 | Fa12,
	sale_asset_token_id?: Nat,
) {
	const is_fa2 = asset_type.type() == new FA2().type()
	const is_fa12 = asset_type.type() == new FA12().type()

	const pre_custody_ft_balance = await get_balance_wrapper(asset_type, sales_storage_contract.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_sales_ft_balance = await get_balance_wrapper(asset_type, feeless_sales_contract.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_alice_ft_balance = await get_balance_wrapper(asset_type, alice.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_bob_ft_balance = await get_balance_wrapper(asset_type, bob.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_carl_ft_balance = await get_balance_wrapper(asset_type, carl.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_daniel_ft_balance = await get_balance_wrapper(asset_type, daniel.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_eddy_ft_balance = await get_balance_wrapper(asset_type, eddy.get_address(), sale_asset_contract, sale_asset_token_id)
	const pre_custody_nft_balance = await get_balance_wrapper(asset_type, sales_storage_contract.get_address(), sale_asset_contract, nft_token_id)
	const pre_alice_nft_balance = await get_balance_wrapper(new FA2(), alice.get_address(), fa2_nft_contract, nft_token_id)
	const pre_bob_nft_balance = await get_balance_wrapper(new FA2(), bob.get_address(), fa2_nft_contract, nft_token_id)
	const pre_sales_nft_balance = await get_balance_wrapper(new FA2(), feeless_sales_contract.get_address(), fa2_nft_contract, nft_token_id)

	const sale_asset = is_fa2 ? pack(new FA2_asset(sale_asset_contract!.get_address(),
			nft_token_id).to_mich(),
		FA2_asset_mich_type) : is_fa12 ? pack(sale_asset_contract!.get_address().to_mich(),
		FA12_asset_mich_type) : new Bytes("")

	const sale_key = new sales_key(fa2_nft_contract.get_address(),
		nft_token_id,
		owner.get_address(),
		asset_type,
		sale_asset)

	// const sale_record = await sales_storage_contract.get_sales_value(sale_key)
	// assert(sale_record != undefined)

	await feeless_sales_contract.buy(fa2_nft_contract.get_address(), nft_token_id, owner.get_address(), asset_type, sale_asset, sale_order_qty, origin_fees, payouts, {as: buyer, amount : (!is_fa12 && !is_fa2 ? new Tez(sale_amount, "mutez") : new Tez(0)) })

	const post_sale = await sales_storage_contract.get_sales_value(sale_key)
	assert(post_sale == undefined)

	let royalties_factor: Nat = new Nat(0)
	let fees_factor: Nat = new Nat(0)

	const royalties = new Nat(sale_amount * (payout_value / 10000));
	const fee_value = new Nat(sale_amount * (payout_value / 10000));

	const protocol_fees = new Nat(sale_amount * (fee / 10000));
	let rest: Nat = new Nat(new Nat(sale_amount).minus(protocol_fees).to_big_number());

	if (nft_token_id.equals(new Nat(1)) || nft_token_id.equals(new Nat(4)) || nft_token_id.equals(new Nat(7))){
		royalties_factor = new Nat(1)
		fees_factor = new Nat(2)
	}

	if (nft_token_id.equals(new Nat(2)) || nft_token_id.equals(new Nat(5)) || nft_token_id.equals(new Nat(8))){
		royalties_factor = new Nat(2)
		fees_factor = new Nat(4)
	}

	rest = new Nat(
		rest
		.minus(royalties_factor.times(royalties)).to_big_number()
		.minus(fees_factor.to_big_number().times(fee_value.to_big_number()))
	)

	const payout = new Nat(
		rest.to_big_number()
			.times(new BigNumber(payout_value).div(10000)));

	const post_custody_ft_balance = await get_balance_wrapper(asset_type, sales_storage_contract.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_sales_ft_balance = await get_balance_wrapper(asset_type, feeless_sales_contract.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_alice_ft_balance = await get_balance_wrapper(asset_type, alice.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_bob_ft_balance = await get_balance_wrapper(asset_type, bob.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_carl_ft_balance = await get_balance_wrapper(asset_type, carl.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_daniel_ft_balance = await get_balance_wrapper(asset_type, daniel.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_eddy_ft_balance = await get_balance_wrapper(asset_type, eddy.get_address(), sale_asset_contract, sale_asset_token_id)
	const post_custody_nft_balance = await get_balance_wrapper(asset_type, sales_storage_contract.get_address(), sale_asset_contract, nft_token_id)
	const post_sales_nft_balance = await get_balance_wrapper(new FA2(), feeless_sales_contract.get_address(), fa2_nft_contract, nft_token_id)
	const post_alice_nft_balance = await get_balance_wrapper(new FA2(), alice.get_address(), fa2_nft_contract, nft_token_id)
	const post_bob_nft_balance = await get_balance_wrapper(new FA2(), bob.get_address(), fa2_nft_contract, nft_token_id)

	assert(post_custody_ft_balance.equals(new Nat(0)) && post_custody_ft_balance.equals(pre_custody_ft_balance));
	assert(post_sales_ft_balance.equals(new Nat(0)) && post_sales_ft_balance.equals(pre_sales_ft_balance));
	assert(post_alice_ft_balance.equals(new Nat(
		pre_alice_ft_balance
			.plus(rest)
			.minus(fees_factor.times(payout))
			.to_big_number())
	));
	if(asset_type.type() == new XTZ().type()){
		assert(post_bob_ft_balance.to_big_number().isLessThanOrEqualTo((
			pre_bob_ft_balance
				.minus(new Nat(sale_amount)).to_big_number())));
	} else {
		assert(post_bob_ft_balance.equals(new Nat(
			pre_bob_ft_balance
				.minus(new Nat(sale_amount)).to_big_number())));
	}

	assert(post_carl_ft_balance.equals(
		pre_carl_ft_balance
			.plus(royalties_factor.times(royalties))
	));
	assert(post_daniel_ft_balance.equals(
		pre_daniel_ft_balance
			.plus(protocol_fees)
	));
	assert(post_eddy_ft_balance.equals(
		pre_eddy_ft_balance
			.plus(fees_factor.times(fee_value))
			.plus(fees_factor.times(payout))
	));
	assert(post_custody_nft_balance.equals(new Nat(0)) && post_custody_nft_balance.equals(pre_custody_nft_balance));
	assert(post_sales_nft_balance.equals(new Nat(0)) && post_sales_nft_balance.equals(pre_sales_nft_balance));
	assert(post_alice_nft_balance.equals(new Nat(pre_alice_nft_balance.minus(new Nat(qty)).to_big_number())));
	assert(post_bob_nft_balance.equals(pre_bob_nft_balance.plus(new Nat(qty))));
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
	it('Permits contract deployment should succeed', async () => {
		await permits_contract.deploy(alice.get_address(), {as: alice})
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
			royalties_contract.get_address(),
			{as: alice})
	});
});

describe('Permits contract configuration', async () => {
	it("Add Feeless sales contract as permit consumer as non admin should fail", async () => {
		await expect_to_fail(async () => {
			await permits_contract.manage_consumer(new add(feeless_sales_contract.get_address()), {as: bob})
		}, transfer_manager.errors.INVALID_CALLER);
	})

	it('Add Feeless sales contract as permit consumer as admin should succeed', async () => {
		const pre_consumer = await permits_contract.get_consumer();
		assert(pre_consumer.find(a => a.equals(feeless_sales_contract.get_address())) == undefined);
		await permits_contract.manage_consumer(new add(feeless_sales_contract.get_address()), {as: alice})
		const post_consumer = await permits_contract.get_consumer();
		assert(post_consumer.find(a => a.equals(feeless_sales_contract.get_address()))
			?.equals(feeless_sales_contract.get_address()));
	});
})

describe('Transfer manager contract configuration', async () => {
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
		}, sales_storage_contract.errors.INVALID_CALLER);
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_transfer_manager(transfer_manager_contract.get_address(), {as: bob});
		}, feeless_sales_contract.errors.INVALID_CALLER);
	});

	it('Set Sales storage contract as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_sales_storage(sales_storage_contract.get_address(), {as: bob});
		}, feeless_sales_contract.errors.INVALID_CALLER);
	});

	it('Set protocol fee as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_protocol_fee(new Nat(fee), {as: bob});
		}, feeless_sales_contract.errors.INVALID_CALLER);
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

	it('Set permits as non admin should fail', async () => {
		await expect_to_fail(async () => {
			await feeless_sales_contract.set_permits(permits_contract.get_address(), {as: bob});
		}, transfer_manager.errors.INVALID_CALLER);
	});

	it('Set sales contract as admin should succeed', async () => {
		const pre_sales_contract = await sales_storage_contract.get_sales_contract()
		assert(pre_sales_contract.is_none())
		await sales_storage_contract.set_sales_contract(feeless_sales_contract.get_address(), {as: alice});
		const post_sales_contract = await sales_storage_contract.get_sales_contract()
		assert(post_sales_contract.equals(Option.Some(feeless_sales_contract.get_address())))
	});

	it('Set transfer manager contract (feelesss sales) as admin should succeed', async () => {
		const pre_transfer_manager_contract = await feeless_sales_contract.get_transfer_manager()
		assert(pre_transfer_manager_contract.equals(royalties_contract.get_address()))
		await feeless_sales_contract.set_transfer_manager(transfer_manager_contract.get_address(), {as: alice});
		const post_transfer_manager_contract = await feeless_sales_contract.get_transfer_manager()
		assert(post_transfer_manager_contract.equals(transfer_manager_contract.get_address()))
	});

	it('Set transfer manager contract (sales storage) as admin should succeed', async () => {
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

	it('Set permits as admin should succeed', async () => {
		const pre_permits = await feeless_sales_contract.get_permits();
		assert(pre_permits.equals(royalties_contract.get_address()));
		await feeless_sales_contract.set_permits(permits_contract.get_address(), {as: alice});
		const post_permits = await feeless_sales_contract.get_permits();
		assert(post_permits.equals(permits_contract.get_address()));
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
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(1),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(2),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(3),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(4),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(5),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(6),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(7),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(8),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_ft_contract.get_mint_param(alice.get_address(),
				new Nat(9),
				new Nat(initial_ft_amount),
				[],
				[],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(0),
				new Nat(initial_nft_amount),
				[],
				[],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(1),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(2),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value)), new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(3),
				new Nat(initial_nft_amount),
				[],
				[],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(4),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(5),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value)), new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(6),
				new Nat(initial_nft_amount),
				[],
				[],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(7),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(8),
				new Nat(initial_nft_amount),
				[],
				[new royalties_part(carl.get_address(), new Nat(payout_value)), new royalties_part(carl.get_address(), new Nat(payout_value))],
				{as: alice}),
			await fa2_nft_contract.get_mint_param(alice.get_address(),
				new Nat(9),
				new Nat(initial_nft_amount),
				[],
				[],
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
				await sumbit_and_verify_sale_order(new Nat(0),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA2(),
					Option.None(),
					Option.None(),
					[],
					[],
					fa2_ft_contract,
					new Nat(0))
			});
		it('Set sale buying with Fungible FA2 should succeed (single royalties, single sale payouts, single sale origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(1),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA2(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value))],
					fa2_ft_contract,
					new Nat(1))
			});
		it('Set sale buying with Fungible FA2 should succeed (multiple royalties, multiple payouts, multiple origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(2),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA2(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa2_ft_contract,
					new Nat(2))
			});
	});

	describe('Set feeless sale in XTZ', async () => {
		it('Set sale buying with XTZ should succeed (no royalties, no payouts, no origin fees)', async () => {
			await sumbit_and_verify_sale_order(new Nat(3),
				alice,
				new Nat(sale_amount),
				new Nat(qty),
				new Nat(max_fees),
				new XTZ(),
				Option.None(),
				Option.None(),
				[],
				[])
		});

		it('Set sale buying with XTZ should succeed (single royalties, single payouts, single origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(4),
					alice,
					new Nat(sale_amount),
					new Nat(qty),
					new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value))])
			});

		it('Set sale buying with XTZ should succeed (multiple royalties, multiple payouts, multiple origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(5),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))])
			});
	});

	describe('Set feeless sale in FA12', async () => {
		it('Set sale buying with FA12 should succeed (no royalties, no payouts, no origin fees)', async () => {
			await sumbit_and_verify_sale_order(new Nat(6),
				alice,
				new Nat(sale_amount),
				new Nat(qty),
				new Nat(max_fees),
				new FA12(),
				Option.None(),
				Option.None(),
				[],
				[],
				fa12_ft_0_contract)
		});

		it('Set sale buying with FA12 should succeed (single royalties, single payouts, single origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(7),
					alice,
					new Nat(sale_amount),
					new Nat(qty),
					new Nat(max_fees),
					new FA12(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value))],
					fa12_ft_1_contract)
			});

		it('Set sale buying with FA12 should succeed (multiple royalties, multiple payouts, multiple origin fees)',
			async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA12(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_2_contract)
			});
	});

	describe('Common args test', async () => {
		it('Set sale with wrong buy asset payload (FA2) should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA2(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_2_contract)
			}, feeless_sales_contract.errors.CANT_UNPACK_FA2_ASSET);
		});

		it('Set sale with wrong buy asset payload (FA12) should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new FA12(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],)
			}, feeless_sales_contract.errors.CANT_UNPACK_FA12_ASSET);
		});

		it('Set sale with wrong buy asset payload (XTZ) should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.WRONG_XTZ_PAYLOAD);
		});

		it('Set sale with NFT amount = 0 should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(0), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s1);
		});

		it('Set sale with sale amount = 0 should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(0), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s0);
		});

		it('Set sale with end date < now should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.Some(new Date(now.getMilliseconds() - 1000)),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.INVALID_SALE_END_DATE);
		});

		it('Set sale with end date < start date should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice,
					new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.Some(new Date(now.getMilliseconds() + 2000)),
					Option.Some(new Date(now.getMilliseconds() + 1000)),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.INVALID_SALE_END_DATE);
		});

		it('Set sale with max fees amount = 0 should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(0),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s2);
		});

		it('Set sale with max fees > max limit should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(99999999),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s2);
		});

		it('Set sale with max fees amount < protocol fees should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(150),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s2);
		});

		it('Set sale with protocol fees + origin fees > max fees amount should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_sale_order(new Nat(8),
					alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[new sales_part(eddy.get_address(), new Nat(10000)), new sales_part(eddy.get_address(),
						new Nat(10000))],
					[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(),
						new Nat(payout_value))],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.r_s2);
		});

		it('Set sale with bad signature should fail', async () => {
			try {
				const owner = alice
				const sale_asset_contract = fa2_ft_contract
				const sale_asset_token_id = new Nat(9)
				const asset_type = new FA2()
				const nft_token_id = new Nat(9)
				const origin_fees: sales_part[] = []
				const payouts: sales_part[] = []

				const permit = await permits_contract.get_permits_value(owner.get_address())
				const counter = permit?.counter
				const is_fa2 = sale_asset_contract && sale_asset_token_id
				const is_fa12 = sale_asset_contract && !sale_asset_token_id
				const sale_asset = is_fa2 ? pack(new FA2_asset(sale_asset_contract.get_address(),
						new Nat(1)).to_mich(),
					FA2_asset_mich_type) : is_fa12 ? pack(sale_asset_contract.get_address().to_mich(),
					FA12_asset_mich_type) : new Bytes("")
				const sale_data = new sale_arg(fa2_nft_contract.get_address(),
					nft_token_id,
					owner.get_address(),
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
				const packed_sales_data = pack(sale_data.to_mich(), sale_arg_mich_type)
				const after_permit_data = await get_permit_data(
					packed_sales_data,
					permits_contract.get_address(),
					counter);
				const signature = await sign(after_permit_data, owner)
				sale_data.sale_arg_asset_token_id = new Nat(0)
				await feeless_sales_contract.sell(sale_data, owner.get_public_key(), signature, {as: owner})
			} catch (e: any) {
				assert(e.value.includes("MISSIGNED"))
			}
		});
		it('Set sale buying with a sale that already exists should update the previous order and succeed', async () => {
			await sumbit_and_verify_sale_order(new Nat(9),
				alice, new Nat(sale_amount), new Nat(qty), new Nat(max_fees),
				new FA12(),
				Option.None(),
				Option.None(),
				[new sales_part(carl.get_address(), new Nat(payout_value)), new sales_part(daniel.get_address(),
					new Nat(payout_value))],
				[new sales_part(carl.get_address(), new Nat(payout_value)), new sales_part(daniel.get_address(),
					new Nat(payout_value))],
				fa12_ft_1_contract)
			await sumbit_and_verify_sale_order(new Nat(9),
				alice, new Nat(sale_amount), new Nat(qty*2), new Nat(max_fees),
				new FA12(),
				Option.None(),
				Option.None(),
				[new sales_part(carl.get_address(), new Nat(payout_value)), new sales_part(daniel.get_address(),
					new Nat(payout_value))],
				[new sales_part(carl.get_address(), new Nat(payout_value)), new sales_part(daniel.get_address(),
					new Nat(payout_value))],
				fa12_ft_1_contract)
		});

	});
});

describe('Buy tests', async () => {
	describe('Buy with Fungible FA2 sales tests', async () => {
		it('Buy with Fungible FA2 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(0),
				alice,
				bob,
				new Nat(qty),
				new FA2(),
				[],
				[],
				fa2_ft_contract,
				new Nat(0))
		});

		it('Buy with Fungible FA2 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(1),
				alice,
				bob,
				new Nat(qty),
				new FA2(),
				[new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value))],
				fa2_ft_contract,
				new Nat(1))
		});

		it('Buy with Fungible FA2 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(2),
				alice,
				bob,
				new Nat(qty),
				new FA2(),
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))],
				fa2_ft_contract,
				new Nat(2))
		});
	});

	describe('Buy with Fungible XTZ sales tests', async () => {
		it('Buy with XTZ sales (no royalties, no origin fees, no payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(3),
				alice,
				bob,
				new Nat(qty),
				new XTZ(),
				[],
				[])
		});

		it('Buy with XTZ sales (single royalties, single origin fees, single payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(4),
				alice,
				bob,
				new Nat(qty),
				new XTZ(),
				[new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value))])
		});

		it('Buy with XTZ sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(5),
				alice,
				bob,
				new Nat(qty),
				new XTZ(),
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))])
		});
	});

	describe('Buy with Fungible FA12 sales tests', async () => {
		it('Buy with Fungible FA12 sales (no royalties, no origin fees, no payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(6),
				alice,
				bob,
				new Nat(qty),
				new FA12(),
				[],
				[],
				fa12_ft_0_contract)
		});

		it('Buy with Fungible FA12 sales (single royalties, single origin fees, single payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(7),
				alice,
				bob,
				new Nat(qty),
				new FA12(),
				[new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value))],
				fa12_ft_1_contract)
		});

		it('Buy with Fungible FA12 sales (multiple royalties, multiple origin fees, multiple payouts) should succeed', async () => {
			await sumbit_and_verify_buy_order(
				new Nat(8),
				alice,
				bob,
				new Nat(qty),
				new FA12(),
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))],
				[new sales_part(eddy.get_address(), new Nat(payout_value)), new sales_part(eddy.get_address(), new Nat(payout_value))],
				fa12_ft_2_contract)
		});
	});

	describe('Common buy tests', async () => {
		it('Buy a non existing sale should fail', async () => {
			await expect_to_fail(async () => {
				await sumbit_and_verify_buy_order(
					new Nat(999),
					alice,
					bob,
					new Nat(qty),
					new FA12(),
					[],
					[],
					fa12_ft_0_contract)
			}, feeless_sales_contract.errors.MISSING_SALE);
		});

		it('Buy with XTZ and wrong amount should fail', async () => {
			try{
				const token_id = 99

				await sumbit_and_verify_sale_order(new Nat(token_id),
					alice,
					new Nat(sale_amount),
					new Nat(qty),
					new Nat(max_fees),
					new XTZ(),
					Option.None(),
					Option.None(),
					[],
					[])
				const sale_asset = new Bytes("")

				const sale_key = new sales_key(fa2_nft_contract.get_address(),
					new Nat(token_id),
					alice.get_address(),
					new XTZ(),
					sale_asset)

				const sale_record = await sales_storage_contract.get_sales_value(sale_key)
				assert(sale_record != undefined)

				await feeless_sales_contract.buy(fa2_nft_contract.get_address(), new Nat(token_id), alice.get_address(), new XTZ(), sale_asset, new Nat(qty), [], [], {as: bob, amount : new Tez(0)})
			} catch (e: any) {
				assert(e.value.includes("AMOUNT_MISMATCH"))
			}
		});

		it('Buy with good start date and end date should succeed', async () => {
			const token_id = 9
			set_mockup_now(now)
			const start_date = new Date(now.getTime() + 1000);
			const end_date = new Date(now.getTime() + 3000);

			await sumbit_and_verify_sale_order(new Nat(token_id),
				alice,
				new Nat(sale_amount),
				new Nat(qty),
				new Nat(max_fees),
				new XTZ(),
				Option.Some(start_date),
				Option.Some(end_date),
				[],
				[])
			set_mockup_now(new Date(now.getTime() + 2000))
			await sumbit_and_verify_buy_order(
				new Nat(token_id),
				alice,
				bob,
				new Nat(qty),
				new XTZ(),
				[],
				[])
			set_mockup_now(now)
		});

		it('Buy with before start date should fail', async () => {
			await expect_to_fail(async () => {
				const token_id = 9
				set_mockup_now(now)
				const start_date = new Date(now.getTime() + 1000);
				const end_date = new Date(now.getTime() + 3000);

				await sumbit_and_verify_sale_order(new Nat(token_id),
					alice,
					new Nat(sale_amount),
					new Nat(qty),
					new Nat(max_fees),
					new XTZ(),
					Option.Some(start_date),
					Option.Some(end_date),
					[],
					[])
				set_mockup_now(new Date(start_date.getTime() - 2000))
				await sumbit_and_verify_buy_order(
					new Nat(token_id),
					alice,
					bob,
					new Nat(qty),
					new XTZ(),
					[],
					[])
				set_mockup_now(now)
			}, feeless_sales_contract.errors.SALE_NOT_STARTED);
		});

		it('Buy with after end date should fail', async () => {
			await expect_to_fail(async () => {
				const token_id = 9
				const end_date = new Date(now.getTime() + 3000);
				set_mockup_now(new Date(end_date.getTime() + 2000))
				await sumbit_and_verify_buy_order(
					new Nat(token_id),
					alice,
					bob,
					new Nat(qty),
					new XTZ(),
					[],
					[])
				set_mockup_now(now)
			}, feeless_sales_contract.errors.SALE_CLOSED);
		});
	});
});

describe('Cancel tests', async () => {
	it('Cancel a non existing sale should fail', async () => {
		await expect_to_fail(async () => {
			await submit_and_verify_cancel_order(new Nat(1111), bob, new XTZ(), daniel)
		}, feeless_sales_contract.errors.r_cs1);
	});

	it('Cancel a sale with invalid signature should fail', async () => {
		try {
			const counter = await get_permit_counter(bob)
			const sale_asset = new Bytes("")
			const cancel_data = new cancel_sale_param(fa2_nft_contract.get_address(), new Nat(999), new XTZ(), sale_asset, alice.get_address())
			const packed_sales_data = pack(cancel_data.to_mich(), cancel_sale_param_mich_type)
			const after_permit_data = await get_permit_data(
				packed_sales_data,
				permits_contract.get_address(),
				counter);
			const signature = await sign(after_permit_data, alice)
			feeless_sales_contract.cancel_sale(cancel_data, alice.get_public_key(), signature, {as: bob})
		} catch (e: any) {
				assert(e.value.includes("MISSIGNED"))
			}
	});

	it('Cancel a valid existing sale with a good signature should succeed', async () => {
		await submit_and_verify_cancel_order(new Nat(9), alice, new XTZ(), daniel)
	});
});