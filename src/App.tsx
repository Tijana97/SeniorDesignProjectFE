import React from "react";
import "./App.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

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
    <Routes>
      <Route path="home" element={<div>Home</div>} />
      <Route path="search" element={<div>Search</div>} />
      <Route path="filter" element={<div>Filter</div>} />
      <Route path="board" element={<div>Board</div>} />
      <Route path="saved" element={<div>Saved</div>} />
      <Route path="post" element={<div>Post</div>} />
      <Route path="*" element={<div>Home</div>} />
    </Routes>
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
