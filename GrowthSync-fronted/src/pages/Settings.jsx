import React, { useContext } from "react";
import { Settings as SettingsIcon, User, Bell, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { C, font } from "../theme/theme.js";
import { Context } from "../context/AuthContext.jsx";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useContext(Context);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: font }}>
      <h2 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <SettingsIcon color={C.accent} /> Settings
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { icon: User, label: "Account Information" },
          { icon: Bell, label: "Notification Preferences" },
          { icon: Lock, label: "Privacy & Security" },
        ].map((item, i) => (
          <div key={i} style={{ background: C.bgCard, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 15, cursor: "pointer" }}>
            <item.icon size={20} color={C.accent} />
            <span style={{ color: C.textPrimary, fontSize: 14 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{ marginTop: 20, background: "rgba(255, 69, 58, 0.1)", color: "#ff453a", border: "1px solid rgba(255, 69, 58, 0.3)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
};

export default Settings;
