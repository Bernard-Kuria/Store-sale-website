import axios from "axios";
import { useState } from "react";
import "./EditContact.css";

export default function EditContact() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const updateContact = async () => {
    try {
      await axios.put(`${apiUrl}/contact`, { phone, email });
      alert("Contact details updated successfully!");
    } catch (error) {
      alert("Failed to update contact details.");
      console.error(error);
    }
  };

  return (
    <div className="contact-edit">
      <div className="edit-contact-title">EDIT YOUR CONTACT DETAILS</div>
      <div className="item-field">
        <label className="edit-phone-heading">Edit Phone Number:</label>
        <input
          type="text"
          placeholder="phone contact"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="item-field">
        <label className="edit-email-heading">Edit Email:</label>
        <input
          type="text"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="set" onClick={updateContact}>
        SET
      </button>
    </div>
  );
}
