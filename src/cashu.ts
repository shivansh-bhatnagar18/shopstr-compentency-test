import axios from "axios";
import { CashuMint, CashuWallet, getEncodedTokenV4, MintQuoteState } from '@cashu/cashu-ts';
import * as crypto from 'crypto';

function generateKeypair() {
  let privateKey: Buffer;
  do {
    privateKey = crypto.randomBytes(32);
  } while (!isValidPrivateKey(privateKey));
  const publicKey = getPublicKey(privateKey);
  return {
    privateKey: privateKey.toString('hex'),
    publicKey: publicKey.toString('hex')
  };
}

function isValidPrivateKey(privateKey: Buffer): boolean {
  const maxKey = Buffer.from(
    "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
    "hex"
  );
  return privateKey.length === 32 && privateKey.compare(maxKey) < 0 && privateKey.compare(Buffer.alloc(32)) > 0;
}

function getPublicKey(privateKey: Buffer): Buffer {
  const curve = crypto.createECDH("secp256k1");
  curve.setPrivateKey(privateKey);
  return curve.getPublicKey(null, "compressed");
}

export async function createAndSpendP2PKToken() {
  try {
    const mintUrl = "https://testnut.cashu.space";
    const mint = new CashuMint(mintUrl);
    const senderWallet = new CashuWallet(mint);
    const receiverWallet = new CashuWallet(mint);
    await senderWallet.loadMint();
    await receiverWallet.loadMint();
    const receiverKeypair = generateKeypair();
    const mintAmount = 100;
    const mintQuote = await senderWallet.createMintQuote(mintAmount);
    const checkedQuote = await senderWallet.checkMintQuote(mintQuote.quote);

    if (checkedQuote.state !== MintQuoteState.PAID) {
      console.log("Assuming invoice is paid for test environment.");
    }

    const proofs = await senderWallet.mintProofs(mintAmount, mintQuote.quote);
    const lockAmount = 50;
    const nonce = crypto.randomBytes(16).toString('hex');
    const p2pkSecret = [
      "P2PK", 
      {
        "nonce": nonce,
        "data": receiverKeypair.publicKey,
        "tags": [["sigflag", "SIG_INPUTS"]]
      }
    ];
    const secretString = JSON.stringify(p2pkSecret);
    const { send: lockedProofs, keep: remainingProofs } = await senderWallet.send(
      lockAmount, 
      proofs,
      {
        privkey: secretString
      }
    );
    const encodedToken = getEncodedTokenV4(
      { mint: mintUrl, proofs: lockedProofs }
    );

    try {
      const receivedProofs = await receiverWallet.receive(
        encodedToken,
        {
          privkey: receiverKeypair.privateKey
        }
      );
      console.log("Token spent successfully!");
    } catch (error) {
      console.error("Failed to spend token:", error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
