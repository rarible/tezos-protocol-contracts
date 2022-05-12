const {
    packTyped
} = require('@completium/completium-cli');

exports.mk_payload = (payload) => {
    return packTyped({
        string: `${payload}`,
    }, {
        prim: "string",
    });
};