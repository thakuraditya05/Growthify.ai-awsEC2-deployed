import React, { useEffect, useState } from "react";
import { Edit3, LogOut } from "lucide-react";
import styles from "./settings.module.css";

const API_BASE_URL = "http://localhost:5000";

const AccountTab = ({ isOpen, onError, onSuccess }) => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [accountMode, setAccountMode] = useState("view"); 
  const [verifyPassword, setVerifyPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  // Reset states when tab is closed
  useEffect(() => {
    if (!isOpen) {
      setAccountMode("view");
      setVerifyPassword("");
      setNewName(userData.name);
    }
  }, [isOpen, userData.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/me`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to load profile.");
        const data = await response.json();
        setUserData({ name: data?.name || "", email: data?.email || "" });
        setNewName(data?.name || "");
      } catch (err) {
        onError("Could not load user data.",err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [onError]);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    onError(""); onSuccess("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/verify-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ password: verifyPassword }),
      });
      if (!response.ok) throw new Error("Incorrect password.");
      setAccountMode("edit");
      setVerifyPassword("");
    } catch (err) {
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    onError(""); onSuccess("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/update-name`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error("Update failed.");
      onSuccess("Name updated successfully! Reloading...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      onError(err.message);
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const cancelEdit = () => {
    setAccountMode("view");
    setVerifyPassword("");
    setNewName(userData.name);
    onError("");
  };

  if (loadingProfile) return <p className={styles.label}>Loading details...</p>;

  return (
    <>
      {accountMode === "view" && (
        <div>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Name</div>
                <div className={styles.infoText}>{userData.name}</div>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoText}>{userData.email}</div>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Password</div>
                <div className={styles.infoText}>********</div>
              </div>
            </div>
          </div>
          <div className={styles.btnGroup}>
            <button onClick={() => setAccountMode("verify")} className={styles.button}>
              <Edit3 size={16} /> Change Name
            </button>
            <button onClick={handleLogout} className={`${styles.button} ${styles.buttonDanger}`}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {accountMode === "verify" && (
        <form onSubmit={handleVerifyPassword}>
          <label className={styles.label}>Enter current password to continue</label>
          <input
            className={styles.input} type="password" placeholder="Current Password"
            value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)}
            autoFocus required
          />
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.button} disabled={isProcessing}>
              {isProcessing ? "Verifying..." : "Verify"}
            </button>
            <button type="button" onClick={cancelEdit} className={`${styles.button} ${styles.buttonSecondary}`}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {accountMode === "edit" && (
        <form onSubmit={handleNameUpdate}>
          <label className={styles.label}>Update Name</label>
          <input
            className={styles.input} type="text" placeholder="New User Name"
            value={newName} onChange={(e) => setNewName(e.target.value)}
            autoFocus required
          />
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.button} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={cancelEdit} className={`${styles.button} ${styles.buttonSecondary}`}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AccountTab;