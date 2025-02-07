import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import Footer from "../Footer";
import UserCard from "./StudentCard";
import UserContent from "./StudentContent";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [content, setContent] = useState("user-info");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = Cookies.get("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      navigate("/login"); 
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <UserCard
              user={user}
              content={content}
              handleContent={handleContent}
              handleLogout={handleLogout}
            />
            <UserContent content={content} user={user} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
