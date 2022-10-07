import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export class part implements att.ArchetypeType {
    constructor(public partAccount: att.Address, public partValue: att.Nat) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.partAccount.to_mich(), this.partValue.to_mich()]);
    }
    equals(v: part): boolean {
        return (this.partAccount.equals(v.partAccount) && this.partAccount.equals(v.partAccount) && this.partValue.equals(v.partValue));
    }
}
export const part_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%partAccount"]),
    att.prim_annot_to_mich_type("nat", ["%partValue"])
], []);
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
export type user_key = att.Address;
export class royalties_key implements att.ArchetypeType {
    constructor(public rtoken: att.Address, public rtokenId: att.Option<att.Nat>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.rtoken.to_mich(), this.rtokenId.to_mich()]);
    }
    equals(v: royalties_key): boolean {
        return (this.rtoken.equals(v.rtoken) && this.rtoken.equals(v.rtoken) && this.rtokenId.equals(v.rtokenId));
    }
}
export const user_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const royalties_key_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%rtoken"]),
    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%rtokenId"])
], []);
export type royalties_value = Array<part>;
export const royalties_value_mich_type: att.MichelineType = att.list_annot_to_mich_type(att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%partAccount"]),
    att.prim_annot_to_mich_type("nat", ["%partValue"])
], []), []);
export const mich_to_royalties_value = (v: att.Micheline, collapsed: boolean = false): royalties_value => {
    return att.mich_to_list(v, x => { return mich_to_part(x, collapsed); });
};
export type user_container = Array<user_key>;
export type royalties_container = Array<[
    royalties_key,
    royalties_value
]>;
export const user_container_mich_type: att.MichelineType = att.list_annot_to_mich_type(att.prim_annot_to_mich_type("address", []), []);
export const royalties_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%rtoken"]),
    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%rtokenId"])
], []), att.list_annot_to_mich_type(att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("address", ["%partAccount"]),
    att.prim_annot_to_mich_type("nat", ["%partValue"])
], []), []));
const set_metadata_uri_arg_to_mich = (idata: att.Bytes): att.Micheline => {
    return idata.to_mich();
}
const declare_ownership_arg_to_mich = (candidate: att.Address): att.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const add_user_arg_to_mich = (new_user: att.Address): att.Micheline => {
    return new_user.to_mich();
}
const rm_user_arg_to_mich = (old_user: att.Address): att.Micheline => {
    return old_user.to_mich();
}
const set_royalties_arg_to_mich = (token: att.Address, tokenId: att.Option<att.Nat>, value: Array<part>): att.Micheline => {
    return att.pair_to_mich([
        token.to_mich(),
        tokenId.to_mich(),
        att.list_to_mich(value, x => {
            return x.to_mich();
        })
    ]);
}
const view_get_royalties_arg_to_mich = (token: att.Address, tokenId: att.Nat): att.Micheline => {
    return att.pair_to_mich([
        token.to_mich(),
        tokenId.to_mich()
    ]);
}
export class Royalties {
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
        const address = await ex.deploy("./contracts/royalties.arl", {
            owner: owner.to_mich()
        }, params);
        this.address = address;
    }
    async set_metadata_uri(idata: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_metadata_uri", set_metadata_uri_arg_to_mich(idata), params);
        }
        throw new Error("Contract not initialised");
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
    async add_user(new_user: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "add_user", add_user_arg_to_mich(new_user), params);
        }
        throw new Error("Contract not initialised");
    }
    async rm_user(old_user: att.Address, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "rm_user", rm_user_arg_to_mich(old_user), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_royalties(token: att.Address, tokenId: att.Option<att.Nat>, value: Array<part>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_royalties", set_royalties_arg_to_mich(token, tokenId, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_metadata_uri_param(idata: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_metadata_uri", set_metadata_uri_arg_to_mich(idata), params);
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
    async get_add_user_param(new_user: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "add_user", add_user_arg_to_mich(new_user), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_rm_user_param(old_user: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "rm_user", rm_user_arg_to_mich(old_user), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_royalties_param(token: att.Address, tokenId: att.Option<att.Nat>, value: Array<part>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_royalties", set_royalties_arg_to_mich(token, tokenId, value), params);
        }
        throw new Error("Contract not initialised");
    }
    async view_get_royalties(token: att.Address, tokenId: att.Nat, params: Partial<ex.Parameters>): Promise<Array<part>> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "get_royalties", view_get_royalties_arg_to_mich(token, tokenId), params);
            const res: Array<part> = [];
            for (let i = 0; i < mich.length; i++) {
                res.push((x => { return new part((x => { return new att.Address(x); })(x.partAccount), (x => { return new att.Nat(x); })(x.partValue)); })(mich[i]));
            }
            return res;
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
    async get_max_bundle_items(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Nat(storage.max_bundle_items);
        }
        throw new Error("Contract not initialised");
    }
    async get_max_fees_limit(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Nat(storage.max_fees_limit);
        }
        throw new Error("Contract not initialised");
    }
    async get_user(): Promise<user_container> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const res: Array<att.Address> = [];
            for (let i = 0; i < storage.user.length; i++) {
                res.push((x => { return new att.Address(x); })(storage.user[i]));
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_royalties_value(key: royalties_key): Promise<royalties_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.royalties), key.to_mich(), royalties_key_mich_type), collapsed = true;
            if (data != undefined) {
                return mich_to_royalties_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_royalties_value(key: royalties_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.royalties), key.to_mich(), royalties_key_mich_type), collapsed = true;
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
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        co1: att.string_to_mich("\"INVALID_CALLER\""),
        MISSING_OWNER_CANDIDATE: att.string_to_mich("\"MISSING_OWNER_CANDIDATE\"")
    };
}
export const royalties = new Royalties();
