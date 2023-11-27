import React from "react";
import "./App.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Layout from "./components/layout/Layout";

const NotLoggedInRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const LoggedInRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="home" element={<div>Home</div>} />
        <Route path="board" element={<div>Board</div>} />
        <Route path="saved" element={<div>Saved</div>} />
        <Route path="*" element={<div>Home</div>} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        {localStorage.getItem("token") ? (
          <LoggedInRoutes />
        ) : (
          <NotLoggedInRoutes />
        )}
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
