import React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { C, font } from "../theme/theme.js";

const Schedule = () => (
  <div style={{ fontFamily: font }}>
    <h2 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <CalendarIcon color={C.accent} /> Content Schedule
    </h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} style={{ background: C.bgCard, padding: 15, borderRadius: 10, textAlign: "center", border: `1px solid ${C.border}` }}>
          <span style={{ color: C.textSecondary, fontSize: 12 }}>{day}</span>
        </div>
      ))}
    </div>
    <p style={{ color: C.textMuted, marginTop: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
      <Clock size={14} /> Next post scheduled for Monday at 10:00 AM.
    </p>
  </div>
);
export default Schedule;