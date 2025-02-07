import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";


const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Initialize the QR code scanner
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      async (decodedText) => {
        setScanResult(decodedText); // Set the result of the scanned QR
        setError(null);
        setSuccessMessage("Processing...");

        try {
          // Check if it's a student attendance scan or a meal token scan
          if (decodedText.includes("/scan/student/")) {
            const rollno = decodedText.split("/scan/student/")[1];

            // Handle student scan logic (e.g., marking attendance)
            const response = await axios.get(`/api/v1/student/scan/${rollno}`, {
              headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
              },
              withCredentials: true,
            });

            setSuccessMessage(response.data.message);
          } else if (decodedText.includes("/scan/token/")) {
            const tokenID = decodedText.split("/scan/token/")[1];

            // Handle meal token scan logic (e.g., validating the token)
            const response = await axios.get(
              `/api/v1/meal/validate/${tokenID}`
            );

            setSuccessMessage(response.data.message);
          } else {
            throw new Error("Invalid QR code format");
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Scan failed. Try again."
          );
          setSuccessMessage(null);
        }
      },
      (errorMessage) => {
        console.error("QR Scanner Error:", errorMessage);
        setError("Scanning failed. Try again.");
      }
    );

    // Cleanup the scanner when the component is unmounted
    return () => scanner.clear();
  }, []);

  return (
    <div id="qr-scanner">
      <Header />
      <div id="qr-scanner-div">
        <h2>Scan QR Code</h2>
        <div id="reader"></div>

        {scanResult && <p>Scanned Data: {scanResult}</p>}
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default QRCodeScanner;

