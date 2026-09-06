import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import "./loading.css";

function MainLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/checkToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log("Error checking authentication:", error);
      navigate("/");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  if (loading) {
    return (
      <div className="loading-container">
        <div class="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  return (
    <div className="main-layout" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
export default MainLayout;
