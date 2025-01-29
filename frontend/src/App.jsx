import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";
import Admin from "./Admin/Admin.jsx";
import Home from "./Home/Home.jsx";

export default function App() {
  const [store, setStore] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/store").then((response) => {
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

App.propTypes = {
  store: PropTypes.array.isRequired, // store is an array
};
