import axios from "axios";
import { useState } from "react";
import "./EditContact.css";

export default function EditContact() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const updateContact = async () => {
    try {
      await axios.put("http://localhost:5000/contact", { phone, email });
      alert("Contact details updated successfully!");
    } catch (error) {
      alert("Failed to update contact details.");
      console.error(error);
    }
  };

  return (
    <div className="contact-edit">
      <div className="edit-contact-title">EDIT YOUR CONTACT DETAILS</div>
      <h4 className="edit-phone-heading">Edit Phone Number:</h4>
      <input
        type="text"
        placeholder="phone contact"
        className="new-phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <h4 className="edit-email-heading">Edit Email:</h4>
      <input
        type="text"
        placeholder="enter email"
        className="new-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="set" onClick={updateContact}>
        SET
      </button>
    </div>
  );
}
