import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export class allowance_key implements att.ArchetypeType {
    constructor(public addr_owner: att.Address, public addr_spender: att.Address) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.addr_owner.to_mich(), this.addr_spender.to_mich()]);
    }
    equals(v: allowance_key): boolean {
        return (this.addr_owner.equals(v.addr_owner) && this.addr_owner.equals(v.addr_owner) && this.addr_spender.equals(v.addr_spender));
    }
}
export type ledger_key = att.Address;
export type token_metadata_key = att.Nat;
export const allowance_key_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%addr_owner"]),
    att.prim_annot_to_mich_type("address", ["%addr_spender"])
], []);
export const ledger_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const token_metadata_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export type allowance_value = att.Nat;
export type ledger_value = att.Nat;
export class token_metadata_value implements att.ArchetypeType {
    constructor(public token_id: att.Nat, public token_info: Array<[
        string,
        att.Bytes
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.token_id.to_mich(), att.list_to_mich(this.token_info, x => {
                const x_key = x[0];
                const x_value = x[1];
                return att.elt_to_mich(att.string_to_mich(x_key), x_value.to_mich());
            })]);
    }
    equals(v: token_metadata_value): boolean {
        return (this.token_id.equals(v.token_id) && this.token_id.equals(v.token_id) && JSON.stringify(this.token_info) == JSON.stringify(v.token_info));
    }
}
export const allowance_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export const ledger_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export const token_metadata_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%token_id"]),
    att.pair_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.prim_annot_to_mich_type("bytes", []))
], []);
export const mich_to_allowance_value = (v: att.Micheline, collapsed: boolean = false): allowance_value => {
    return att.mich_to_nat(v);
};
export const mich_to_ledger_value = (v: att.Micheline, collapsed: boolean = false): ledger_value => {
    return att.mich_to_nat(v);
};
export const mich_to_token_metadata_value = (v: att.Micheline, collapsed: boolean = false): token_metadata_value => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, token_metadata_value_mich_type);
    }
    return new token_metadata_value(att.mich_to_nat(fields[0]), att.mich_to_map(fields[1], (x, y) => [att.mich_to_string(x), att.mich_to_bytes(y)]));
};
export type allowance_container = Array<[
    allowance_key,
    allowance_value
]>;
export type ledger_container = Array<[
    ledger_key,
    ledger_value
]>;
export type token_metadata_container = Array<[
    token_metadata_key,
    token_metadata_value
]>;
export const allowance_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%addr_owner"]),
    att.prim_annot_to_mich_type("address", ["%addr_spender"])
], []), att.prim_annot_to_mich_type("nat", []));
export const ledger_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.prim_annot_to_mich_type("address", []), att.prim_annot_to_mich_type("nat", []));
export const token_metadata_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.prim_annot_to_mich_type("nat", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%token_id"]),
    att.pair_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.prim_annot_to_mich_type("bytes", []))
], []));
const set_token_metadata_arg_to_mich = (m: att.Bytes): att.Micheline => {
    return m.to_mich();
}
const transfer_arg_to_mich = (from: att.Address, to: att.Address, value: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        from.to_mich(),
        to.to_mich(),
        value.to_mich()
    ]);
}
const approve_arg_to_mich = (spender: att.Address, value: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        spender.to_mich(),
        value.to_mich()
    ]);
}
const getAllowance_arg_to_mich = (owner: att.Address, spender: att.Address): att.Micheline => {
    return att.pair_to_mich([
        owner.to_mich(),
        spender.to_mich()
    ]);
}
const getBalance_arg_to_mich = (owner: att.Address): att.Micheline => {
    return owner.to_mich();
}
const getTotalSupply_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export const deploy_getAllowance_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getAllowance", att.prim_annot_to_mich_type("nat", []));
};
export const deploy_getBalance_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getBalance", att.prim_annot_to_mich_type("nat", []));
};
export const deploy_getTotalSupply_callback = async (): Promise<string> => {
    return await ex.deploy_callback("getTotalSupply", att.prim_annot_to_mich_type("nat", []));
};
export class Fa12 {
    address: string | undefined;
    getAllowance_callback_address: string | undefined;
    getBalance_callback_address: string | undefined;
    getTotalSupply_callback_address: string | undefined;
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
    async deploy(initialholder: att.Address, totalsupply: att.Nat, params: Partial<ex.Parameters>) {
        const address = await ex.deploy("./contracts/fa12.arl", {
            initialholder: initialholder.to_mich(),
            totalsupply: totalsupply.to_mich()
        }, params);
        this.address = address;
        this.getAllowance_callback_address = await deploy_getAllowance_callback();
        this.getBalance_callback_address = await deploy_getBalance_callback();
        this.getTotalSupply_callback_address = await deploy_getTotalSupply_callback();
    }
    async set_token_metadata(m: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(m), params);
        }
        throw new Error("Contract not initialised");
    }
    async transfer(from: att.Address, to: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async approve(spender: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_token_metadata_param(m: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_token_metadata", set_token_metadata_arg_to_mich(m), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_transfer_param(from: att.Address, to: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "transfer", transfer_arg_to_mich(from, to, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_approve_param(spender: att.Address, value: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "approve", approve_arg_to_mich(spender, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async getAllowance(owner: att.Address, spender: att.Address, params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getAllowance_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getAllowance_callback_address), "callback");
                await ex.call(this.address, "getAllowance", att.getter_args_to_mich(getAllowance_arg_to_mich(owner, spender), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getAllowance_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getBalance(owner: att.Address, params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getBalance_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getBalance_callback_address), "callback");
                await ex.call(this.address, "getBalance", att.getter_args_to_mich(getBalance_arg_to_mich(owner), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getBalance_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async getTotalSupply(params: Partial<ex.Parameters>): Promise<att.Nat> {
        if (this.address != undefined) {
            if (this.getTotalSupply_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.getTotalSupply_callback_address), "callback");
                await ex.call(this.address, "getTotalSupply", att.getter_args_to_mich(getTotalSupply_arg_to_mich(), entrypoint), params);
                return await ex.get_callback_value<att.Nat>(this.getTotalSupply_callback_address, x => { return new att.Nat(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_initialholder(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Address(storage.initialholder);
        }
        throw new Error("Contract not initialised");
    }
    async get_totalsupply(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Nat(storage.totalsupply);
        }
        throw new Error("Contract not initialised");
    }
    async get_allowance_value(key: allowance_key): Promise<allowance_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.allowance), key.to_mich(), allowance_key_mich_type), collapsed = true;
            if (data != undefined) {
                return mich_to_allowance_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_allowance_value(key: allowance_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.allowance), key.to_mich(), allowance_key_mich_type), collapsed = true;
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
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type), collapsed = true;
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
            const data = await ex.get_big_map_value(BigInt(storage.ledger), key.to_mich(), ledger_key_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_token_metadata_value(key: token_metadata_key): Promise<token_metadata_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type), collapsed = true;
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
            const data = await ex.get_big_map_value(BigInt(storage.token_metadata), key.to_mich(), token_metadata_key_mich_type), collapsed = true;
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
        r1: att.string_to_mich("\"NotEnoughBalance\"")
    };
}
export const fa12 = new Fa12();
