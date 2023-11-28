import React from "react";
import "./App.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Board from "./pages/board/Board";

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
        <Route path="home" element={<Home />} />
        <Route path="board" element={<Board />} />
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
