import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Admin from "./Admin/Admin.jsx";
import Home from "./Home/Home.jsx";

export default function App() {
  const [store, setStore] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    axios.get(`${apiUrl}/store`).then((response) => {
      setStore(response.data);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route index element={<Home store={store} />} />
        <Route path="/home" element={<Home store={store} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
