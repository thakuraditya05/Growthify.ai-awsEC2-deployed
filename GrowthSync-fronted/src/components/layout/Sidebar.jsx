import React from "react";
import { LayoutGrid, TrendingUp, Sparkles, Image, Folder, Calendar, Settings } from "lucide-react";
import { C, font } from "../../theme/theme.js";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Trends", icon: TrendingUp },
  { label: "Content Generator", icon: Sparkles },
  { label: "Thumbnail Studio", icon: Image },
  { label: "Projects", icon: Folder },
  { label: "Schedule", icon: Calendar },
  { label: "Settings", icon: Settings },
];

const Sidebar = ({ activeItem = "Dashboard", onNavigate }) => {
  return (
    <div style={{ width: 210, background: C.bgSidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "16px 10px", flexShrink: 0, fontFamily: font }}>
      <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginBottom: 14, padding: "6px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: `1px solid ${C.border}` }}>
        GrowthSync Storage: 1.2 GB
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          const Icon = item.icon; 
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", transition: "all 0.2s",
                background: isActive ? C.accent : "transparent",
                color: isActive ? C.textDark : C.textSecondary,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default Sidebar;