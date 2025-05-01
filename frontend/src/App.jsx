import { useState, useEffect } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // const API_URL = import.meta.env.VITE_BACKEND_URL;

  // useEffect(() => {
  //   const token = window.localStorage.getItem("token");

  //   const tryToLogin = async () => {
  //     if (token) {
  //       const response = await axios.get(`${API_URL}/account`, {
  //         headers: { authorization: token },
  //       });

  //       setUser(response.data);
  //       navigate("/");
  //     }
  //   };

  //   tryToLogin();
  // }, []);

  // const logout = () => {
  //   setTimeout(() => setUser(null), 0);
  //   window.localStorage.removeItem("token");
  //   navigate("/");
  // };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;

{
  /* <Route path="/account" element={<Account user={user} />} />
<Route path="/players/:region/:name" element={<PlayerPage />} />
<Route
  path="/write-review/:region/:playerName/:playerId"
  element={<CreateReview />}
/>
<Route
  path="/report-review/:region/:playerName/:reviewId"
  element={<ReportReview />}
/> */
}
