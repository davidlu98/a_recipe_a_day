import { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Account from "./Account";
import Journal from "./Journal";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    const tryToLogin = async () => {
      if (token) {
        const response = await axios.get(`${API_URL}/account`, {
          headers: { authorization: token },
        });

        setUser(response.data);
        navigate("/");
      }
    };

    tryToLogin();
  }, []);

  const logout = () => {
    setTimeout(() => setUser(null), 0);
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/account" element={<Account user={user} />} />
        <Route path="/journal" element={<Journal user={user} />} />
        <Route path="/" element={<Home user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
