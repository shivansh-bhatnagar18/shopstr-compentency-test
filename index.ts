import { runNostrTest } from "./src/nostr.ts";
import { createAndSpendP2PKToken } from "./src/cashu.ts";
import { runHodlTest } from "./src/hodl.ts";

async function main() {
  console.log("Running Nostr test...");
  await runNostrTest();

  console.log("\nRunning Cashu test...");
  await createAndSpendP2PKToken();

  console.log("\nRunning HODL Invoice test...");
  await runHodlTest();
}

main();
