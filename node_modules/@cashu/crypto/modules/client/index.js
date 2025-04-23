"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeBlindedMessage = exports.deserializeProof = exports.serializeProof = exports.constructProofFromPromise = exports.unblindSignature = exports.blindMessage = exports.createRandomBlindedMessage = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/hashes/utils");
const utils_js_1 = require("../util/utils.js");
const index_js_1 = require("../common/index.js");
const NUT11_js_1 = require("./NUT11.js");
function createRandomBlindedMessage(privateKey) {
    return blindMessage((0, utils_1.randomBytes)(32), (0, utils_js_1.bytesToNumber)(secp256k1_1.secp256k1.utils.randomPrivateKey()), privateKey);
}
exports.createRandomBlindedMessage = createRandomBlindedMessage;
function blindMessage(secret, r, privateKey) {
    const Y = (0, index_js_1.hashToCurve)(secret);
    if (!r) {
        r = (0, utils_js_1.bytesToNumber)(secp256k1_1.secp256k1.utils.randomPrivateKey());
    }
    const rG = secp256k1_1.secp256k1.ProjectivePoint.BASE.multiply(r);
    const B_ = Y.add(rG);
    if (privateKey !== undefined) {
        return (0, NUT11_js_1.getSignedOutput)({ B_, r, secret }, privateKey);
    }
    return { B_, r, secret };
}
exports.blindMessage = blindMessage;
function unblindSignature(C_, r, A) {
    const C = C_.subtract(A.multiply(r));
    return C;
}
exports.unblindSignature = unblindSignature;
function constructProofFromPromise(promise, r, secret, key) {
    const A = key;
    const C = unblindSignature(promise.C_, r, A);
    const proof = {
        id: promise.id,
        amount: promise.amount,
        secret,
        C
    };
    return proof;
}
exports.constructProofFromPromise = constructProofFromPromise;
const serializeProof = (proof) => {
    return {
        amount: proof.amount,
        C: proof.C.toHex(true),
        id: proof.id,
        secret: new TextDecoder().decode(proof.secret),
        witness: JSON.stringify(proof.witness)
    };
};
exports.serializeProof = serializeProof;
const deserializeProof = (proof) => {
    return {
        amount: proof.amount,
        C: (0, index_js_1.pointFromHex)(proof.C),
        id: proof.id,
        secret: new TextEncoder().encode(proof.secret),
        witness: proof.witness ? JSON.parse(proof.witness) : undefined
    };
};
exports.deserializeProof = deserializeProof;
const serializeBlindedMessage = (bm, amount) => {
    return {
        B_: bm.B_.toHex(true),
        amount: amount
    };
};
exports.serializeBlindedMessage = serializeBlindedMessage;
//# sourceMappingURL=index.js.map