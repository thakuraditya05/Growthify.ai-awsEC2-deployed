import React from "react";
import { Users, Target, FileCheck } from "lucide-react";

const StatsCards = ({ stats, loading }) => {
  const cards = [
    { label: "Total Projects", value: stats?.totalProjects ?? 0, sub: "All Time", icon: Users },
    { label: "Draft + Scheduled", value: (stats?.draftCount ?? 0) + (stats?.scheduledCount ?? 0), sub: "Pipeline", icon: Target },
    { label: "Published", value: stats?.publishedCount ?? 0, sub: "Published This Week: " + (stats?.publishedThisWeek ?? 0), icon: FileCheck },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((stat, i) => (
      <div key={i} className="bg-brand-card border border-brand-border p-5 rounded-2xl hover:border-brand-accent/30 hover:bg-brand-cardHover transition-all group">
        <div className="w-11 h-11 rounded-full bg-brand-accentDim border border-brand-accent/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <stat.icon size={22} className="text-brand-accent" />
        </div>
        <p className="text-brand-textSecondary text-xs mb-1">{stat.label}</p>
        <p className="text-2xl font-bold text-brand-textPrimary">{loading ? "..." : stat.value}</p>
        <p className="text-brand-textSecondary/50 text-[11px] mt-1">{stat.sub}</p>
      </div>
      ))}
    </div>
  );
};

export default StatsCards;
