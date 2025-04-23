"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDLEQProof = void 0;
const index_js_1 = require("../common/index.js");
const utils_1 = require("@noble/curves/abstract/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_js_1 = require("../util/utils.js");
/**
 * !!! WARNING !!! Not recommended for production use, due to non-constant time operations
 * See: https://github.com/cashubtc/cashu-crypto-ts/pull/2 for more details
 * See: https://en.wikipedia.org/wiki/Timing_attack for information about timing attacks.
 */
const createDLEQProof = (B_, a) => {
    const r = (0, utils_1.bytesToHex)((0, index_js_1.createRandomPrivateKey)()); // r <- random
    const R_1 = secp256k1_1.secp256k1.ProjectivePoint.fromPrivateKey(r); // R1 = rG
    const R_2 = B_.multiply((0, utils_js_1.hexToNumber)(r)); // R2 = rB_
    const C_ = B_.multiply((0, utils_js_1.bytesToNumber)(a)); // C_ = aB_
    const A = secp256k1_1.secp256k1.ProjectivePoint.fromPrivateKey((0, utils_1.bytesToHex)(a)); // A = aG
    const e = (0, index_js_1.hash_e)([R_1, R_2, A, C_]); // e = hash(R1, R2, A, C_)
    const n_r = (0, utils_js_1.hexToNumber)(r);
    const n_e = (0, utils_js_1.bytesToNumber)(e);
    const n_a = (0, utils_js_1.bytesToNumber)(a);
    // WARNING: NON-CONSTANT TIME OPERATIONS?
    const s = (0, utils_1.numberToBytesBE)((n_r + n_e * n_a) % secp256k1_1.secp256k1.CURVE.n, 32); // (r + ea) mod n
    return { s, e };
};
exports.createDLEQProof = createDLEQProof;
//# sourceMappingURL=NUT12.js.map