import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export enum consumer_op_types {
    add = "add",
    remove = "remove"
}
export abstract class consumer_op extends att.Enum<consumer_op_types> {
}
export class add extends consumer_op {
    constructor(private content: att.Address) {
        super(consumer_op_types.add);
    }
    to_mich() { return att.left_to_mich(this.content.to_mich()); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export class remove extends consumer_op {
    constructor(private content: att.Address) {
        super(consumer_op_types.remove);
    }
    to_mich() { return att.right_to_mich(att.left_to_mich(this.content.to_mich())); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    get() { return this.content; }
}
export const mich_to_consumer_op = (m: any): consumer_op => {
    throw new Error("mich_toconsumer_op : complex enum not supported yet");
};
export class user_permit implements att.ArchetypeType {
    constructor(public expiry: att.Option<att.Nat>, public created_at: Date) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.expiry.to_mich(), att.date_to_mich(this.created_at)]);
    }
    equals(v: user_permit): boolean {
        return (this.expiry.equals(v.expiry) && this.expiry.equals(v.expiry) && (this.created_at.getTime() - this.created_at.getMilliseconds()) == (v.created_at.getTime() - v.created_at.getMilliseconds()));
    }
}
export const user_permit_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%expiry"]),
    att.prim_annot_to_mich_type("timestamp", ["%created_at"])
], []);
export const mich_to_user_permit = (v: att.Micheline, collapsed: boolean = false): user_permit => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, user_permit_mich_type);
    }
    return new user_permit(att.mich_to_option(fields[0], x => { return att.mich_to_nat(x); }), att.mich_to_date(fields[1]));
};
export type consumer_key = att.Address;
export type permits_key = att.Address;
export const consumer_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export const permits_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("address", []);
export class permits_value implements att.ArchetypeType {
    constructor(public counter: att.Nat, public user_expiry: att.Option<att.Nat>, public user_permits: Array<[
        att.Bytes,
        user_permit
    ]>) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.counter.to_mich(), att.pair_to_mich([this.user_expiry.to_mich(), att.list_to_mich(this.user_permits, x => {
                    const x_key = x[0];
                    const x_value = x[1];
                    return att.elt_to_mich(x_key.to_mich(), x_value.to_mich());
                })])]);
    }
    equals(v: permits_value): boolean {
        return (this.counter.equals(v.counter) && this.counter.equals(v.counter) && this.user_expiry.equals(v.user_expiry) && JSON.stringify(this.user_permits) == JSON.stringify(v.user_permits));
    }
}
export const permits_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%counter"]),
    att.pair_array_to_mich_type([
        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%user_expiry"]),
        att.pair_to_mich_type("map", att.prim_annot_to_mich_type("bytes", []), att.pair_array_to_mich_type([
            att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%expiry"]),
            att.prim_annot_to_mich_type("timestamp", ["%created_at"])
        ], []))
    ], [])
], []);
export const mich_to_permits_value = (v: att.Micheline, collapsed: boolean = false): permits_value => {
    let fields: att.Micheline[] = [];
    if (collapsed) {
        fields = att.mich_to_pairs(v);
    }
    else {
        fields = att.annotated_mich_to_array(v, permits_value_mich_type);
    }
    return new permits_value(att.mich_to_nat(fields[0]), att.mich_to_option(fields[1], x => { return att.mich_to_nat(x); }), att.mich_to_map(fields[2], (x, y) => [att.mich_to_bytes(x), mich_to_user_permit(y, collapsed)]));
};
export type consumer_container = Array<consumer_key>;
export type permits_container = Array<[
    permits_key,
    permits_value
]>;
export const consumer_container_mich_type: att.MichelineType = att.list_annot_to_mich_type(att.prim_annot_to_mich_type("address", []), []);
export const permits_container_mich_type: att.MichelineType = att.pair_to_mich_type("big_map", att.prim_annot_to_mich_type("address", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("nat", ["%counter"]),
    att.pair_array_to_mich_type([
        att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%user_expiry"]),
        att.pair_to_mich_type("map", att.prim_annot_to_mich_type("bytes", []), att.pair_array_to_mich_type([
            att.option_annot_to_mich_type(att.prim_annot_to_mich_type("nat", []), ["%expiry"]),
            att.prim_annot_to_mich_type("timestamp", ["%created_at"])
        ], []))
    ], [])
], []));
const declare_ownership_arg_to_mich = (candidate: att.Address): att.Micheline => {
    return candidate.to_mich();
}
const claim_ownership_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const pause_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const unpause_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const set_metadata_arg_to_mich = (k: string, d: att.Option<att.Bytes>): att.Micheline => {
    return att.pair_to_mich([
        att.string_to_mich(k),
        d.to_mich()
    ]);
}
const manage_consumer_arg_to_mich = (op: consumer_op): att.Micheline => {
    return op.to_mich();
}
const set_expiry_arg_to_mich = (iv: att.Option<att.Nat>, ip: att.Option<att.Bytes>): att.Micheline => {
    return att.pair_to_mich([
        iv.to_mich(),
        ip.to_mich()
    ]);
}
const set_default_expiry_arg_to_mich = (v: att.Nat): att.Micheline => {
    return v.to_mich();
}
const permit_arg_to_mich = (signer: att.Key, sig: att.Signature, data: att.Bytes): att.Micheline => {
    return att.pair_to_mich([
        signer.to_mich(),
        sig.to_mich(),
        data.to_mich()
    ]);
}
const consume_arg_to_mich = (user: att.Address, data: att.Bytes, err: string): att.Micheline => {
    return att.pair_to_mich([
        user.to_mich(),
        data.to_mich(),
        att.string_to_mich(err)
    ]);
}
const check_arg_to_mich = (signer: att.Key, sig: att.Signature, data: att.Bytes): att.Micheline => {
    return att.pair_to_mich([
        signer.to_mich(),
        sig.to_mich(),
        data.to_mich()
    ]);
}
export class Permits {
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
        const address = await ex.deploy("./contracts/permits.arl", {
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
    async set_metadata(k: string, d: att.Option<att.Bytes>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_metadata", set_metadata_arg_to_mich(k, d), params);
        }
        throw new Error("Contract not initialised");
    }
    async manage_consumer(op: consumer_op, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "manage_consumer", manage_consumer_arg_to_mich(op), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_expiry(iv: att.Option<att.Nat>, ip: att.Option<att.Bytes>, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_expiry", set_expiry_arg_to_mich(iv, ip), params);
        }
        throw new Error("Contract not initialised");
    }
    async set_default_expiry(v: att.Nat, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_default_expiry", set_default_expiry_arg_to_mich(v), params);
        }
        throw new Error("Contract not initialised");
    }
    async permit(signer: att.Key, sig: att.Signature, data: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "permit", permit_arg_to_mich(signer, sig, data), params);
        }
        throw new Error("Contract not initialised");
    }
    async consume(user: att.Address, data: att.Bytes, err: string, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "consume", consume_arg_to_mich(user, data, err), params);
        }
        throw new Error("Contract not initialised");
    }
    async check(signer: att.Key, sig: att.Signature, data: att.Bytes, params: Partial<ex.Parameters>): Promise<any> {
        if (this.address != undefined) {
            return await ex.call(this.address, "check", check_arg_to_mich(signer, sig, data), params);
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
    async get_pause_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "pause", pause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_unpause_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "unpause", unpause_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_metadata_param(k: string, d: att.Option<att.Bytes>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_metadata", set_metadata_arg_to_mich(k, d), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_manage_consumer_param(op: consumer_op, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "manage_consumer", manage_consumer_arg_to_mich(op), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_expiry_param(iv: att.Option<att.Nat>, ip: att.Option<att.Bytes>, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_expiry", set_expiry_arg_to_mich(iv, ip), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_default_expiry_param(v: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_default_expiry", set_default_expiry_arg_to_mich(v), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_permit_param(signer: att.Key, sig: att.Signature, data: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "permit", permit_arg_to_mich(signer, sig, data), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_consume_param(user: att.Address, data: att.Bytes, err: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "consume", consume_arg_to_mich(user, data, err), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_check_param(signer: att.Key, sig: att.Signature, data: att.Bytes, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "check", check_arg_to_mich(signer, sig, data), params);
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
    async get_paused(): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return storage.paused;
        }
        throw new Error("Contract not initialised");
    }
    async get_consumer(): Promise<consumer_container> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const res: Array<att.Address> = [];
            for (let i = 0; i < storage.consumer.length; i++) {
                res.push((x => { return new att.Address(x); })(storage.consumer[i]));
            }
            return res;
        }
        throw new Error("Contract not initialised");
    }
    async get_permits_value(key: permits_key): Promise<permits_value | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.permits), key.to_mich(), permits_key_mich_type), collapsed = true;
            if (data != undefined) {
                return mich_to_permits_value(data, true);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_permits_value(key: permits_key): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(storage.permits), key.to_mich(), permits_key_mich_type), collapsed = true;
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_default_expiry(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_storage(this.address);
            return new att.Nat(storage.default_expiry);
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
        p8: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"p8\"")]),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        p6: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"p6\"")]),
        p4: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"p4\"")]),
        r3: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r3\"")]),
        r2: att.string_to_mich("\"EXPIRY_TOO_BIG\""),
        r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r1\"")]),
        md_r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"md_r1\"")]),
        pausable_r2: att.string_to_mich("\"CONTRACT_NOT_PAUSED\""),
        pausable_r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"pausable_r1\"")]),
        ownership_r1: att.string_to_mich("\"INVALID_CALLER\""),
        CONTRACT_PAUSED: att.string_to_mich("\"CONTRACT_PAUSED\"")
    };
}
export const permits = new Permits();
