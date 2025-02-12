import axios from "axios";
import { useState } from "react";
import "./EditPassword.css";

export default function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updatePassword = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/admin/password`, {
        currentPassword,
        newPassword, // Send both current and new password for updating
      });
      alert("Password updated successfully!");
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to update password.");
      }
      console.error(error);
    }
  };

  return (
    <div className="password-edit">
      <div className="edit-password-header">EDIT YOUR PASSWORD DETAILS</div>
      <div className="item-field">
        <label className="edit-password-title">
          Please enter your current password:
        </label>
        <input
          type="text"
          placeholder="current password"
          className="old-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="item-field">
        <label className="edit-password-title">Enter New Password:</label>
        <input
          type="text"
          placeholder="new password"
          className="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button className="enter" onClick={updatePassword}>
        ENTER
      </button>
    </div>
  );
}
