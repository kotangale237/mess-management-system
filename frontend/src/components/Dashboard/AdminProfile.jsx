import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [content, setContent] = useState("admin-info");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = Cookies.get("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setLoading(false);
    } else {
      navigate("/admin"); // Changed redirect to match correct login route
    }
  }, [navigate]);

  const handleContent = (str) => {
    setContent(str);
  };

  const handleLogout = () => {
    Cookies.remove("admin");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/admin-login"); // Ensure redirect to correct login page
  };

  if (loading) {
    return <p>Loading...</p>; // Added loading state feedback
  }

  return (
    <div>
      <Header />
      <div className="admin-profile-container">
        <h1>Admin Profile</h1>
        {admin && (
          <div className="admin-info">
            <p><strong>Name:</strong> {admin.name}</p>
          </div>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProfile;
