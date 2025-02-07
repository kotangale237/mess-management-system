import mongoose from "mongoose";
import QRCode from "qrcode";


const buytoken =  async (req, res) => {
    try {
      const { name, amount } = req.body;
  
      if (!name || !amount) {
        return res.status(400).json({ error: "Name and amount are required." });
      }
  
      // Simulated payment processing (Fake Success Response)
      const paymentId = "FAKE_PAYMENT_" + Math.floor(Math.random() * 100000);
      const transactionDetails = `Payment ID: ${paymentId}, Name: ${name}, Amount: ₹${amount}`;
  
      // Generate QR Code with transaction details
      const qrCode = await QRCode.toDataURL(transactionDetails);
  
      return res.json({ success: true, paymentId, qrCode });
    } catch (error) {
      console.error("Payment Processing Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}

export{
    buytoken
}