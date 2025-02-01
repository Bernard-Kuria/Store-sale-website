import axios from "axios";
import { useState } from "react";
import "./EditPassword.css";

export default function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const updatePassword = async () => {
    try {
      await axios.put(`${apiUrl}/admin/password`, {
        currentPassword,
        newPassword,
      }); // Use dynamic API URL
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
      <h4 className="edit-password-title">
        Please enter your current password:
      </h4>
      <input
        type="text"
        placeholder="current password"
        className="old-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <h4 className="edit-password-title">Enter New Password:</h4>
      <input
        type="text"
        placeholder="new password"
        className="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button className="enter" onClick={updatePassword}>
        ENTER
      </button>
    </div>
  );
}
