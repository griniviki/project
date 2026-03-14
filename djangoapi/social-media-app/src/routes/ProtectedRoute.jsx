import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if access token exists in localStorage
  const token = localStorage.getItem("access");

  if (token) {
    // ✅ Token exists → render protected children
    return <>{children}</>;
  }

  // ❌ No token → redirect to login
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;