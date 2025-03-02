import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints from the API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("api/v1/complaint/complaints");
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load complaints. Please try again later.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div id="complaints-page">
      <Header />
      <h2 className="text-4xl">Complaints</h2>
      <hr />

      {loading && <p>Loading complaints...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && complaints.length === 0 && <p>No complaints found.</p>}

      {!loading && complaints.length > 0 && (
        <div className="complaint-list">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <h3>Complaint ID: {complaint.id}</h3>
              <p><strong>Category:</strong> {complaint.category}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Complaint was registered on:</strong> {new Date(complaint.timestamp).toLocaleString()}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ComplaintList