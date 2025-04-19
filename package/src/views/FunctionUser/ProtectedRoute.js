import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      alert("Chuyển trang...");
      setRedirect(true); // Đặt state để chuyển hướng
    }
  }, [token]);

  if (redirect) {
    return <Navigate to="/login" />; // Chuyển hướng sau khi alert
  }

  return children; // Hiển thị các children nếu có token
};

export default ProtectedRoute;
