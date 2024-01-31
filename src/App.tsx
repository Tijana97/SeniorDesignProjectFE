import React from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Board from "./pages/board/Board";
import Post from "./pages/post/Post";
import Saved from "./pages/saved/Saved";

interface DecodedToken extends JwtPayload {
  _id: string;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return decodedToken.exp! < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

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
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="board" element={<Board />} />
        <Route path="saved" element={<Saved />} />
        <Route path="post/:postId" element={<Post />} />
        <Route path="*" element={<Home />} />
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
