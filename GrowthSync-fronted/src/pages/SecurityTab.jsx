import React, { useState } from "react";
import { Lock } from "lucide-react";
import styles from "./settings.module.css";

const API_BASE_URL = "http://localhost:5000";

const SecurityTab = ({ onError, onSuccess }) => {
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      onError("New passwords do not match.");
      return;
    }
    
    setSavingPassword(true);
    onError(""); onSuccess("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });
      if (!response.ok) throw new Error("Password update failed. Check current password.");
      onSuccess("Password updated successfully!");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      onError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate}>
      <label className={styles.label}>Current Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.currentPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
      />
      
      <label className={styles.label}>New Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.newPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
      />
      
      <label className={styles.label}>Confirm New Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.confirmPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
      />
      
      <button type="submit" className={styles.button} disabled={savingPassword} style={{ marginTop: 10 }}>
        <Lock size={16} /> {savingPassword ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default SecurityTab;