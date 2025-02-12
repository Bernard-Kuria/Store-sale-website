import { useState, useEffect } from "react";
import axios from "axios";

import "./Footer.css";

export default function Footer() {
  const [contact, setContact] = useState({ phone: "", email: "" });
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch contact details from the database
  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/contact`); // Use dynamic API URL
        if (response.data) {
          setContact({
            phone: response.data.phone,
            email: response.data.email,
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact details:", error);
      }
    };

    fetchContactDetails();
  }, [apiUrl]);

  return (
    <>
      <footer>
        <h3 className="contact-info">Contact info:</h3>
        <ul>
          <li>Phone number: {contact.phone}</li>
          <li>Email: {contact.email}</li>
        </ul>
      </footer>
    </>
  );
}
