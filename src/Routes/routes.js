import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export const PrivateRoutes = () => {
  const item = localStorage.getItem("user");
  if (!item) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export const PublicRoutes = () => {
  const item = localStorage.getItem("user");
  if (item) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Outlet />;
  }
};
