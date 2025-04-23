import axios from "axios";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runHodlTest() {
  try {
    const res = await axios.post("http://localhost:3001/hodl-invoice", {
      amount: 1000,
      memo: "Test HODL Invoice"
    });

    const invoice = res.data;
    if (!invoice?.id) throw new Error("Invoice ID missing");

    console.log("Created HODL Invoice:", invoice);

    console.log("Waiting to settle...");
    await delay(5000);

    await axios.post(`http://localhost:3001/settle/${invoice.id}`);
    console.log("Invoice settled");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error interacting with HODL invoice server:", err.message);
    } else {
      console.error("Error interacting with HODL invoice server:", err);
    }
  }
}

// Run it directly
runHodlTest();
