import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

const StaffProfile = () => {
  const [content, setContent] = useState("user-info");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStaff = Cookies.get("staff");

    if (storedStaff) {
      setUser(JSON.parse(storedStaff));
      setLoading(false);
    } else {
      navigate("/staff"); 
    }
  }, [navigate]);

  const handleContent = (str) => {
    setContent(str); 
  };

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login"); 
  };

  return (
    <div id="user-profile">
      <Header />
      <div id="user-profile-content">
        
      </div>
      <Footer />
    </div>
  );
};

export default StaffProfile;
