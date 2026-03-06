import React from "react";
import { Heart, MessageSquare, TrendingUp, Bookmark, Plus } from "lucide-react";
import { C } from "../../theme/theme.js";
import styles from "../../pages/Trends/Trends.module.css";

const TrendCard = ({ trend, icon }) => (
  <div className={styles.trendCard}>
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
      {icon}
      <h3 style={{ color: C.textPrimary, fontSize: 16.5, fontWeight: 700, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {trend.title}
      </h3>
    </div>
    
    <div style={{ background: "#00E6C3", color: C.textDark, padding: "3px 12px", borderRadius: 50, fontSize: 10.5, display: "inline-block" }}>
      Trend Score: <strong>{trend.score || 90}/100</strong>
    </div>
    
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "14px 0", color: C.textSecondary, fontSize: 12.5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Heart size={14} /> {trend.likes}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageSquare size={14} /> {trend.comments}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><TrendingUp size={14} /> {trend.growth || "+50%"}</div>
    </div>

    <p style={{ color: C.textMuted, fontSize: 11, lineHeight: "1.4", margin: "14px 0 0 0" }}>
      Keywords:<br />
      <span style={{color: C.textSecondary, fontStyle: "italic"}}>
        {trend.tags ? trend.tags.join(" ") : "#trending"}
      </span>
    </p>

    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      <button className={styles.saveBtn}> <Bookmark size={15} /> Save </button>
      <button className={styles.projectBtn}> <Plus size={15} /> Add to Project </button>
    </div>
  </div>
);

export default TrendCard;