import mongoose from "mongoose";
import QRCode from "qrcode";
import {contract} from "../utils/MessAttendanceContract.js"
import { ethers } from "ethers"; 

// Function to purchase a token
const purchaseToken = async (req, res) => {
  const { numPeople } = req.body;

  // Validate numPeople to avoid invalid input
  if (!numPeople || numPeople <= 0) {
    return res.status(400).json({ success: false, message: "Invalid number of people" });
  }

  try {
    const tx = await contract.purchaseToken(numPeople);
    await tx.wait(); // Wait for transaction confirmation

    res.json({
      success: true,
      message: "Token purchased successfully",
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Function to redeem a token
const redeemToken = async (req, res) => {
  const { tokenId } = req.body;

  // Validate tokenId to ensure it’s a positive integer
  if (!tokenId || tokenId <= 0) {
    return res.status(400).json({ success: false, message: "Invalid token ID" });
  }

  try {
    const tx = await contract.redeemToken(tokenId);
    await tx.wait(); // Wait for transaction confirmation

    res.json({
      success: true,
      message: "Token redeemed successfully",
      txHash: tx.hash
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


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
    buytoken,
    purchaseToken,
    redeemToken,
}