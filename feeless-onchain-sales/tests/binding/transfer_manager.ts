import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export enum asset_type_types {
    XTZ = "XTZ",
    FA12 = "FA12",
    FA2 = "FA2"
}
export abstract class asset_type extends att.Enum<asset_type_types> {
}
export class XTZ extends asset_type {
    constructor() {
        super(asset_type_types.XTZ);
    }
    to_mich() { return new att.Nat(0).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class FA12 extends asset_type {
    constructor() {
        super(asset_type_types.FA12);
    }
    to_mich() { return new att.Nat(1).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class FA2 extends asset_type {
    constructor() {
        super(asset_type_types.FA2);
    }
    to_mich() { return new att.Nat(2).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export const mich_to_asset_type = (m: any): asset_type => {
    const v = (new att.Nat(m)).to_big_number().toNumber();
    switch (v) {
        case 0: return new XTZ();
        case 1: return new FA12();
        case 2: return new FA2();
        default: throw new Error("mich_to_asset_type : invalid value " + v);
    }
};
export class FA2_asset implements att.ArchetypeType {
    constructor(public fa2_asset_contract: att.Address, public fa2_asset_token_id: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.fa2_asset_contract.to_mich(), this.fa2_asset_token_id.to_mich()]);
    }
    equals(v: FA2_asset): boolean {
        return (this.fa2_asset_contract.equals(v.fa2_asset_contract) && this.fa2_asset_contract.equals(v.fa2_asset_contract) && this.fa2_asset_token_id.equals(v.fa2_asset_token_id));
    }
}
export type FA12_asset = att.Address;
export class transfer_param implements att.ArchetypeType {
    constructor(public destination_address: att.Address, public token_id: att.Nat, public token_amount: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.destination_address.to_mich(), att.pair_to_mich([this.token_id.to_mich(), this.token_amount.to_mich()])]);
    }
    equals(v: transfer_param): boolean {
        return (this.destination_address.equals(v.destination_address) && this.destination_address.equals(v.destination_address) && this.token_id.equals(v.token_id) && this.token_amount.equals(v.token_amount));
    }
}
export class process_transfer_param implements att.ArchetypeType {
    constructor(public ptp_asset_type: asset_type, public ptp_asset: att.Bytes, public ptp_amount: att.Nat, public ptp_origin: att.Address, public ptp_destination: att.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.ptp_asset_type.to_mich(), att.pair_to_mich([this.ptp_asset.to_mich(), att.pair_to_mich([this.ptp_amount.to_mich(), att.pair_to_mich([this.ptp_origin.to_mich(), this.ptp_destination.to_mich()])])])]);
    }
    equals(v: process_transfer_param): boolean {
        return (this.ptp_asset_type == v.ptp_asset_type && this.ptp_asset_type == v.ptp_asset_type && this.ptp_asset.equals(v.ptp_asset) && this.ptp_amount.equals(v.ptp_amount) && this.ptp_origin.equals(v.ptp_origin) && this.ptp_destination.equals(v.ptp_destination));
    }
}
export class bundle_item implements att.ArchetypeType {
    constructor(public bundle_item_contract: att.Address, public bundle_item_id: att.Nat, public bundle_item_qty: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.bundle_item_contract.to_mich(), att.pair_to_mich([this.bundle_item_id.to_mich(), this.bundle_item_qty.to_mich()])]);
    }
    equals(v: bundle_item): boolean {
        return (this.bundle_item_contract.equals(v.bundle_item_contract) && this.bundle_item_contract.equals(v.bundle_item_contract) && this.bundle_item_id.equals(v.bundle_item_id) && this.bundle_item_qty.equals(v.bundle_item_qty));
    }
}
export class part implements att.ArchetypeType {
    constructor(public part_account: att.Address, public part_value: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.part_account.to_mich(), this.part_value.to_mich()]);
    }
    equals(v: part): boolean {
        return (this.part_account.equals(v.part_account) && this.part_account.equals(v.part_account) && this.part_value.equals(v.part_value));
    }
}
export class fees implements att.ArchetypeType {
    constructor(public origin_fees: Array<part>, public payouts: Array<part>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.list_to_mich(this.origin_fees, x => {
                return x.to_mich();
            }), att.list_to_mich(this.payouts, x => {
                return x.to_mich();
            })]);
    }
    equals(v: fees): boolean {
        return (JSON.stringify(this.origin_fees) == JSON.stringify(v.origin_fees) && JSON.stringify(this.origin_fees) == JSON.stringify(v.origin_fees) && JSON.stringify(this.payouts) == JSON.stringify(v.payouts));
    }
}
export const FA2_asset_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%fa2_asset_contract"]),
    att.prim_annot_to_mich_type("nat", ["%fa2_asset_token_id"])
], []);
export const FA12_asset_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const transfer_param_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%to"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%token_id"]),
        att.prim_annot_to_mich_type("nat", ["%amount"])
    ], [])
], []);
export const process_transfer_param_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("int", ["%ptp_asset_type"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("bytes", ["%ptp_asset"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("nat", ["%ptp_amount"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("address", ["%ptp_origin"]),
                att.prim_annot_to_mich_type("address", ["%ptp_destination"])
            ], [])
        ], [])
    ], [])
], []);
export const bundle_item_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%bundle_item_contract"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%bundle_item_id"]),
        att.prim_annot_to_mich_type("nat", ["%bundle_item_qty"])
    ], [])
], []);
export const part_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%part_account"]),
    att.prim_annot_to_mich_type("nat", ["%part_value"])
], []);
export const fees_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%part_account"]),
        att.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%origin_fees"]),
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%part_account"]),
        att.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%payouts"])
], []);
export const mich_to_FA2_asset = (v: att.Micheline, collapsed: boolean = false): FA2_asset => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, FA2_asset_mich_type);
    }
    return new FA2_asset(att.mich_to_address(fields[0]), att.mich_to_nat(fields[1]));
};
export const mich_to_FA12_asset = (v: att.Micheline, collapsed: boolean = false): FA12_asset => {
    throw new Error("mich_to_FA12_asset should not be called");
};
export const mich_to_transfer_param = (v: att.Micheline, collapsed: boolean = false): transfer_param => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, transfer_param_mich_type);
    }
    return new transfer_param(att.mich_to_address(fields[0]), att.mich_to_nat(fields[1]), att.mich_to_nat(fields[2]));
};
export const mich_to_process_transfer_param = (v: att.Micheline, collapsed: boolean = false): process_transfer_param => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, process_transfer_param_mich_type);
    }
    return new process_transfer_param(mich_to_asset_type(fields[0]), att.mich_to_bytes(fields[1]), att.mich_to_nat(fields[2]), att.mich_to_address(fields[3]), att.mich_to_address(fields[4]));
};
export const mich_to_bundle_item = (v: att.Micheline, collapsed: boolean = false): bundle_item => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, bundle_item_mich_type);
    }
    return new bundle_item(att.mich_to_address(fields[0]), att.mich_to_nat(fields[1]), att.mich_to_nat(fields[2]));
};
export const mich_to_part = (v: att.Micheline, collapsed: boolean = false): part => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, part_mich_type);
    }
    return new part(att.mich_to_address(fields[0]), att.mich_to_nat(fields[1]));
};
export const mich_to_fees = (v: att.Micheline, collapsed: boolean = false): fees => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, fees_mich_type);
    }
    return new fees(att.mich_to_list(fields[0], x => { return mich_to_part(x, collapsed); }), att.mich_to_list(fields[1], x => { return mich_to_part(x, collapsed); }));
};
const declare_ownership_arg_to_mich = (candidate: att.Address): att.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const set_default_fee_receiver_arg_to_mich = (sfr: att.Address): att.Micheline => {
    return sfr.to_mich();
}
const set_royalties_provider_arg_to_mich = (srp: att.Address): att.Micheline => {
    return srp.to_mich();
}
const set_fee_receiver_arg_to_mich = (token: att.Address, wallet: att.Address): att.Micheline => {
    return att.pair_to_mich([
        token.to_mich(),
        wallet.to_mich()
    ]);
}
const authorize_contract_arg_to_mich = (ac_contract: att.Address): att.Micheline => {
    return ac_contract.to_mich();
}
const revoke_contract_arg_to_mich = (ac_contract: att.Address): att.Micheline => {
    return ac_contract.to_mich();
}
const manage_transfers_arg_to_mich = (mt_bundle: Array<bundle_item>, mt_nft_origin: att.Address, mt_nft_destination: att.Address, mt_ft_amount: att.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: att.Bytes, mt_ft_origin: att.Address, mt_ft_destination: att.Address, mt_rarible_custody: att.Address, mt_protocol_fees: att.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>): att.Micheline => {
    return att.pair_to_mich([
        att.list_to_mich(mt_bundle, x => {
            return x.to_mich();
        }),
        mt_nft_origin.to_mich(),
        mt_nft_destination.to_mich(),
        mt_ft_amount.to_mich(),
        mt_ft_asset_type.to_mich(),
        mt_ft_asset.to_mich(),
        mt_ft_origin.to_mich(),
        mt_ft_destination.to_mich(),
        mt_rarible_custody.to_mich(),
        mt_protocol_fees.to_mich(),
        att.list_to_mich(mt_origin_fees, x => {
            return x.to_mich();
        }),
        att.list_to_mich(mt_payouts, x => {
            return x.to_mich();
        })
    ]);
}
const process_transfers_arg_to_mich = (pt_transfers: Array<process_transfer_param>): att.Micheline => {
    return att.list_to_mich(pt_transfers, x => {
        return x.to_mich();
    });
}
export class Transfer_manager {
    address: string | undefined;
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(owner: att.Address, royalties_provider: att.Address, default_fee_receiver: att.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/transfer_manager.arl", {
            owner: owner.to_mich(),
            royalties_provider: royalties_provider.to_mich(),
            default_fee_receiver: default_fee_receiver.to_mich()
        }, params);
        this.address = address;
    }
    async declare_ownership(candidate: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "declare_ownership", declare_ownership_arg_to_mich(candidate), params);
        }
        throw new Error("Contract not initialised");
    }
    async claim_ownership(params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "claim_ownership", claim_ownership_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_default_fee_receiver(sfr: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_default_fee_receiver", set_default_fee_receiver_arg_to_mich(sfr), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_royalties_provider(srp: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_royalties_provider", set_royalties_provider_arg_to_mich(srp), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_fee_receiver(token: att.Address, wallet: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_fee_receiver", set_fee_receiver_arg_to_mich(token, wallet), params);
        }
        throw new Error("Contract not initialised");
    }
    async authorize_contract(ac_contract: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "authorize_contract", authorize_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async revoke_contract(ac_contract: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "revoke_contract", revoke_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async manage_transfers(mt_bundle: Array<bundle_item>, mt_nft_origin: att.Address, mt_nft_destination: att.Address, mt_ft_amount: att.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: att.Bytes, mt_ft_origin: att.Address, mt_ft_destination: att.Address, mt_rarible_custody: att.Address, mt_protocol_fees: att.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "manage_transfers", manage_transfers_arg_to_mich(mt_bundle, mt_nft_origin, mt_nft_destination, mt_ft_amount, mt_ft_asset_type, mt_ft_asset, mt_ft_origin, mt_ft_destination, mt_rarible_custody, mt_protocol_fees, mt_origin_fees, mt_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async process_transfers(pt_transfers: Array<process_transfer_param>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "process_transfers", process_transfers_arg_to_mich(pt_transfers), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_declare_ownership_param(candidate: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "declare_ownership", declare_ownership_arg_to_mich(candidate), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_claim_ownership_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "claim_ownership", claim_ownership_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_default_fee_receiver_param(sfr: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_default_fee_receiver", set_default_fee_receiver_arg_to_mich(sfr), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_royalties_provider_param(srp: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_royalties_provider", set_royalties_provider_arg_to_mich(srp), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_fee_receiver_param(token: att.Address, wallet: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_fee_receiver", set_fee_receiver_arg_to_mich(token, wallet), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_authorize_contract_param(ac_contract: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "authorize_contract", authorize_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_revoke_contract_param(ac_contract: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "revoke_contract", revoke_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_manage_transfers_param(mt_bundle: Array<bundle_item>, mt_nft_origin: att.Address, mt_nft_destination: att.Address, mt_ft_amount: att.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: att.Bytes, mt_ft_origin: att.Address, mt_ft_destination: att.Address, mt_rarible_custody: att.Address, mt_protocol_fees: att.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "manage_transfers", manage_transfers_arg_to_mich(mt_bundle, mt_nft_origin, mt_nft_destination, mt_ft_amount, mt_ft_asset_type, mt_ft_asset, mt_ft_origin, mt_ft_destination, mt_rarible_custody, mt_protocol_fees, mt_origin_fees, mt_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_process_transfers_param(pt_transfers: Array<process_transfer_param>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "process_transfers", process_transfers_arg_to_mich(pt_transfers), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Address(storage.owner);
        }
        throw new Error("Contract not initialised");
    }
    async get_royalties_provider(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Address(storage.royalties_provider);
        }
        throw new Error("Contract not initialised");
    }
    async get_default_fee_receiver(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Address(storage.default_fee_receiver);
        }
        throw new Error("Contract not initialised");
    }
    async get_fee_receivers(): Promise<Array<[
        att.Address,
        att.Address
    ]>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            let res: Array<[
                att.Address,
                att.Address
            ]> = [];
            for (let e of storage.fee_receivers.entries()) {
                res.push([(x => { return new att.Address(x); })(e[0]), (x => { return new att.Address(x); })(e[1])]);
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_authorized_contracts(): Promise<Array<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const res: Array<att.Address> = [];
            for (let i = 0; i < storage.authorized_contracts.length; i++) {
                res.push((x => { return new att.Address(x); })(storage.authorized_contracts[i]));
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_owner_candidate(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Option<att.Address>(storage.owner_candidate == null ? null : (x => { return new att.Address(x); })(storage.owner_candidate));
        }
        throw new Error("Contract not initialised");
    }
    async get_metadata_value(key: string): Promise<att.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.metadata), att.string_to_mich(key), att.prim_annot_to_mich_type("string", [])), collapsed = true;
            if (data != undefined) {
                return att.mich_to_bytes(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_metadata_value(key: string): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.metadata), att.string_to_mich(key), att.prim_annot_to_mich_type("string", [])), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        CANT_UNPACK_FA2_ASSET: att.string_to_mich("\"CANT_UNPACK_FA2_ASSET\""),
        CANT_UNPACK_FA12_ASSET: att.string_to_mich("\"CANT_UNPACK_FA12_ASSET\""),
        r_pt0: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r_pt0\"")]),
        TOTAL_AMOUNT_NEGATIVE: att.string_to_mich("\"TOTAL_AMOUNT_NEGATIVE\""),
        r_mt0: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r_mt0\"")]),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        r0: att.string_to_mich("\"INVALID_CALLER\""),
        MISSING_CANDIDATE: att.string_to_mich("\"MISSING_CANDIDATE\""),
        ROYALTIES_TOO_HIGH: att.string_to_mich("\"ROYALTIES_TOO_HIGH\""),
        NOT_AUTHORIZED: att.string_to_mich("\"NOT_AUTHORIZED\"")
    };
}
export const transfer_manager = new Transfer_manager();
