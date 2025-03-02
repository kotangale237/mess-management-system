import React, { useEffect, useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Initialize QR code scanner
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (result) => {
        handleScan(result);
        scanner.clear(); // Stop scanning after a successful scan
      },
      (error) => {
        console.error("QR Scan Error:", error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  const handleScan = async (result) => {
    try {
      const qrData = JSON.parse(result);
      console.log("Scanned QR Data:", qrData);

      if (qrData.type === "student") {
        const rollNo = qrData.rollNo;

        // Dynamically determine session and date
        const session = determineSession();
        const date = generateDate(); // Plain date to be sent to the backend

        // Send the data to the backend
        await axios.post("api/v1/attendance/record-attendance", { rollNo, session, date });
        setMessage(`Attendance recorded for ${rollNo} (${session})`);
      } else if (qrData.type === "token") {
        const tokenId = qrData.tokenId;

        // Redeem the token
        await axios.post("api/v1/token/redeem-token", { tokenId });
        setMessage(`Token ID ${tokenId} redeemed successfully`);
      } else {
        setMessage("Invalid QR code type");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Display the backend error message
        setMessage(error.response.data.error);
      } else {
        setMessage("Failed to process the QR code");
      }
    }
  };

  // Function to determine the session (morning, afternoon, evening)
  const determineSession = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "morning";
    if (currentHour < 17) return "afternoon";
    return "evening";
  };

  // Function to generate the current date in "YYYY-MM-DD" format
  const generateDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">QR Scanner</h1>
      <div id="qr-reader" className="w-full max-w-md"></div>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default QRScanner;











// import React, { useEffect, useState } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Header from "./Header.jsx";
// import Footer from "./Footer.jsx";

// const QRCodeScanner = () => {
//   const [scanResult, setScanResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false); // New loader state

//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

//     scanner.render(
//       async (decodedText) => {
//         setScanResult(decodedText);
//         setError(null);
//         setSuccessMessage(null);
//         setIsProcessing(true); // Start processing

//         try {
//           let response;

//           if (decodedText.includes("/scan/student/")) {
//             const rollno = decodedText.split("/scan/student/")[1];
//             response = await axios.get(`api/v1/attendance/record-attendance/${rollno}`, {
//               headers: {
//                 Authorization: `Bearer ${Cookies.get("accessToken")}`,
//               },
//               withCredentials: true,
//             });
//           } else if (decodedText.includes("/scan/token/")) {
//             const tokenID = decodedText.split("/scan/token/")[1];
//             response = await axios.get(`api/v1/token/redeem-token/${tokenID}`);
//           } else {
//             throw new Error("Invalid QR code format");
//           }

//           setSuccessMessage(response.data.message);
//         } catch (err) {
//           setError(
//             err.response?.data?.message || err.message || "Scan failed. Try again."
//           );
//         } finally {
//           setIsProcessing(false); // Stop processing
//         }
//       },
//       (errorMessage) => {
//         console.error("QR Scanner Error:", errorMessage);
//         setError("Scanning failed. Try again.");
//       }
//     );

//     return () => scanner.clear();
//   }, []);

//   return (
//     <div id="qr-scanner">
//       <Header />
//       <div id="qr-scanner-div">
//         <h2>Scan QR Code</h2>
//         <div id="reader"></div>

//         {isProcessing && <p>Processing scan, please wait...</p>}
//         {scanResult && <p>Scanned Data: {scanResult}</p>}
//         {error && <p className="error">{error}</p>}
//         {successMessage && <p className="success">{successMessage}</p>}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default QRCodeScanner;


