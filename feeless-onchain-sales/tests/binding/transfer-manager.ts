import * as ex from "@completium/experiment-ts";
export enum asset_type_types {
    XTZ = "XTZ",
    FA12 = "FA12",
    FA2 = "FA2"
}
export abstract class asset_type extends ex.Enum<asset_type_types> {
}
export class XTZ extends asset_type {
    constructor() {
        super(asset_type_types.XTZ);
    }
    to_mich() { return ex.left_to_mich(ex.unit_mich); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class FA12 extends asset_type {
    constructor() {
        super(asset_type_types.FA12);
    }
    to_mich() { return ex.right_to_mich(ex.left_to_mich(ex.unit_mich)); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class FA2 extends asset_type {
    constructor() {
        super(asset_type_types.FA2);
    }
    to_mich() { return ex.right_to_mich(ex.right_to_mich(ex.unit_mich)); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export const mich_to_asset_type = (m: any): asset_type => {
    const v = (new ex.Nat(m)).to_big_number().toNumber();
    switch (v) {
        case 0: return new XTZ();
        case 1: return new FA12();
        case 2: return new FA2();
        default: throw new Error("mich_to_asset_type : invalid value " + v);
    }
};
export class FA2_asset implements ex.ArchetypeType {
    constructor(public fa2_asset_contract: ex.Address, public fa2_asset_token_id: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.fa2_asset_contract.to_mich(), this.fa2_asset_token_id.to_mich()]);
    }
    equals(v: FA2_asset): boolean {
        return (this.fa2_asset_contract.equals(v.fa2_asset_contract) && this.fa2_asset_contract.equals(v.fa2_asset_contract) && this.fa2_asset_token_id.equals(v.fa2_asset_token_id));
    }
}
export type FA12_asset = ex.Address;
export class transfer_param implements ex.ArchetypeType {
    constructor(public destination_address: ex.Address, public token_id: ex.Nat, public token_amount: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.destination_address.to_mich(), ex.pair_to_mich([this.token_id.to_mich(), this.token_amount.to_mich()])]);
    }
    equals(v: transfer_param): boolean {
        return (this.destination_address.equals(v.destination_address) && this.destination_address.equals(v.destination_address) && this.token_id.equals(v.token_id) && this.token_amount.equals(v.token_amount));
    }
}
export class process_transfer_param implements ex.ArchetypeType {
    constructor(public ptp_asset_type: asset_type, public ptp_asset: ex.Bytes, public ptp_amount: ex.Nat, public ptp_origin: ex.Address, public ptp_destination: ex.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.ptp_asset_type.to_mich(), ex.pair_to_mich([this.ptp_asset.to_mich(), ex.pair_to_mich([this.ptp_amount.to_mich(), ex.pair_to_mich([this.ptp_origin.to_mich(), this.ptp_destination.to_mich()])])])]);
    }
    equals(v: process_transfer_param): boolean {
        return (this.ptp_asset_type == v.ptp_asset_type && this.ptp_asset_type == v.ptp_asset_type && this.ptp_asset.equals(v.ptp_asset) && this.ptp_amount.equals(v.ptp_amount) && this.ptp_origin.equals(v.ptp_origin) && this.ptp_destination.equals(v.ptp_destination));
    }
}
export class bundle_item implements ex.ArchetypeType {
    constructor(public bundle_item_contract: ex.Address, public bundle_item_id: ex.Nat, public bundle_item_qty: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.bundle_item_contract.to_mich(), ex.pair_to_mich([this.bundle_item_id.to_mich(), this.bundle_item_qty.to_mich()])]);
    }
    equals(v: bundle_item): boolean {
        return (this.bundle_item_contract.equals(v.bundle_item_contract) && this.bundle_item_contract.equals(v.bundle_item_contract) && this.bundle_item_id.equals(v.bundle_item_id) && this.bundle_item_qty.equals(v.bundle_item_qty));
    }
}
export class part implements ex.ArchetypeType {
    constructor(public part_account: ex.Address, public part_value: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.part_account.to_mich(), this.part_value.to_mich()]);
    }
    equals(v: part): boolean {
        return (this.part_account.equals(v.part_account) && this.part_account.equals(v.part_account) && this.part_value.equals(v.part_value));
    }
}
export class fees implements ex.ArchetypeType {
    constructor(public origin_fees: Array<part>, public payouts: Array<part>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([ex.list_to_mich(this.origin_fees, x => {
                return x.to_mich();
            }), ex.list_to_mich(this.payouts, x => {
                return x.to_mich();
            })]);
    }
    equals(v: fees): boolean {
        return (JSON.stringify(this.origin_fees) == JSON.stringify(v.origin_fees) && JSON.stringify(this.origin_fees) == JSON.stringify(v.origin_fees) && JSON.stringify(this.payouts) == JSON.stringify(v.payouts));
    }
}
export const FA2_asset_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%fa2_asset_contract"]),
    ex.prim_annot_to_mich_type("nat", ["%fa2_asset_token_id"])
], []);
export const FA12_asset_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("address", []);
export const transfer_param_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%to"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%token_id"]),
        ex.prim_annot_to_mich_type("nat", ["%amount"])
    ], [])
], []);
export const process_transfer_param_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("int", ["%ptp_asset_type"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("bytes", ["%ptp_asset"]),
        ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("nat", ["%ptp_amount"]),
            ex.pair_array_to_mich_type([
                ex.prim_annot_to_mich_type("address", ["%ptp_origin"]),
                ex.prim_annot_to_mich_type("address", ["%ptp_destination"])
            ], [])
        ], [])
    ], [])
], []);
export const bundle_item_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%bundle_item_contract"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%bundle_item_id"]),
        ex.prim_annot_to_mich_type("nat", ["%bundle_item_qty"])
    ], [])
], []);
export const part_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%part_account"]),
    ex.prim_annot_to_mich_type("nat", ["%part_value"])
], []);
export const fees_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%part_account"]),
        ex.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%origin_fees"]),
    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%part_account"]),
        ex.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%payouts"])
], []);
export const mich_to_FA2_asset = (v: ex.Micheline, collapsed: boolean = false): FA2_asset => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, FA2_asset_mich_type);
    }
    return new FA2_asset(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]));
};
export const mich_to_FA12_asset = (v: ex.Micheline, collapsed: boolean = false): FA12_asset => {
    throw new Error("mich_to_FA12_asset should not be called");
};
export const mich_to_transfer_param = (v: ex.Micheline, collapsed: boolean = false): transfer_param => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, transfer_param_mich_type);
    }
    return new transfer_param(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]), ex.mich_to_nat(fields[2]));
};
export const mich_to_process_transfer_param = (v: ex.Micheline, collapsed: boolean = false): process_transfer_param => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, process_transfer_param_mich_type);
    }
    return new process_transfer_param(mich_to_asset_type(fields[0]), ex.mich_to_bytes(fields[1]), ex.mich_to_nat(fields[2]), ex.mich_to_address(fields[3]), ex.mich_to_address(fields[4]));
};
export const mich_to_bundle_item = (v: ex.Micheline, collapsed: boolean = false): bundle_item => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, bundle_item_mich_type);
    }
    return new bundle_item(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]), ex.mich_to_nat(fields[2]));
};
export const mich_to_part = (v: ex.Micheline, collapsed: boolean = false): part => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, part_mich_type);
    }
    return new part(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]));
};
export const mich_to_fees = (v: ex.Micheline, collapsed: boolean = false): fees => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, fees_mich_type);
    }
    return new fees(ex.mich_to_list(fields[0], x => { return mich_to_part(x, collapsed); }), ex.mich_to_list(fields[1], x => { return mich_to_part(x, collapsed); }));
};
const declare_ownership_arg_to_mich = (candidate: ex.Address): ex.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
const set_default_fee_receiver_arg_to_mich = (sfr: ex.Address): ex.Micheline => {
    return sfr.to_mich();
}
const set_royalties_provider_arg_to_mich = (srp: ex.Address): ex.Micheline => {
    return srp.to_mich();
}
const set_fee_receiver_arg_to_mich = (token: ex.Address, wallet: ex.Address): ex.Micheline => {
    return ex.pair_to_mich([
        token.to_mich(),
        wallet.to_mich()
    ]);
}
const authorize_contract_arg_to_mich = (ac_contract: ex.Address): ex.Micheline => {
    return ac_contract.to_mich();
}
const revoke_contract_arg_to_mich = (ac_contract: ex.Address): ex.Micheline => {
    return ac_contract.to_mich();
}
const manage_transfers_arg_to_mich = (mt_bundle: Array<bundle_item>, mt_nft_origin: ex.Address, mt_nft_destination: ex.Address, mt_ft_amount: ex.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: ex.Bytes, mt_ft_origin: ex.Address, mt_ft_destination: ex.Address, mt_rarible_custody: ex.Address, mt_protocol_fees: ex.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>): ex.Micheline => {
    return ex.pair_to_mich([
        ex.list_to_mich(mt_bundle, x => {
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
        ex.list_to_mich(mt_origin_fees, x => {
            return x.to_mich();
        }),
        ex.list_to_mich(mt_payouts, x => {
            return x.to_mich();
        })
    ]);
}
const process_transfers_arg_to_mich = (pt_transfers: Array<process_transfer_param>): ex.Micheline => {
    return ex.list_to_mich(pt_transfers, x => {
        return x.to_mich();
    });
}
export class Transfer_manager {
    address: string | undefined;
    get_address(): ex.Address {
        if (undefined != this.address) {
            return new ex.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<ex.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new ex.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(owner: ex.Address, royalties_provider: ex.Address, default_fee_receiver: ex.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/transfer_manager.arl", {
            owner: owner.to_mich(),
            royalties_provider: royalties_provider.to_mich(),
            default_fee_receiver: default_fee_receiver.to_mich()
        }, params);
        this.address = address;
    }
    async declare_ownership(candidate: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
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
    async set_default_fee_receiver(sfr: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_default_fee_receiver", set_default_fee_receiver_arg_to_mich(sfr), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_royalties_provider(srp: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_royalties_provider", set_royalties_provider_arg_to_mich(srp), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_fee_receiver(token: ex.Address, wallet: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_fee_receiver", set_fee_receiver_arg_to_mich(token, wallet), params);
        }
        throw new Error("Contract not initialised");
    }
    async authorize_contract(ac_contract: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "authorize_contract", authorize_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async revoke_contract(ac_contract: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "revoke_contract", revoke_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async manage_transfers(mt_bundle: Array<bundle_item>, mt_nft_origin: ex.Address, mt_nft_destination: ex.Address, mt_ft_amount: ex.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: ex.Bytes, mt_ft_origin: ex.Address, mt_ft_destination: ex.Address, mt_rarible_custody: ex.Address, mt_protocol_fees: ex.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<any> {
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
    async get_declare_ownership_param(candidate: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "declare_ownership", declare_ownership_arg_to_mich(candidate), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_claim_ownership_param(params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "claim_ownership", claim_ownership_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_default_fee_receiver_param(sfr: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_default_fee_receiver", set_default_fee_receiver_arg_to_mich(sfr), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_royalties_provider_param(srp: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_royalties_provider", set_royalties_provider_arg_to_mich(srp), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_fee_receiver_param(token: ex.Address, wallet: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_fee_receiver", set_fee_receiver_arg_to_mich(token, wallet), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_authorize_contract_param(ac_contract: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "authorize_contract", authorize_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_revoke_contract_param(ac_contract: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "revoke_contract", revoke_contract_arg_to_mich(ac_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_manage_transfers_param(mt_bundle: Array<bundle_item>, mt_nft_origin: ex.Address, mt_nft_destination: ex.Address, mt_ft_amount: ex.Nat, mt_ft_asset_type: asset_type, mt_ft_asset: ex.Bytes, mt_ft_origin: ex.Address, mt_ft_destination: ex.Address, mt_rarible_custody: ex.Address, mt_protocol_fees: ex.Nat, mt_origin_fees: Array<part>, mt_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "manage_transfers", manage_transfers_arg_to_mich(mt_bundle, mt_nft_origin, mt_nft_destination, mt_ft_amount, mt_ft_asset_type, mt_ft_asset, mt_ft_origin, mt_ft_destination, mt_rarible_custody, mt_protocol_fees, mt_origin_fees, mt_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_process_transfers_param(pt_transfers: Array<process_transfer_param>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "process_transfers", process_transfers_arg_to_mich(pt_transfers), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<ex.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Address(storage.owner);
        }
        throw new Error("Contract not initialised");
    }
    async get_royalties_provider(): Promise<ex.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Address(storage.royalties_provider);
        }
        throw new Error("Contract not initialised");
    }
    async get_default_fee_receiver(): Promise<ex.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Address(storage.default_fee_receiver);
        }
        throw new Error("Contract not initialised");
    }
    async get_fee_receivers(): Promise<Array<[
        ex.Address,
        ex.Address
    ]>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            let res: Array<[
                ex.Address,
                ex.Address
            ]> = [];
            for (let e of storage.fee_receivers.entries()) {
                res.push([(x => { return new ex.Address(x); })(e[0]), (x => { return new ex.Address(x); })(e[1])]);
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_authorized_contracts(): Promise<Array<ex.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const res: Array<ex.Address> = [];
            for (let i = 0; i < storage.authorized_contracts.length; i++) {
                res.push((x => { return new ex.Address(x); })(storage.authorized_contracts[i]));
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_owner_candidate(): Promise<ex.Option<ex.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Option<ex.Address>(storage.owner_candidate == null ? null : (x => { return new ex.Address(x); })(storage.owner_candidate));
        }
        throw new Error("Contract not initialised");
    }
    async get_metadata_value(key: string): Promise<ex.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.metadata), ex.string_to_mich(key), ex.prim_annot_to_mich_type("bytes", []));
            if (data != undefined) {
                return ex.mich_to_bytes(data);
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
            const data = await ex.get_big_map_value(BigInt(storage.metadata), ex.string_to_mich(key), ex.prim_annot_to_mich_type("bytes", []));
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
        CANT_UNPACK_FA2_ASSET: ex.string_to_mich("\"CANT_UNPACK_FA2_ASSET\""),
        CANT_UNPACK_FA12_ASSET: ex.string_to_mich("\"CANT_UNPACK_FA12_ASSET\""),
        r_pt0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_pt0\"")]),
        TOTAL_AMOUNT_NEGATIVE: ex.string_to_mich("\"TOTAL_AMOUNT_NEGATIVE\""),
        r_mt0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_mt0\"")]),
        INVALID_CALLER: ex.string_to_mich("\"INVALID_CALLER\""),
        r0: ex.string_to_mich("\"INVALID_CALLER\""),
        MISSING_CANDIDATE: ex.string_to_mich("\"MISSING_CANDIDATE\""),
        ROYALTIES_TOO_HIGH: ex.string_to_mich("\"ROYALTIES_TOO_HIGH\""),
        NOT_AUTHORIZED: ex.string_to_mich("\"NOT_AUTHORIZED\"")
    };
}
export const transfer_manager = new Transfer_manager();
