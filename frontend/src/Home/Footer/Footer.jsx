import { useState, useEffect } from "react";
import axios from "axios";

export default function Footer() {
  const [contact, setContact] = useState({ phone: "", email: "" });
  // Fetch contact details from the database
  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/contact");
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
  }, []);

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
