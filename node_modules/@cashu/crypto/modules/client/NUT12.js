"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDLEQProof_reblind = exports.verifyDLEQProof = void 0;
const index_js_1 = require("../common/index.js");
const utils_1 = require("@noble/curves/abstract/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_js_1 = require("../util/utils.js");
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
const verifyDLEQProof = (dleq, B_, C_, A) => {
    const sG = secp256k1_1.secp256k1.ProjectivePoint.fromPrivateKey((0, utils_1.bytesToHex)(dleq.s));
    const eA = A.multiply((0, utils_js_1.bytesToNumber)(dleq.e));
    const sB_ = B_.multiply((0, utils_js_1.bytesToNumber)(dleq.s));
    const eC_ = C_.multiply((0, utils_js_1.bytesToNumber)(dleq.e));
    const R_1 = sG.subtract(eA); // R1 = sG - eA
    const R_2 = sB_.subtract(eC_); // R2 = sB' - eC'
    const hash = (0, index_js_1.hash_e)([R_1, R_2, A, C_]); // e == hash(R1, R2, A, C')
    return arraysEqual(hash, dleq.e);
};
exports.verifyDLEQProof = verifyDLEQProof;
const verifyDLEQProof_reblind = (secret, // secret
dleq, C, // unblinded e-cash signature point
A // mint public key point
) => {
    if (dleq.r === undefined)
        throw new Error('verifyDLEQProof_reblind: Undefined blinding factor');
    const Y = (0, index_js_1.hashToCurve)(secret);
    const C_ = C.add(A.multiply(dleq.r)); // Re-blind the e-cash signature
    const bG = secp256k1_1.secp256k1.ProjectivePoint.fromPrivateKey(dleq.r);
    const B_ = Y.add(bG); // Re-blind the message
    return (0, exports.verifyDLEQProof)(dleq, B_, C_, A);
};
exports.verifyDLEQProof_reblind = verifyDLEQProof_reblind;
//# sourceMappingURL=NUT12.js.map