import * as ex from "@completium/experiment-ts";
export enum update_for_all_op_types {
    add_for_all = "add_for_all",
    remove_for_all = "remove_for_all"
}
export abstract class update_for_all_op extends ex.Enum<update_for_all_op_types> {
}
export class add_for_all extends update_for_all_op {
    constructor(private content: ex.Address) {
        super(update_for_all_op_types.add_for_all);
    }
    to_mich() { return ex.left_to_mich(this.content.to_mich()); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export class remove_for_all extends update_for_all_op {
    constructor(private content: ex.Address) {
        super(update_for_all_op_types.remove_for_all);
    }
    to_mich() { return ex.right_to_mich(ex.left_to_mich(this.content.to_mich())); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export const mich_to_update_for_all_op = (m: any): update_for_all_op => {
    throw new Error("mich_toupdate_for_all_op : complex enum not supported yet");
};
export class transfer_destination implements ex.ArchetypeType {
    constructor(public to_dest: ex.Address, public token_id_dest: ex.Nat, public token_amount_dest: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.to_dest.to_mich(), ex.pair_to_mich([this.token_id_dest.to_mich(), this.token_amount_dest.to_mich()])]);
    }
    equals(v: transfer_destination): boolean {
        return (this.to_dest.equals(v.to_dest) && this.to_dest.equals(v.to_dest) && this.token_id_dest.equals(v.token_id_dest) && this.token_amount_dest.equals(v.token_amount_dest));
    }
}
export class transfer_param implements ex.ArchetypeType {
    constructor(public tp_from: ex.Address, public tp_txs: Array<transfer_destination>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.tp_from.to_mich(), ex.list_to_mich(this.tp_txs, x => {
                return x.to_mich();
            })]);
    }
    equals(v: transfer_param): boolean {
        return (this.tp_from.equals(v.tp_from) && this.tp_from.equals(v.tp_from) && JSON.stringify(this.tp_txs) == JSON.stringify(v.tp_txs));
    }
}
export class operator_param implements ex.ArchetypeType {
    constructor(public opp_owner: ex.Address, public opp_operator: ex.Address, public opp_token_id: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.opp_owner.to_mich(), ex.pair_to_mich([this.opp_operator.to_mich(), this.opp_token_id.to_mich()])]);
    }
    equals(v: operator_param): boolean {
        return (this.opp_owner.equals(v.opp_owner) && this.opp_owner.equals(v.opp_owner) && this.opp_operator.equals(v.opp_operator) && this.opp_token_id.equals(v.opp_token_id));
    }
}
export class gasless_param implements ex.ArchetypeType {
    constructor(public transfer_params: Array<transfer_param>, public user_pk: ex.Key, public user_sig: ex.Signature) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([ex.list_to_mich(this.transfer_params, x => {
                return x.to_mich();
            }), ex.pair_to_mich([this.user_pk.to_mich(), this.user_sig.to_mich()])]);
    }
    equals(v: gasless_param): boolean {
        return (JSON.stringify(this.transfer_params) == JSON.stringify(v.transfer_params) && JSON.stringify(this.transfer_params) == JSON.stringify(v.transfer_params) && this.user_pk.equals(v.user_pk) && this.user_sig.equals(v.user_sig));
    }
}
export class balance_of_request implements ex.ArchetypeType {
    constructor(public bo_owner: ex.Address, public btoken_id: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.bo_owner.to_mich(), this.btoken_id.to_mich()]);
    }
    equals(v: balance_of_request): boolean {
        return (this.bo_owner.equals(v.bo_owner) && this.bo_owner.equals(v.bo_owner) && this.btoken_id.equals(v.btoken_id));
    }
}
export class balance_of_response implements ex.ArchetypeType {
    constructor(public request: balance_of_request, public balance_: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.request.to_mich(), this.balance_.to_mich()]);
    }
    equals(v: balance_of_response): boolean {
        return (this.request == v.request && this.request == v.request && this.balance_.equals(v.balance_));
    }
}
export const transfer_destination_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%to_"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%token_id"]),
        ex.prim_annot_to_mich_type("nat", ["%amount"])
    ], [])
], []);
export const transfer_param_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%from_"]),
    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%to_"]),
        ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("nat", ["%token_id"]),
            ex.prim_annot_to_mich_type("nat", ["%amount"])
        ], [])
    ], []), ["%txs"])
], []);
export const operator_param_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%owner"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%operator"]),
        ex.prim_annot_to_mich_type("nat", ["%token_id"])
    ], [])
], []);
export const gasless_param_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%from_"]),
        ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("address", ["%to_"]),
            ex.pair_array_to_mich_type([
                ex.prim_annot_to_mich_type("nat", ["%token_id"]),
                ex.prim_annot_to_mich_type("nat", ["%amount"])
            ], [])
        ], []), ["%txs"])
    ], []), ["%transfer_params"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("key", ["%user_pk"]),
        ex.prim_annot_to_mich_type("signature", ["%user_sig"])
    ], [])
], []);
export const balance_of_request_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%owner"]),
    ex.prim_annot_to_mich_type("nat", ["%token_id"])
], []);
export const balance_of_response_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("address", ["%owner"]),
        ex.prim_annot_to_mich_type("nat", ["%token_id"])
    ], ["%request"]),
    ex.prim_annot_to_mich_type("nat", ["%balance"])
], []);
export const mich_to_transfer_destination = (v: ex.Micheline, collapsed: boolean = false): transfer_destination => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, transfer_destination_mich_type);
    }
    return new transfer_destination(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]), ex.mich_to_nat(fields[2]));
};
export const mich_to_transfer_param = (v: ex.Micheline, collapsed: boolean = false): transfer_param => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, transfer_param_mich_type);
    }
    return new transfer_param(ex.mich_to_address(fields[0]), ex.mich_to_list(fields[1], x => { return mich_to_transfer_destination(x, collapsed); }));
};
export const mich_to_operator_param = (v: ex.Micheline, collapsed: boolean = false): operator_param => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, operator_param_mich_type);
    }
    return new operator_param(ex.mich_to_address(fields[0]), ex.mich_to_address(fields[1]), ex.mich_to_nat(fields[2]));
};
export const mich_to_gasless_param = (v: ex.Micheline, collapsed: boolean = false): gasless_param => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, gasless_param_mich_type);
    }
    return new gasless_param(ex.mich_to_list(fields[0], x => { return mich_to_transfer_param(x, collapsed); }), ex.mich_to_key(fields[1]), ex.mich_to_signature(fields[2]));
};
export const mich_to_balance_of_request = (v: ex.Micheline, collapsed: boolean = false): balance_of_request => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, balance_of_request_mich_type);
    }
    return new balance_of_request(ex.mich_to_address(fields[0]), ex.mich_to_nat(fields[1]));
};
export const mich_to_balance_of_response = (v: ex.Micheline, collapsed: boolean = false): balance_of_response => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, balance_of_response_mich_type);
    }
    return new balance_of_response(mich_to_balance_of_request(fields[0], collapsed), ex.mich_to_nat(fields[1]));
};
export type token_metadata_key = ex.Nat;
export class ledger_key implements ex.ArchetypeType {
    constructor(public lowner: ex.Address, public ltokenid: ex.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.lowner.to_mich(), this.ltokenid.to_mich()]);
    }
    equals(v: ledger_key): boolean {
        return (this.lowner.equals(v.lowner) && this.lowner.equals(v.lowner) && this.ltokenid.equals(v.ltokenid));
    }
}
export class operator_key implements ex.ArchetypeType {
    constructor(public oaddr: ex.Address, public otoken: ex.Nat, public oowner: ex.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.oaddr.to_mich(), ex.pair_to_mich([this.otoken.to_mich(), this.oowner.to_mich()])]);
    }
    equals(v: operator_key): boolean {
        return (this.oaddr.equals(v.oaddr) && this.oaddr.equals(v.oaddr) && this.otoken.equals(v.otoken) && this.oowner.equals(v.oowner));
    }
}
export class operator_for_all_key implements ex.ArchetypeType {
    constructor(public fa_oaddr: ex.Address, public fa_oowner: ex.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.fa_oaddr.to_mich(), this.fa_oowner.to_mich()]);
    }
    equals(v: operator_for_all_key): boolean {
        return (this.fa_oaddr.equals(v.fa_oaddr) && this.fa_oaddr.equals(v.fa_oaddr) && this.fa_oowner.equals(v.fa_oowner));
    }
}
export const token_metadata_key_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("nat", []);
export const ledger_key_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%lowner"]),
    ex.prim_annot_to_mich_type("nat", ["%ltokenid"])
], []);
export const operator_key_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%oaddr"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%otoken"]),
        ex.prim_annot_to_mich_type("address", ["%oowner"])
    ], [])
], []);
export const operator_for_all_key_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%fa_oaddr"]),
    ex.prim_annot_to_mich_type("address", ["%fa_oowner"])
], []);
export class token_metadata_value implements ex.ArchetypeType {
    constructor(public token_id: ex.Nat, public token_info: Array<[
        string,
        ex.Bytes
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.pair_to_mich([this.token_id.to_mich(), ex.list_to_mich(this.token_info, x => {
                const x_key = x[0];
                const x_value = x[1];
                return ex.elt_to_mich(ex.string_to_mich(x_key), x_value.to_mich());
            })]);
    }
    equals(v: token_metadata_value): boolean {
        return (this.token_id.equals(v.token_id) && this.token_id.equals(v.token_id) && JSON.stringify(this.token_info) == JSON.stringify(v.token_info));
    }
}
export type ledger_value = ex.Nat;
export class operator_value implements ex.ArchetypeType {
    constructor() { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.unit_to_mich();
    }
    equals(v: operator_value): boolean {
        return true;
    }
}
export class operator_for_all_value implements ex.ArchetypeType {
    constructor() { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): ex.Micheline {
        return ex.unit_to_mich();
    }
    equals(v: operator_for_all_value): boolean {
        return true;
    }
}
export const token_metadata_value_mich_type: ex.MichelineType = ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%token_id"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("string", []), ex.prim_annot_to_mich_type("bytes", []))
], []);
export const ledger_value_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("nat", []);
export const operator_value_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("unit", []);
export const operator_for_all_value_mich_type: ex.MichelineType = ex.prim_annot_to_mich_type("unit", []);
export const mich_to_token_metadata_value = (v: ex.Micheline, collapsed: boolean = false): token_metadata_value => {
    let fields: ex.Micheline[] = [];
    if (collapsed) {
        fields = ex.mich_to_pairs(v);
    }
    else {
        fields = ex.annotated_mich_to_array(v, token_metadata_value_mich_type);
    }
    return new token_metadata_value(ex.mich_to_nat(fields[0]), ex.mich_to_map(fields[1], (x, y) => [ex.mich_to_string(x), ex.mich_to_bytes(y)]));
};
export const mich_to_ledger_value = (v: ex.Micheline, collapsed: boolean = false): ledger_value => {
    return ex.mich_to_nat(v);
};
export const mich_to_operator_value = (v: ex.Micheline, collapsed: boolean = false): operator_value => {
    throw new Error("mich_to_operator_value should not be called");
};
export const mich_to_operator_for_all_value = (v: ex.Micheline, collapsed: boolean = false): operator_for_all_value => {
    throw new Error("mich_to_operator_for_all_value should not be called");
};
export type token_metadata_container = Array<[
    token_metadata_key,
    token_metadata_value
]>;
export type ledger_container = Array<[
    ledger_key,
    ledger_value
]>;
export type operator_container = Array<[
    operator_key,
    operator_value
]>;
export type operator_for_all_container = Array<[
    operator_for_all_key,
    operator_for_all_value
]>;
export const token_metadata_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.prim_annot_to_mich_type("nat", []), ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("nat", ["%token_id"]),
    ex.pair_to_mich_type("map", ex.prim_annot_to_mich_type("string", []), ex.prim_annot_to_mich_type("bytes", []))
], []));
export const ledger_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%lowner"]),
    ex.prim_annot_to_mich_type("nat", ["%ltokenid"])
], []), ex.prim_annot_to_mich_type("nat", []));
export const operator_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%oaddr"]),
    ex.pair_array_to_mich_type([
        ex.prim_annot_to_mich_type("nat", ["%otoken"]),
        ex.prim_annot_to_mich_type("address", ["%oowner"])
    ], [])
], []), ex.prim_annot_to_mich_type("unit", []));
export const operator_for_all_container_mich_type: ex.MichelineType = ex.pair_to_mich_type("big_map", ex.pair_array_to_mich_type([
    ex.prim_annot_to_mich_type("address", ["%fa_oaddr"]),
    ex.prim_annot_to_mich_type("address", ["%fa_oowner"])
], []), ex.prim_annot_to_mich_type("unit", []));
const declare_ownership_arg_to_mich = (candidate: ex.Address): ex.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
const pause_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
const unpause_arg_to_mich = (): ex.Micheline => {
    return ex.unit_mich;
}
const set_metadata_arg_to_mich = (k: string, d: ex.Option<ex.Bytes>): ex.Micheline => {
    return ex.pair_to_mich([
        ex.string_to_mich(k),
        d.to_mich()
    ]);
}
const set_token_metadata_arg_to_mich = (tid: ex.Nat, tdata: Array<[
    string,
    ex.Bytes
]>): ex.Micheline => {
    return ex.pair_to_mich([
        tid.to_mich(),
        ex.list_to_mich(tdata, x => {
            const x_key = x[0];
            const x_value = x[1];
            return ex.elt_to_mich(ex.string_to_mich(x_key), x_value.to_mich());
        })
    ]);
}
const update_operators_arg_to_mich = (upl: Array<ex.Or<operator_param, operator_param>>): ex.Micheline => {
    return ex.list_to_mich(upl, x => {
        return x.to_mich();
    });
}
const update_operators_for_all_arg_to_mich = (upl: Array<update_for_all_op>): ex.Micheline => {
    return ex.list_to_mich(upl, x => {
        return x.to_mich();
    });
}
const do_transfer_arg_to_mich = (txs: Array<transfer_param>): ex.Micheline => {
    return ex.list_to_mich(txs, x => {
        return x.to_mich();
    });
}
const transfer_arg_to_mich = (txs: Array<transfer_param>): ex.Micheline => {
    return ex.list_to_mich(txs, x => {
        return x.to_mich();
    });
}
const mint_arg_to_mich = (tow: ex.Address, tid: ex.Nat, nbt: ex.Nat): ex.Micheline => {
    return ex.pair_to_mich([
        tow.to_mich(),
        tid.to_mich(),
        nbt.to_mich()
    ]);
}
const burn_arg_to_mich = (tid: ex.Nat, nbt: ex.Nat): ex.Micheline => {
    return ex.pair_to_mich([
        tid.to_mich(),
        nbt.to_mich()
    ]);
}
const balance_of_arg_to_mich = (requests: Array<balance_of_request>): ex.Micheline => {
    return ex.list_to_mich(requests, x => {
        return x.to_mich();
    });
}
export const deploy_balance_of_callback = async (): Promise<string> => {
    return await ex.deploy_callback("balance_of", ex.list_annot_to_mich_type(ex.pair_array_to_mich_type([
        ex.pair_array_to_mich_type([
            ex.prim_annot_to_mich_type("address", ["%owner"]),
            ex.prim_annot_to_mich_type("nat", ["%token_id"])
        ], ["%request"]),
        ex.prim_annot_to_mich_type("nat", ["%balance"])
    ], []), []));
};
export class Fa2 {
    address: string | undefined;
    balance_of_callback_address: string | undefined;
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
    async deploy(owner: ex.Address, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/fa2.arl", {
            owner: owner.to_mich()
        }, params);
        this.address = address;
        this.balance_of_callback_address = await deploy_balance_of_callback();
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
    async pause(params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "pause", pause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async unpause(params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "unpause", unpause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_metadata(k: string, d: ex.Option<ex.Bytes>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_metadata", set_metadata_arg_to_mich(k, d), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_token_metadata(tid: ex.Nat, tdata: Array<[
        string,
        ex.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async update_operators(upl: Array<ex.Or<operator_param, operator_param>>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "update_operators", update_operators_arg_to_mich(upl), params);
        }
        throw new Error("Contract not initialised");
    }
    async update_operators_for_all(upl: Array<update_for_all_op>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "update_operators_for_all", update_operators_for_all_arg_to_mich(upl), params);
        }
        throw new Error("Contract not initialised");
    }
    async do_transfer(txs: Array<transfer_param>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "do_transfer", do_transfer_arg_to_mich(txs), params);
        }
        throw new Error("Contract not initialised");
    }
    async transfer(txs: Array<transfer_param>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "transfer", transfer_arg_to_mich(txs), params);
        }
        throw new Error("Contract not initialised");
    }
    async mint(tow: ex.Address, tid: ex.Nat, nbt: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "mint", mint_arg_to_mich(tow, tid, nbt), params);
        }
        throw new Error("Contract not initialised");
    }
    async burn(tid: ex.Nat, nbt: ex.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "burn", burn_arg_to_mich(tid, nbt), params);
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
    async get_pause_param(params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "pause", pause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_unpause_param(params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "unpause", unpause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_metadata_param(k: string, d: ex.Option<ex.Bytes>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_metadata", set_metadata_arg_to_mich(k, d), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_token_metadata_param(tid: ex.Nat, tdata: Array<[
        string,
        ex.Bytes
    ]>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(tid, tdata), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_update_operators_param(upl: Array<ex.Or<operator_param, operator_param>>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "update_operators", update_operators_arg_to_mich(upl), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_update_operators_for_all_param(upl: Array<update_for_all_op>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "update_operators_for_all", update_operators_for_all_arg_to_mich(upl), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_do_transfer_param(txs: Array<transfer_param>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "do_transfer", do_transfer_arg_to_mich(txs), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_param(txs: Array<transfer_param>, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "transfer", transfer_arg_to_mich(txs), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_mint_param(tow: ex.Address, tid: ex.Nat, nbt: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "mint", mint_arg_to_mich(tow, tid, nbt), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_burn_param(tid: ex.Nat, nbt: ex.Nat, params: Partial<ex.Parameters>): Promise<ex.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "burn", burn_arg_to_mich(tid, nbt), params);
        }
        throw new Error("Contract not initialised");
    }
    async balance_of(requests: Array<balance_of_request>, params: Partial<ex.Parameters>): Promise<Array<balance_of_response>> {
        if (this.address != undefined) {
            if (this.balance_of_callback_address != undefined) {
                const entrypoint = new ex.Entrypoint(new ex.Address(this.balance_of_callback_address), "callback");
                await ex.call(this.address, "balance_of", ex.getter_args_to_mich(balance_of_arg_to_mich(requests), entrypoint), params);
                return await ex.get_callback_value<Array<balance_of_response>>(this.balance_of_callback_address, x => { const res: Array<balance_of_response> = []; for (let i = 0; i < x.length; i++) {
                    res.push((x => { return new balance_of_response((x => { return new balance_of_request((x => { return new ex.Address(x); })(x.owner), (x => { return new ex.Nat(x); })(x.token_id)); })(x.request), (x => { return new ex.Nat(x); })(x.balance)); })(x[i]));
                } return res; });
            }
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
    async get_owner_candidate(): Promise<ex.Option<ex.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new ex.Option<ex.Address>(storage.owner_candidate == null ? null : (x => { return new ex.Address(x); })(storage.owner_candidate));
        }
        throw new Error("Contract not initialised");
    }
    async get_paused(): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return storage.paused;
        }
        throw new Error("Contract not initialised");
    }
    async get_token_metadata_value(key: token_metadata_key): Promise<token_metadata_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type);
            if (data != undefined) {
                return mich_to_token_metadata_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_token_metadata_value(key: token_metadata_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_ledger_value(key: ledger_key): Promise<ledger_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type);
            if (data != undefined) {
                return mich_to_ledger_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_ledger_value(key: ledger_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_operator_value(key: operator_key): Promise<operator_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.operator), key.to_mich(), operator_key_mich_type);
            if (data != undefined) {
                return mich_to_operator_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_operator_value(key: operator_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.operator), key.to_mich(), operator_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_operator_for_all_value(key: operator_for_all_key): Promise<operator_for_all_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.operator_for_all), key.to_mich(), operator_for_all_key_mich_type);
            if (data != undefined) {
                return mich_to_operator_for_all_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_operator_for_all_value(key: operator_for_all_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.operator_for_all), key.to_mich(), operator_for_all_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
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
        fa2_r7: ex.string_to_mich("\"FA2_INSUFFICIENT_BALANCE\""),
        fa2_r6: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"fa2_r6\"")]),
        FA2_INSUFFICIENT_BALANCE: ex.string_to_mich("\"FA2_INSUFFICIENT_BALANCE\""),
        fa2_r5: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"fa2_r5\"")]),
        INVALID_CALLER: ex.string_to_mich("\"INVALID_CALLER\""),
        fa2_r4: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"fa2_r4\"")]),
        fa2_r2: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"fa2_r2\"")]),
        CALLER_NOT_OWNER: ex.string_to_mich("\"CALLER_NOT_OWNER\""),
        fa2_r1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"fa2_r1\"")]),
        tmd_r1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"tmd_r1\"")]),
        md_r1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"md_r1\"")]),
        pausable_r2: ex.string_to_mich("\"CONTRACT_NOT_PAUSED\""),
        pausable_r1: ex.pair_to_mich([ex.string_to_mich("\"INVALID_CONDITION\""), ex.string_to_mich("\"pausable_r1\"")]),
        ownership_r1: ex.string_to_mich("\"INVALID_CALLER\""),
        FA2_NOT_OPERATOR: ex.string_to_mich("\"FA2_NOT_OPERATOR\""),
        CONTRACT_PAUSED: ex.string_to_mich("\"CONTRACT_PAUSED\"")
    };
}
export const fa2 = new Fa2();
