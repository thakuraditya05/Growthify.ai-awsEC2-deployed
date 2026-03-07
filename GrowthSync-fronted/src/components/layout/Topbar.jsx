import React, { useContext } from "react";
import { Plus, Rocket, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext.jsx";

const Topbar = ({ onCreateProject }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(Context);

  const initials = (user?.name || "GS")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-brand-topbar border-b border-brand-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Rocket className="text-brand-accent" size={20} />
        <span className="text-brand-textPrimary font-bold text-lg tracking-tight">GrowthSync</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onCreateProject} className="flex items-center gap-1.5 bg-brand-accent text-brand-page px-4 py-1.5 rounded-full font-bold text-xs hover:opacity-90">
          <Plus size={16} strokeWidth={3} /> New Project
        </button>
        <div className="flex items-center gap-2 ml-2 border border-brand-border p-1 pr-3 rounded-full">
          <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center text-[10px] font-bold text-brand-accent border border-brand-accent/30">
            {initials}
          </div>
          <span className="text-brand-textSecondary text-xs max-w-[100px] truncate">{user?.name || "Creator"}</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-brand-textSecondary hover:bg-white/5 rounded-lg transition-colors" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
