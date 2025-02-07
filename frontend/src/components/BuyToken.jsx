import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const BuyToken = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handlePayment = async () => {
    if (!name || !amount) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("api/v1/token/buytoken", { name, amount });
      setQrCode(response.data.qrCode);
    } catch (error) {
      setError("Payment failed. Try again.");
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrCode) {
      drawToken();
    }
  }, [qrCode]);

  const drawToken = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 500;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Meal Token", canvas.width / 2, 50);

    // Name
    ctx.font = "20px Arial";
    ctx.fillText(`Name: ${name}`, canvas.width / 2, 100);

    // Amount
    ctx.fillText(`Amount: ₹${amount}`, canvas.width / 2, 140);

    // Load and draw QR code
    const img = new Image();
    img.src = qrCode;
    img.onload = () => {
      ctx.drawImage(img, 100, 180, 200, 200);
    };
  };

  const handleDownloadToken = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "meal_ticket.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Buy Meal Token</h2>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && <p className="error">{error}</p>}

        {qrCode && (
          <div>
            <h3>Meal Token</h3>
            <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
            <br />
            <button onClick={handleDownloadToken}>Download Token</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyToken;
