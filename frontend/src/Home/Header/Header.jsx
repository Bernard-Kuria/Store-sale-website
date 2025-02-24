import PropTypes from "prop-types"; // Import PropTypes for validation
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import logo from "../../assets/logo.jpg";
import "./Header.css";

export default function Header({ setDisplayScroll, scrollContact }) {
  const [admin, setAdmin] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordFetched, setPasswordFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const showStickyHeader = function (entries, observer) {
      const [entry] = entries;

      if (!entry.isIntersecting) {
        document.querySelector(".sticky-header").classList.add("sticky");
        document.querySelector(".sticky-logo").classList.remove("hidden");
      } else {
        document.querySelector(".sticky-header").classList.remove("sticky");
        document.querySelector(".sticky-logo").classList.add("hidden");
      }
    };

    const obsOptions = {
      root: null,
      threshold: 0,
    };

    const headerObserver = new IntersectionObserver(
      showStickyHeader,
      obsOptions
    );
    headerObserver.observe(document.querySelector("header"));
  }, []);

  // Fetch password from the database
  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/admin/password`);
        if (response.ok) {
          setPasswordFetched(true); // Set fetched status
        } else {
          console.warn("Failed to connect to password endpoint.");
        }
      } catch (error) {
        console.error("Error fetching password endpoint:", error);
      }
    };

    fetchPassword();
  }, []);

  // Check password
  async function checkPassword(e) {
    e.preventDefault();

    if (!passwordFetched) {
      console.log("Password is still being fetched...");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/admin/password`, {
        currentPassword: inputPassword,
      });

      if (response.status === 200) {
        console.log("Password matched, navigating to admin page.");
        navigate("/admin");
        setAdmin(false);
      }
    } catch (error) {
      console.error("Password validation failed:", error);
      document.querySelector(".error-message").classList.remove("hidden");
    }
  }

  return (
    <>
      <div
        className="sticky-header sticky"
        style={{ backgroundColor: "black" }}
      >
        <img className="sticky-logo hidden" src={logo} alt="logo" />
        <h2 className="title">KICKS N SOLES</h2>
        <button
          className="admin"
          style={{ color: "white" }}
          onClick={() => setAdmin(true)}
        >
          ADMIN
        </button>
        <button className="contact" onClick={() => scrollContact(true)}>
          CONTACT US
        </button>
      </div>
      {admin === true ? (
        <PasswordPopUp
          checkPassword={checkPassword}
          inputPassword={inputPassword}
          setInputPassword={setInputPassword}
          setAdmin={setAdmin}
        />
      ) : null}
      <header>
        <img className="full-view-logo" src={logo} alt="logo" />
        <h1 className="slogan">Your haven for the finest kicks</h1>
        <h2 className="call-to-action">
          Explore our store to take your shoe-game a step higher
        </h2>
        <button className="scroll" onClick={() => setDisplayScroll(true)}>
          Click to scroll
        </button>
      </header>
    </>
  );
}

Header.propTypes = {
  setDisplayScroll: PropTypes.func.isRequired,
  scrollContact: PropTypes.func.isRequired,
};

function PasswordPopUp({
  checkPassword,
  inputPassword,
  setInputPassword,
  setAdmin,
}) {
  return (
    <>
      <form className="password-popup">
        <h4 className="password-prompt">
          Please enter Password
          <div className="cancel" onClick={() => setAdmin(false)}>
            &times;
          </div>
        </h4>

        <input
          type="text"
          placeholder="password..."
          className="password-input"
          name="password-input"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button className="password-submit-btn" onClick={checkPassword}>
          Enter
        </button>
        <div
          className="error-message hidden"
          style={{ color: "red", fontSize: "0.8em" }}
        >
          *wrong password*
        </div>
      </form>
    </>
  );
}

PasswordPopUp.propTypes = {
  checkPassword: PropTypes.func.isRequired,
  inputPassword: PropTypes.string.isRequired,
  setInputPassword: PropTypes.func.isRequired,
  setAdmin: PropTypes.func.isRequired,
};
