// UserRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import Home from "../User/Home.js";

/***** Pages ****/

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
    </>
  );
};

export default UserRoutes;
