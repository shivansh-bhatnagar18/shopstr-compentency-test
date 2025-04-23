import { generateSecretKey, getPublicKey, nip04 } from "nostr-tools";

export async function runNostrTest() {
  const sk = generateSecretKey();
  const pk = getPublicKey(sk);

  console.log("Your public key:", pk);

  const recipient = pk;
  const message = "Hello this is a custom test message by shivansh";

  const encrypted = await nip04.encrypt(sk, recipient, message);
  console.log("Encrypted message:", encrypted);

  const decrypted = await nip04.decrypt(sk, pk, encrypted);
  console.log("Decrypted (self):", decrypted);
}
