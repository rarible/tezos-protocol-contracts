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
export class operator_param implements att.ArchetypeType {
    constructor(public opp_owner: att.Address, public opp_operator: att.Address, public opp_token_id: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.opp_owner.to_mich(), att.pair_to_mich([this.opp_operator.to_mich(), this.opp_token_id.to_mich()])]);
    }
    equals(v: operator_param): boolean {
        return (this.opp_owner.equals(v.opp_owner) && this.opp_owner.equals(v.opp_owner) && this.opp_operator.equals(v.opp_operator) && this.opp_token_id.equals(v.opp_token_id));
    }
}
export class sale implements att.ArchetypeType {
    constructor(public sale_origin_fees: Array<part>, public sale_payouts: Array<part>, public sale_amount: att.Nat, public sale_asset_qty: att.Nat, public sale_start: att.Option<Date>, public sale_end: att.Option<Date>, public sale_max_fees_base_boint: att.Nat, public sale_data_type: att.Option<att.Bytes>, public sale_data: att.Option<att.Bytes>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.list_to_mich(this.sale_origin_fees, x => {
                return x.to_mich();
            }), att.pair_to_mich([att.list_to_mich(this.sale_payouts, x => {
                    return x.to_mich();
                }), att.pair_to_mich([this.sale_amount.to_mich(), att.pair_to_mich([this.sale_asset_qty.to_mich(), att.pair_to_mich([this.sale_start.to_mich(), att.pair_to_mich([this.sale_end.to_mich(), att.pair_to_mich([this.sale_max_fees_base_boint.to_mich(), att.pair_to_mich([this.sale_data_type.to_mich(), this.sale_data.to_mich()])])])])])])])]);
    }
    equals(v: sale): boolean {
        return (JSON.stringify(this.sale_origin_fees) == JSON.stringify(v.sale_origin_fees) && JSON.stringify(this.sale_origin_fees) == JSON.stringify(v.sale_origin_fees) && JSON.stringify(this.sale_payouts) == JSON.stringify(v.sale_payouts) && this.sale_amount.equals(v.sale_amount) && this.sale_asset_qty.equals(v.sale_asset_qty) && this.sale_start.equals(v.sale_start) && this.sale_end.equals(v.sale_end) && this.sale_max_fees_base_boint.equals(v.sale_max_fees_base_boint) && this.sale_data_type.equals(v.sale_data_type) && this.sale_data.equals(v.sale_data));
    }
}
export class sale_arg implements att.ArchetypeType {
    constructor(public sale_arg_asset_contract: att.Address, public sale_arg_asset_token_id: att.Nat, public sale_arg_seller: att.Address, public sale_arg_type: asset_type, public sale_arg_asset: att.Bytes, public sale_arg_origin_fees: Array<part>, public sale_arg_payouts: Array<part>, public sale_arg_amount: att.Nat, public sale_arg_asset_qty: att.Nat, public sale_arg_start: att.Option<Date>, public sale_arg_end: att.Option<Date>, public sale_arg_max_fees_base_boint: att.Nat, public sale_arg_data_type: att.Option<att.Bytes>, public sale_arg_data: att.Option<att.Bytes>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.sale_arg_asset_contract.to_mich(), att.pair_to_mich([this.sale_arg_asset_token_id.to_mich(), att.pair_to_mich([this.sale_arg_seller.to_mich(), att.pair_to_mich([this.sale_arg_type.to_mich(), att.pair_to_mich([this.sale_arg_asset.to_mich(), att.pair_to_mich([att.list_to_mich(this.sale_arg_origin_fees, x => {
                                    return x.to_mich();
                                }), att.pair_to_mich([att.list_to_mich(this.sale_arg_payouts, x => {
                                        return x.to_mich();
                                    }), att.pair_to_mich([this.sale_arg_amount.to_mich(), att.pair_to_mich([this.sale_arg_asset_qty.to_mich(), att.pair_to_mich([this.sale_arg_start.to_mich(), att.pair_to_mich([this.sale_arg_end.to_mich(), att.pair_to_mich([this.sale_arg_max_fees_base_boint.to_mich(), att.pair_to_mich([this.sale_arg_data_type.to_mich(), this.sale_arg_data.to_mich()])])])])])])])])])])])])]);
    }
    equals(v: sale_arg): boolean {
        return (this.sale_arg_asset_contract.equals(v.sale_arg_asset_contract) && this.sale_arg_asset_contract.equals(v.sale_arg_asset_contract) && this.sale_arg_asset_token_id.equals(v.sale_arg_asset_token_id) && this.sale_arg_seller.equals(v.sale_arg_seller) && this.sale_arg_type == v.sale_arg_type && this.sale_arg_asset.equals(v.sale_arg_asset) && JSON.stringify(this.sale_arg_origin_fees) == JSON.stringify(v.sale_arg_origin_fees) && JSON.stringify(this.sale_arg_payouts) == JSON.stringify(v.sale_arg_payouts) && this.sale_arg_amount.equals(v.sale_arg_amount) && this.sale_arg_asset_qty.equals(v.sale_arg_asset_qty) && this.sale_arg_start.equals(v.sale_arg_start) && this.sale_arg_end.equals(v.sale_arg_end) && this.sale_arg_max_fees_base_boint.equals(v.sale_arg_max_fees_base_boint) && this.sale_arg_data_type.equals(v.sale_arg_data_type) && this.sale_arg_data.equals(v.sale_arg_data));
    }
}
export const FA2_asset_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%fa2_asset_contract"]),
    att.prim_annot_to_mich_type("nat", ["%fa2_asset_token_id"])
], []);
export const FA12_asset_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const part_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%part_account"]),
    att.prim_annot_to_mich_type("nat", ["%part_value"])
], []);
export const bundle_item_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%bundle_item_contract"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%bundle_item_id"]),
        att.prim_annot_to_mich_type("nat", ["%bundle_item_qty"])
    ], [])
], []);
export const operator_param_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%owner"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%operator"]),
        att.prim_annot_to_mich_type("nat", ["%token_id"])
    ], [])
], []);
export const sale_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%part_account"]),
        att.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%sale_origin_fees"]),
    att.pair_array_to_mich_type([
        att.list_annot_to_mich_type(att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%part_account"]),
            att.prim_annot_to_mich_type("nat", ["%part_value"])
        ], []), ["%sale_payouts"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("nat", ["%sale_amount"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("nat", ["%sale_asset_qty"]),
                att.pair_array_to_mich_type([
                    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_start"]),
                    att.pair_array_to_mich_type([
                        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_end"]),
                        att.pair_array_to_mich_type([
                            att.prim_annot_to_mich_type("nat", ["%sale_max_fees_base_boint"]),
                            att.pair_array_to_mich_type([
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data_type"]),
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data"])
                            ], [])
                        ], [])
                    ], [])
                ], [])
            ], [])
        ], [])
    ], [])
], []);
export const sale_arg_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%sale_arg_asset_contract"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%sale_arg_asset_token_id"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%sale_arg_seller"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("int", ["%sale_arg_type"]),
                att.pair_array_to_mich_type([
                    att.prim_annot_to_mich_type("bytes", ["%sale_arg_asset"]),
                    att.pair_array_to_mich_type([
                        att.list_annot_to_mich_type(att.pair_array_to_mich_type([
                            att.prim_annot_to_mich_type("address", ["%part_account"]),
                            att.prim_annot_to_mich_type("nat", ["%part_value"])
                        ], []), ["%sale_arg_origin_fees"]),
                        att.pair_array_to_mich_type([
                            att.list_annot_to_mich_type(att.pair_array_to_mich_type([
                                att.prim_annot_to_mich_type("address", ["%part_account"]),
                                att.prim_annot_to_mich_type("nat", ["%part_value"])
                            ], []), ["%sale_arg_payouts"]),
                            att.pair_array_to_mich_type([
                                att.prim_annot_to_mich_type("nat", ["%sale_arg_amount"]),
                                att.pair_array_to_mich_type([
                                    att.prim_annot_to_mich_type("nat", ["%sale_arg_asset_qty"]),
                                    att.pair_array_to_mich_type([
                                        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_arg_start"]),
                                        att.pair_array_to_mich_type([
                                            att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_arg_end"]),
                                            att.pair_array_to_mich_type([
                                                att.prim_annot_to_mich_type("nat", ["%sale_arg_max_fees_base_boint"]),
                                                att.pair_array_to_mich_type([
                                                    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_arg_data_type"]),
                                                    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_arg_data"])
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
    ], [])
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
export const mich_to_operator_param = (v: att.Micheline, collapsed: boolean = false): operator_param => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, operator_param_mich_type);
    }
    return new operator_param(att.mich_to_address(fields[0]), att.mich_to_address(fields[1]), att.mich_to_nat(fields[2]));
};
export const mich_to_sale = (v: att.Micheline, collapsed: boolean = false): sale => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, sale_mich_type);
    }
    return new sale(att.mich_to_list(fields[0], x => { return mich_to_part(x, collapsed); }), att.mich_to_list(fields[1], x => { return mich_to_part(x, collapsed); }), att.mich_to_nat(fields[2]), att.mich_to_nat(fields[3]), att.mich_to_option(fields[4], x => { return att.mich_to_date(x); }), att.mich_to_option(fields[5], x => { return att.mich_to_date(x); }), att.mich_to_nat(fields[6]), att.mich_to_option(fields[7], x => { return att.mich_to_bytes(x); }), att.mich_to_option(fields[8], x => { return att.mich_to_bytes(x); }));
};
export const mich_to_sale_arg = (v: att.Micheline, collapsed: boolean = false): sale_arg => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, sale_arg_mich_type);
    }
    return new sale_arg(att.mich_to_address(fields[0]), att.mich_to_nat(fields[1]), att.mich_to_address(fields[2]), mich_to_asset_type(fields[3]), att.mich_to_bytes(fields[4]), att.mich_to_list(fields[5], x => { return mich_to_part(x, collapsed); }), att.mich_to_list(fields[6], x => { return mich_to_part(x, collapsed); }), att.mich_to_nat(fields[7]), att.mich_to_nat(fields[8]), att.mich_to_option(fields[9], x => { return att.mich_to_date(x); }), att.mich_to_option(fields[10], x => { return att.mich_to_date(x); }), att.mich_to_nat(fields[11]), att.mich_to_option(fields[12], x => { return att.mich_to_bytes(x); }), att.mich_to_option(fields[13], x => { return att.mich_to_bytes(x); }));
};
export class sales_key implements att.ArchetypeType {
    constructor(public sale_asset_contract: att.Address, public sale_asset_token_id: att.Nat, public sale_asset_seller: att.Address, public sale_type: asset_type, public sale_asset: att.Bytes) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.sale_asset_contract.to_mich(), att.pair_to_mich([this.sale_asset_token_id.to_mich(), att.pair_to_mich([this.sale_asset_seller.to_mich(), att.pair_to_mich([this.sale_type.to_mich(), this.sale_asset.to_mich()])])])]);
    }
    equals(v: sales_key): boolean {
        return (this.sale_asset_contract.equals(v.sale_asset_contract) && this.sale_asset_contract.equals(v.sale_asset_contract) && this.sale_asset_token_id.equals(v.sale_asset_token_id) && this.sale_asset_seller.equals(v.sale_asset_seller) && this.sale_type == v.sale_type && this.sale_asset.equals(v.sale_asset));
    }
}
export const sales_key_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%sale_asset_contract"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%sale_asset_token_id"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%sale_asset_seller"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("int", ["%sale_type"]),
                att.prim_annot_to_mich_type("bytes", ["%sale_asset"])
            ], [])
        ], [])
    ], [])
], []);
export type sales_value = sale;
export const sales_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%part_account"]),
        att.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%sale_origin_fees"]),
    att.pair_array_to_mich_type([
        att.list_annot_to_mich_type(att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%part_account"]),
            att.prim_annot_to_mich_type("nat", ["%part_value"])
        ], []), ["%sale_payouts"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("nat", ["%sale_amount"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("nat", ["%sale_asset_qty"]),
                att.pair_array_to_mich_type([
                    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_start"]),
                    att.pair_array_to_mich_type([
                        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_end"]),
                        att.pair_array_to_mich_type([
                            att.prim_annot_to_mich_type("nat", ["%sale_max_fees_base_boint"]),
                            att.pair_array_to_mich_type([
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data_type"]),
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data"])
                            ], [])
                        ], [])
                    ], [])
                ], [])
            ], [])
        ], [])
    ], [])
], []);
export const mich_to_sales_value = (v: att.Micheline, collapsed: boolean = false): sales_value => {
    return mich_to_sale(v, collapsed);
};
export type sales_container = Array<[
    sales_key,
    sales_value
]>;
export const sales_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%sale_asset_contract"]),
    att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("nat", ["%sale_asset_token_id"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%sale_asset_seller"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("int", ["%sale_type"]),
                att.prim_annot_to_mich_type("bytes", ["%sale_asset"])
            ], [])
        ], [])
    ], [])
], []), att.pair_array_to_mich_type([
    att.list_annot_to_mich_type(att.pair_array_to_mich_type([
        att.prim_annot_to_mich_type("address", ["%part_account"]),
        att.prim_annot_to_mich_type("nat", ["%part_value"])
    ], []), ["%sale_origin_fees"]),
    att.pair_array_to_mich_type([
        att.list_annot_to_mich_type(att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("address", ["%part_account"]),
            att.prim_annot_to_mich_type("nat", ["%part_value"])
        ], []), ["%sale_payouts"]),
        att.pair_array_to_mich_type([
            att.prim_annot_to_mich_type("nat", ["%sale_amount"]),
            att.pair_array_to_mich_type([
                att.prim_annot_to_mich_type("nat", ["%sale_asset_qty"]),
                att.pair_array_to_mich_type([
                    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_start"]),
                    att.pair_array_to_mich_type([
                        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("timestamp", []), ["%sale_end"]),
                        att.pair_array_to_mich_type([
                            att.prim_annot_to_mich_type("nat", ["%sale_max_fees_base_boint"]),
                            att.pair_array_to_mich_type([
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data_type"]),
                                att.option_annot_to_mich_type(att.prim_annot_to_mich_type("bytes", []), ["%sale_data"])
                            ], [])
                        ], [])
                    ], [])
                ], [])
            ], [])
        ], [])
    ], [])
], []));
const declare_ownership_arg_to_mich = (candidate: att.Address): att.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const set_sales_contract_arg_to_mich = (ssc_contract: att.Address): att.Micheline => {
    return ssc_contract.to_mich();
}
const set_transfer_manager_arg_to_mich = (stm_contract: att.Address): att.Micheline => {
    return stm_contract.to_mich();
}
const set_sale_arg_to_mich = (ss_sale: sale_arg): att.Micheline => {
    return ss_sale.to_mich();
}
const remove_sale_arg_to_mich = (rs_asset_contract: att.Address, rs_asset_token_id: att.Nat, rs_seller: att.Address, rs_sale_type: asset_type, rs_sale_asset: att.Bytes): att.Micheline => {
    return att.pair_to_mich([
        rs_asset_contract.to_mich(),
        rs_asset_token_id.to_mich(),
        rs_seller.to_mich(),
        rs_sale_type.to_mich(),
        rs_sale_asset.to_mich()
    ]);
}
const default_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const view_sale_exists_arg_to_mich = (se_asset_contract: att.Address, se_asset_token_id: att.Nat, se_seller: att.Address, se_sale_type: asset_type, se_sale_asset: att.Bytes): att.Micheline => {
    return att.pair_to_mich([
        se_asset_contract.to_mich(),
        se_asset_token_id.to_mich(),
        se_seller.to_mich(),
        se_sale_type.to_mich(),
        se_sale_asset.to_mich()
    ]);
}
const view_get_sale_arg_to_mich = (gs_asset_contract: att.Address, gs_asset_token_id: att.Nat, gs_seller: att.Address, gs_sale_type: asset_type, gs_sale_asset: att.Bytes): att.Micheline => {
    return att.pair_to_mich([
        gs_asset_contract.to_mich(),
        gs_asset_token_id.to_mich(),
        gs_seller.to_mich(),
        gs_sale_type.to_mich(),
        gs_sale_asset.to_mich()
    ]);
}
export class Sales_storage {
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
    async deploy(owner: att.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/sales_storage.arl", {
            owner: owner.to_mich()
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
    async set_sales_contract(ssc_contract: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_sales_contract", set_sales_contract_arg_to_mich(ssc_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_transfer_manager(stm_contract: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_transfer_manager", set_transfer_manager_arg_to_mich(stm_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_sale(ss_sale: sale_arg, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_sale", set_sale_arg_to_mich(ss_sale), params);
        }
        throw new Error("Contract not initialised");
    }
    async remove_sale(rs_asset_contract: att.Address, rs_asset_token_id: att.Nat, rs_seller: att.Address, rs_sale_type: asset_type, rs_sale_asset: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "remove_sale", remove_sale_arg_to_mich(rs_asset_contract, rs_asset_token_id, rs_seller, rs_sale_type, rs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async default(params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "default", default_arg_to_mich(), params);
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
    async get_set_sales_contract_param(ssc_contract: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_sales_contract", set_sales_contract_arg_to_mich(ssc_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_transfer_manager_param(stm_contract: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_transfer_manager", set_transfer_manager_arg_to_mich(stm_contract), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_sale_param(ss_sale: sale_arg, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_sale", set_sale_arg_to_mich(ss_sale), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_remove_sale_param(rs_asset_contract: att.Address, rs_asset_token_id: att.Nat, rs_seller: att.Address, rs_sale_type: asset_type, rs_sale_asset: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "remove_sale", remove_sale_arg_to_mich(rs_asset_contract, rs_asset_token_id, rs_seller, rs_sale_type, rs_sale_asset), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_default_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "default", default_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async view_sale_exists(se_asset_contract: att.Address, se_asset_token_id: att.Nat, se_seller: att.Address, se_sale_type: asset_type, se_sale_asset: att.Bytes, params: Partial<ex.Parameters>): Promise<boolean> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "sale_exists", view_sale_exists_arg_to_mich(se_asset_contract, se_asset_token_id, se_seller, se_sale_type, se_sale_asset), params);
            return mich;
        }
        throw new Error("Contract not initialised");
    }
    async view_get_sale(gs_asset_contract: att.Address, gs_asset_token_id: att.Nat, gs_seller: att.Address, gs_sale_type: asset_type, gs_sale_asset: att.Bytes, params: Partial<ex.Parameters>): Promise<att.Option<sale>> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_sale", view_get_sale_arg_to_mich(gs_asset_contract, gs_asset_token_id, gs_seller, gs_sale_type, gs_sale_asset), params);
            return new att.Option<sale>(mich == null ? null : (x => { return new sale((x => { const res: Array<part> = []; for (let i = 0; i < x.length; i++) {
                res.push((x => { return new part((x => { return new att.Address(x); })(x.part_account), (x => { return new att.Nat(x); })(x.part_value)); })(x[i]));
            } return res; })(x.sale_origin_fees), (x => { const res: Array<part> = []; for (let i = 0; i < x.length; i++) {
                res.push((x => { return new part((x => { return new att.Address(x); })(x.part_account), (x => { return new att.Nat(x); })(x.part_value)); })(x[i]));
            } return res; })(x.sale_payouts), (x => { return new att.Nat(x); })(x.sale_amount), (x => { return new att.Nat(x); })(x.sale_asset_qty), (x => { return new att.Option<Date>(x == null ? null : (x => { return new Date(x); })(x)); })(x.sale_start), (x => { return new att.Option<Date>(x == null ? null : (x => { return new Date(x); })(x)); })(x.sale_end), (x => { return new att.Nat(x); })(x.sale_max_fees_base_boint), (x => { return new att.Option<att.Bytes>(x == null ? null : (x => { return new att.Bytes(x); })(x)); })(x.sale_data_type), (x => { return new att.Option<att.Bytes>(x == null ? null : (x => { return new att.Bytes(x); })(x)); })(x.sale_data)); })(mich));
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
    async get_owner_candidate(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Option<att.Address>(storage.owner_candidate == null ? null : (x => { return new att.Address(x); })(storage.owner_candidate));
        }
        throw new Error("Contract not initialised");
    }
    async get_sales_contract(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Option<att.Address>(storage.sales_contract == null ? null : (x => { return new att.Address(x); })(storage.sales_contract));
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_manager(): Promise<att.Option<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Option<att.Address>(storage.transfer_manager == null ? null : (x => { return new att.Address(x); })(storage.transfer_manager));
        }
        throw new Error("Contract not initialised");
    }
    async get_sales_value(key: sales_key): Promise<sales_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.sales), key.to_mich(), sales_key_mich_type), collapsed = true;
            if (data != undefined) {
                return mich_to_sales_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_sales_value(key: sales_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.sales), key.to_mich(), sales_key_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
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
        r_rs0: att.string_to_mich("\"INVALID_CALLER\""),
        MISSING_SALES_CONTRACT: att.string_to_mich("\"MISSING_SALES_CONTRACT\""),
        r_ss0: att.string_to_mich("\"INVALID_CALLER\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        r0: att.string_to_mich("\"INVALID_CALLER\""),
        MISSING_CANDIDATE: att.string_to_mich("\"MISSING_CANDIDATE\"")
    };
}
export const sales_storage = new Sales_storage();
