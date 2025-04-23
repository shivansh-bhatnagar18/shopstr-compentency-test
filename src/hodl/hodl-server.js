const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const invoices = {};

app.post("/hodl-invoice", (req, res) => {
  const { amount, memo } = req.body;
  const id = uuidv4();
  const invoice = {
    id,
    amount,
    memo,
    status: "pending",
    bolt11: `lnbc${amount}...fake_invoice_for_${id}`
  };
  invoices[id] = invoice;
  console.log("Created invoice:", invoice);
  res.json(invoice);
});

app.post("/settle/:id", (req, res) => {
  const invoice = invoices[req.params.id];
  if (!invoice) return res.status(404).send("Invoice not found");

  invoice.status = "settled";
  console.log(`Settled invoice ${req.params.id}`);
  res.send("Invoice settled");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🧾 HODL Invoice server running on http://localhost:${PORT}`);
});
