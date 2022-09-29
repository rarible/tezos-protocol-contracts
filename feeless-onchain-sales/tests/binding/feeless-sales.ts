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
export class bundle_sale implements ex.ArchetypeType {
    constructor(public bundle_sale_origin_fees: Array<part>, public bundle_sale_payouts: Array<part>, public bundle_sale_amount: ex.Nat, public bundle_sale_start: ex.Option<Date>, public bundle_sale_end: ex.Option<Date>, public bundle_sale_qty: ex.Nat, public bundle_sale_max_fees_base_boint: ex.Nat, public bundle_sale_data_type: ex.Option<ex.Bytes>, public bundle_sale_data: ex.Option<ex.Bytes>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([ex.list_to_mich(this.bundle_sale_origin_fees, x => {
                return x.to_mich();
            }), ex.pair_to_mich([ex.list_to_mich(this.bundle_sale_payouts, x => {
                    return x.to_mich();
                }), ex.pair_to_mich([this.bundle_sale_amount.to_mich(), ex.pair_to_mich([this.bundle_sale_start.to_mich(), ex.pair_to_mich([this.bundle_sale_end.to_mich(), ex.pair_to_mich([this.bundle_sale_qty.to_mich(), ex.pair_to_mich([this.bundle_sale_max_fees_base_boint.to_mich(), ex.pair_to_mich([this.bundle_sale_data_type.to_mich(), this.bundle_sale_data.to_mich()])])])])])])])]);
    }
    equals(v: bundle_sale): boolean {
        return (JSON.stringify(this.bundle_sale_origin_fees) == JSON.stringify(v.bundle_sale_origin_fees) && JSON.stringify(this.bundle_sale_origin_fees) == JSON.stringify(v.bundle_sale_origin_fees) && JSON.stringify(this.bundle_sale_payouts) == JSON.stringify(v.bundle_sale_payouts) && this.bundle_sale_amount.equals(v.bundle_sale_amount) && this.bundle_sale_start.equals(v.bundle_sale_start) && this.bundle_sale_end.equals(v.bundle_sale_end) && this.bundle_sale_qty.equals(v.bundle_sale_qty) && this.bundle_sale_max_fees_base_boint.equals(v.bundle_sale_max_fees_base_boint) && this.bundle_sale_data_type.equals(v.bundle_sale_data_type) && this.bundle_sale_data.equals(v.bundle_sale_data));
    }
}
export class sale implements ex.ArchetypeType {
    constructor(public sale_asset_contract: ex.Address, public sale_asset_token_id: ex.Nat, public sale_type: asset_type, public sale_asset: ex.Bytes, public sale_origin_fees: Array<part>, public sale_payouts: Array<part>, public sale_amount: ex.Nat, public sale_asset_qty: ex.Nat, public sale_start: ex.Option<Date>, public sale_end: ex.Option<Date>, public sale_max_fees_base_boint: ex.Nat, public sale_data_type: ex.Option<ex.Bytes>, public sale_data: ex.Option<ex.Bytes>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.sale_asset_contract.to_mich(), ex.pair_to_mich([this.sale_asset_token_id.to_mich(), ex.pair_to_mich([this.sale_type.to_mich(), ex.pair_to_mich([this.sale_asset.to_mich(), ex.pair_to_mich([ex.list_to_mich(this.sale_origin_fees, x => {
                                return x.to_mich();
                            }), ex.pair_to_mich([ex.list_to_mich(this.sale_payouts, x => {
                                    return x.to_mich();
                                }), ex.pair_to_mich([this.sale_amount.to_mich(), ex.pair_to_mich([this.sale_asset_qty.to_mich(), ex.pair_to_mich([this.sale_start.to_mich(), ex.pair_to_mich([this.sale_end.to_mich(), ex.pair_to_mich([this.sale_max_fees_base_boint.to_mich(), ex.pair_to_mich([this.sale_data_type.to_mich(), this.sale_data.to_mich()])])])])])])])])])])])]);
    }
    equals(v: sale): boolean {
        return (this.sale_asset_contract.equals(v.sale_asset_contract) && this.sale_asset_contract.equals(v.sale_asset_contract) && this.sale_asset_token_id.equals(v.sale_asset_token_id) && this.sale_type == v.sale_type && this.sale_asset.equals(v.sale_asset) && JSON.stringify(this.sale_origin_fees) == JSON.stringify(v.sale_origin_fees) && JSON.stringify(this.sale_payouts) == JSON.stringify(v.sale_payouts) && this.sale_amount.equals(v.sale_amount) && this.sale_asset_qty.equals(v.sale_asset_qty) && this.sale_start.equals(v.sale_start) && this.sale_end.equals(v.sale_end) && this.sale_max_fees_base_boint.equals(v.sale_max_fees_base_boint) && this.sale_data_type.equals(v.sale_data_type) && this.sale_data.equals(v.sale_data));
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
export const bundle_item_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%bundle_item_contract"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%bundle_item_id"]),
        ex.prim_annot_to_mich_type("nat", ["%bundle_item_qty"])
    ], [])
], []);
export const bundle_sale_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%part_account"]),
        ex.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%bundle_sale_origin_fees"]),
    ex.pair_array_to_mich_type([
        ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("address", ["%part_account"]),
            ex.prim_annot_to_mich_type("nat", ["%part_value"])
        ], []), ["%bundle_sale_payouts"]),
        ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("nat", ["%bundle_sale_amount"]),
            ex.pair_array_to_mich_type([
                ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("timestamp", []), ["%bundle_sale_start"]),
                ex.pair_array_to_mich_type([
                    ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("timestamp", []), ["%bundle_sale_end"]),
                    ex.pair_array_to_mich_type([
                        ex.prim_annot_to_mich_type("nat", ["%bundle_sale_qty"]),
                        ex.pair_array_to_mich_type([
                            ex.prim_annot_to_mich_type("nat", ["%bundle_sale_max_fees_base_boint"]),
                            ex.pair_array_to_mich_type([
                                ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("bytes", []), ["%bundle_sale_data_type"]),
                                ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("bytes", []), ["%bundle_sale_data"])
                            ], [])
                        ], [])
                    ], [])
                ], [])
            ], [])
        ], [])
    ], [])
], []);
export const sale_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%sale_asset_contract"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%sale_asset_token_id"]),
        ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("int", ["%sale_type"]),
            ex.pair_array_to_mich_type([
                ex.prim_annot_to_mich_type("bytes", ["%sale_asset"]),
                ex.pair_array_to_mich_type([
                    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
                        ex.prim_annot_to_mich_type("address", ["%part_account"]),
                        ex.prim_annot_to_mich_type("nat", ["%part_value"])
                    ], []), ["%sale_origin_fees"]),
                    ex.pair_array_to_mich_type([
                        ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
                            ex.prim_annot_to_mich_type("address", ["%part_account"]),
                            ex.prim_annot_to_mich_type("nat", ["%part_value"])
                        ], []), ["%sale_payouts"]),
                        ex.pair_array_to_mich_type([
                            ex.prim_annot_to_mich_type("nat", ["%sale_amount"]),
                            ex.pair_array_to_mich_type([
                                ex.prim_annot_to_mich_type("nat", ["%sale_asset_qty"]),
                                ex.pair_array_to_mich_type([
                                    ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("timestamp", []), ["%sale_start"]),
                                    ex.pair_array_to_mich_type([
                                        ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("timestamp", []), ["%sale_end"]),
                                        ex.pair_array_to_mich_type([
                                            ex.prim_annot_to_mich_type("nat", ["%sale_max_fees_base_boint"]),
                                            ex.pair_array_to_mich_type([
                                                ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("bytes", []), ["%sale_data_type"]),
                                                ex.option_annot_to_mich_type(ex.prim_annot_to_mich_type("bytes", []), ["%sale_data"])
                                            ], [])
                                        ], [])
                                    ], [])
                                ], [])
                            ], [])
                        ], [])
                    ], [])
                ], [])
            ], [])
        ], [])
    ], [])
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
export const mich_to_bundle_sale = (v: ex.Micheline, collapsed: boolean = false): bundle_sale => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, bundle_sale_mich_type);
    }
    return new bundle_sale(ex.mich_to_list(fields[0], x => { return mich_to_part(x, collapsed); }), ex.mich_to_list(fields[1], x => { return mich_to_part(x, collapsed); }), ex.mich_to_nat(fields[2]), ex.mich_to_option(fields[3], x => { return ex.mich_to_date(x); }), ex.mich_to_option(fields[4], x => { return ex.mich_to_date(x); }), ex.mich_to_nat(fields[5]), ex.mich_to_nat(fields[6]), ex.mich_to_option(fields[7], x => { return ex.mich_to_bytes(x); }), ex.mich_to_option(fields[8], x => { return ex.mich_to_bytes(x); }));
};
export const mich_to_sale = (v: ex.Micheline, collapsed: boolean = false): sale => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, sale_mich_type);
    }
    return new sale(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]), mich_to_asset_type(fields[2]), ex.mich_to_bytes(fields[3]), ex.mich_to_list(fields[4], x => { return mich_to_part(x, collapsed); }), ex.mich_to_list(fields[5], x => { return mich_to_part(x, collapsed); }), ex.mich_to_nat(fields[6]), ex.mich_to_nat(fields[7]), ex.mich_to_option(fields[8], x => { return ex.mich_to_date(x); }), ex.mich_to_option(fields[9], x => { return ex.mich_to_date(x); }), ex.mich_to_nat(fields[10]), ex.mich_to_option(fields[11], x => { return ex.mich_to_bytes(x); }), ex.mich_to_option(fields[12], x => { return ex.mich_to_bytes(x); }));
};
const declare_ownership_arg_to_mich = (candidate: ex.Address): ex.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
const set_sales_storage_contract_arg_to_mich = (sesc_contract: ex.Address): ex.Micheline => {
    return sesc_contract.to_mich();
}
const set_protocol_fee_arg_to_mich = (spf: ex.Nat): ex.Micheline => {
    return spf.to_mich();
}
const set_fees_limit_arg_to_mich = (sfl: ex.Nat): ex.Micheline => {
    return sfl.to_mich();
}
const set_transfer_manager_arg_to_mich = (stm_contract: ex.Address): ex.Micheline => {
    return stm_contract.to_mich();
}
const set_sales_storage_arg_to_mich = (sss_contract: ex.Address): ex.Micheline => {
    return sss_contract.to_mich();
}
const set_max_bundle_items_arg_to_mich = (smbi_number: ex.Nat): ex.Micheline => {
    return smbi_number.to_mich();
}
const sell_arg_to_mich = (s_sale: sale, s_seller_pubk: ex.Key, s_sig: ex.Signature): ex.Micheline => {
    return ex.pair_to_mich([
        s_sale.to_mich(),
        s_seller_pubk.to_mich(),
        s_sig.to_mich()
    ]);
}
const sell_bundle_arg_to_mich = (sb_bundle: ex.Bytes, sb_sale_type: asset_type, sb_sale_asset: ex.Bytes, sb_sale: bundle_sale): ex.Micheline => {
    return ex.pair_to_mich([
        sb_bundle.to_mich(),
        sb_sale_type.to_mich(),
        sb_sale_asset.to_mich(),
        sb_sale.to_mich()
    ]);
}
const buy_arg_to_mich = (b_asset_contract: ex.Address, b_asset_token_id: ex.Nat, b_seller: ex.Address, b_sale_type: asset_type, b_sale_asset: ex.Bytes, b_amount: ex.Nat, b_origin_fees: Array<part>, b_payouts: Array<part>): ex.Micheline => {
    return ex.pair_to_mich([
        b_asset_contract.to_mich(),
        b_asset_token_id.to_mich(),
        b_seller.to_mich(),
        b_sale_type.to_mich(),
        b_sale_asset.to_mich(),
        b_amount.to_mich(),
        ex.list_to_mich(b_origin_fees, x => {
            return x.to_mich();
        }),
        ex.list_to_mich(b_payouts, x => {
            return x.to_mich();
        })
    ]);
}
const buy_bundle_arg_to_mich = (bb_bundle: ex.Bytes, bb_seller: ex.Address, bb_sale_type: asset_type, bb_sale_asset: ex.Bytes, bb_amount: ex.Nat, bb_origin_fees: Array<part>, bb_payouts: Array<part>): ex.Micheline => {
    return ex.pair_to_mich([
        bb_bundle.to_mich(),
        bb_seller.to_mich(),
        bb_sale_type.to_mich(),
        bb_sale_asset.to_mich(),
        bb_amount.to_mich(),
        ex.list_to_mich(bb_origin_fees, x => {
            return x.to_mich();
        }),
        ex.list_to_mich(bb_payouts, x => {
            return x.to_mich();
        })
    ]);
}
const cancel_sale_arg_to_mich = (cs_asset_contract: ex.Address, cs_asset_token_id: ex.Nat, cs_sale_type: asset_type, cs_sale_asset: ex.Bytes): ex.Micheline => {
    return ex.pair_to_mich([
        cs_asset_contract.to_mich(),
        cs_asset_token_id.to_mich(),
        cs_sale_type.to_mich(),
        cs_sale_asset.to_mich()
    ]);
}
const cancel_bundle_sale_arg_to_mich = (cbs_bundle: ex.Bytes, cbs_sale_type: asset_type, cbs_sale_asset: ex.Bytes): ex.Micheline => {
    return ex.pair_to_mich([
        cbs_bundle.to_mich(),
        cbs_sale_type.to_mich(),
        cbs_sale_asset.to_mich()
    ]);
}
const default_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
export class Feeless_sales {
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
    async deploy(owner: ex.Address, protocol_fee: ex.Nat, transfer_manager: ex.Address, sales_storage: ex.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/feeless_sales.arl", {
            owner: owner.to_mich(),
            protocol_fee: protocol_fee.to_mich(),
            transfer_manager: transfer_manager.to_mich(),
            sales_storage: sales_storage.to_mich()
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
    async set_sales_storage_contract(sesc_contract: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_sales_storage_contract", set_sales_storage_contract_arg_to_mich(sesc_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_protocol_fee(spf: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_protocol_fee", set_protocol_fee_arg_to_mich(spf), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_fees_limit(sfl: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_fees_limit", set_fees_limit_arg_to_mich(sfl), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_transfer_manager(stm_contract: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_transfer_manager", set_transfer_manager_arg_to_mich(stm_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_sales_storage(sss_contract: ex.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_sales_storage", set_sales_storage_arg_to_mich(sss_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_max_bundle_items(smbi_number: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_max_bundle_items", set_max_bundle_items_arg_to_mich(smbi_number), params);
        }
        throw new Error("Contract not initialised");
    }
    async sell(s_sale: sale, s_seller_pubk: ex.Key, s_sig: ex.Signature, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "sell", sell_arg_to_mich(s_sale, s_seller_pubk, s_sig), params);
        }
        throw new Error("Contract not initialised");
    }
    async sell_bundle(sb_bundle: ex.Bytes, sb_sale_type: asset_type, sb_sale_asset: ex.Bytes, sb_sale: bundle_sale, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "sell_bundle", sell_bundle_arg_to_mich(sb_bundle, sb_sale_type, sb_sale_asset, sb_sale), params);
        }
        throw new Error("Contract not initialised");
    }
    async buy(b_asset_contract: ex.Address, b_asset_token_id: ex.Nat, b_seller: ex.Address, b_sale_type: asset_type, b_sale_asset: ex.Bytes, b_amount: ex.Nat, b_origin_fees: Array<part>, b_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "buy", buy_arg_to_mich(b_asset_contract, b_asset_token_id, b_seller, b_sale_type, b_sale_asset, b_amount, b_origin_fees, b_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async buy_bundle(bb_bundle: ex.Bytes, bb_seller: ex.Address, bb_sale_type: asset_type, bb_sale_asset: ex.Bytes, bb_amount: ex.Nat, bb_origin_fees: Array<part>, bb_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "buy_bundle", buy_bundle_arg_to_mich(bb_bundle, bb_seller, bb_sale_type, bb_sale_asset, bb_amount, bb_origin_fees, bb_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async cancel_sale(cs_asset_contract: ex.Address, cs_asset_token_id: ex.Nat, cs_sale_type: asset_type, cs_sale_asset: ex.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "cancel_sale", cancel_sale_arg_to_mich(cs_asset_contract, cs_asset_token_id, cs_sale_type, cs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async cancel_bundle_sale(cbs_bundle: ex.Bytes, cbs_sale_type: asset_type, cbs_sale_asset: ex.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "cancel_bundle_sale", cancel_bundle_sale_arg_to_mich(cbs_bundle, cbs_sale_type, cbs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async default(params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "default", default_arg_to_mich(), params);
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
    async get_set_sales_storage_contract_param(sesc_contract: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_sales_storage_contract", set_sales_storage_contract_arg_to_mich(sesc_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_protocol_fee_param(spf: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_protocol_fee", set_protocol_fee_arg_to_mich(spf), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_fees_limit_param(sfl: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_fees_limit", set_fees_limit_arg_to_mich(sfl), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_transfer_manager_param(stm_contract: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_transfer_manager", set_transfer_manager_arg_to_mich(stm_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_sales_storage_param(sss_contract: ex.Address, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_sales_storage", set_sales_storage_arg_to_mich(sss_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_max_bundle_items_param(smbi_number: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_max_bundle_items", set_max_bundle_items_arg_to_mich(smbi_number), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_sell_param(s_sale: sale, s_seller_pubk: ex.Key, s_sig: ex.Signature, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "sell", sell_arg_to_mich(s_sale, s_seller_pubk, s_sig), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_sell_bundle_param(sb_bundle: ex.Bytes, sb_sale_type: asset_type, sb_sale_asset: ex.Bytes, sb_sale: bundle_sale, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "sell_bundle", sell_bundle_arg_to_mich(sb_bundle, sb_sale_type, sb_sale_asset, sb_sale), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_buy_param(b_asset_contract: ex.Address, b_asset_token_id: ex.Nat, b_seller: ex.Address, b_sale_type: asset_type, b_sale_asset: ex.Bytes, b_amount: ex.Nat, b_origin_fees: Array<part>, b_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "buy", buy_arg_to_mich(b_asset_contract, b_asset_token_id, b_seller, b_sale_type, b_sale_asset, b_amount, b_origin_fees, b_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_buy_bundle_param(bb_bundle: ex.Bytes, bb_seller: ex.Address, bb_sale_type: asset_type, bb_sale_asset: ex.Bytes, bb_amount: ex.Nat, bb_origin_fees: Array<part>, bb_payouts: Array<part>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "buy_bundle", buy_bundle_arg_to_mich(bb_bundle, bb_seller, bb_sale_type, bb_sale_asset, bb_amount, bb_origin_fees, bb_payouts), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_cancel_sale_param(cs_asset_contract: ex.Address, cs_asset_token_id: ex.Nat, cs_sale_type: asset_type, cs_sale_asset: ex.Bytes, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "cancel_sale", cancel_sale_arg_to_mich(cs_asset_contract, cs_asset_token_id, cs_sale_type, cs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_cancel_bundle_sale_param(cbs_bundle: ex.Bytes, cbs_sale_type: asset_type, cbs_sale_asset: ex.Bytes, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "cancel_bundle_sale", cancel_bundle_sale_arg_to_mich(cbs_bundle, cbs_sale_type, cbs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_default_param(params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "default", default_arg_to_mich(), params);
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
    async get_protocol_fee(): Promise<ex.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Nat(storage.protocol_fee);
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_manager(): Promise<ex.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Address(storage.transfer_manager);
        }
        throw new Error("Contract not initialised");
    }
    async get_sales_storage(): Promise<ex.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Address(storage.sales_storage);
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
    async get_max_bundle_items(): Promise<ex.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Nat(storage.max_bundle_items);
        }
        throw new Error("Contract not initialised");
    }
    async get_max_fees_limit(): Promise<ex.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Nat(storage.max_fees_limit);
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
        r_cbs0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_cbs0\"")]),
        r_cs0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_cs0\"")]),
        SALE_NOT_STARTED: ex.string_to_mich("\"SALE_NOT_STARTED\""),
        SALE_CLOSED: ex.string_to_mich("\"SALE_CLOSED\""),
        INVALID_BUY_AMOUNT: ex.string_to_mich("\"INVALID_BUY_AMOUNT\""),
        FEES_OVER_SELLER_LIMIT: ex.string_to_mich("\"FEES_OVER_SELLER_LIMIT\""),
        MISSING_BUNDLE_SALE: ex.string_to_mich("\"MISSING_BUNDLE_SALE\""),
        MISSING_SALE: ex.string_to_mich("\"MISSING_SALE\""),
        INVALID_SALE_START_DATE: ex.string_to_mich("\"INVALID_SALE_START_DATE\""),
        INVALID_SALE_END_DATE: ex.string_to_mich("\"INVALID_SALE_END_DATE\""),
        r_sb2: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_sb2\"")]),
        r_sb1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_sb1\"")]),
        r_sb0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_sb0\"")]),
        INVALID_SIGNATURE: ex.string_to_mich("\"INVALID_SIGNATURE\""),
        r_s3: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_s3\"")]),
        r_s2: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_s2\"")]),
        r_s1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_s1\"")]),
        r_s0: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"r_s0\"")]),
        INVALID_CALLER: ex.string_to_mich("\"INVALID_CALLER\""),
        r0: ex.string_to_mich("\"INVALID_CALLER\""),
        MISSING_CANDIDATE: ex.string_to_mich("\"MISSING_CANDIDATE\""),
        INVALID_BUNDLE_ITEM_QTY: ex.string_to_mich("\"INVALID_BUNDLE_ITEM_QTY\""),
        BUNDLE_CANT_BE_EMPTY: ex.string_to_mich("\"BUNDLE_CANT_BE_EMPTY\""),
        CANT_UNPACK_BUNDLE: ex.string_to_mich("\"CANT_UNPACK_BUNDLE\""),
        CANT_UNPACK_FA2_ASSET: ex.string_to_mich("\"CANT_UNPACK_FA2_ASSET\""),
        CANT_UNPACK_FA12_ASSET: ex.string_to_mich("\"CANT_UNPACK_FA12_ASSET\""),
        WRONG_XTZ_PAYLOAD: ex.string_to_mich("\"WRONG_XTZ_PAYLOAD\"")
    };
}
export const feeless_sales = new Feeless_sales();
