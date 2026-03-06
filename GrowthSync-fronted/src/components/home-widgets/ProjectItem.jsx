import React from "react";
import { Youtube, Copy, Minus, ExternalLink } from "lucide-react";

const ProjectItem = ({ project, index }) => {
  // Helper for Badge Styling
  const getBadgeStyling = (dbStatus) => {
    switch (dbStatus) {
      case "published": return { badge: "Live", type: "teal" };
      case "scheduled": return { badge: "Scheduled", type: "teal" };
      case "in-progress": return { badge: "WIP", type: "gray" };
      default: return { badge: "Draft", type: "gray" };
    }
  };

  const style = getBadgeStyling(project.status);


    //   totalProjects,
    //   draftCount,
    //   scheduledCount,
    //   publishedCount,
    //   publishedThisWeek,
    //   recentProjects,


  return (
    <div className="bg-brand-card border border-brand-border p-4 rounded-xl hover:bg-brand-cardHover transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-textPrimary font-bold text-sm truncate w-32">
            {project.title || project.topic || "Untitled Project"}
          </span>
          {index === 0 ? <Copy size={12} className="text-brand-textSecondary/40" /> : <Minus size={12} className="text-brand-textSecondary/40" />}
        </div>
        <ExternalLink size={14} className="text-brand-textSecondary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-textSecondary text-[11px] capitalize">
          {(project.platform === "youtube" || project.platform === "yt") ? (
            <Youtube size={14} />
          ) : (
            <div className="w-2 h-2 rounded-full bg-brand-textSecondary" />
          )}
          {project.status || "draft"}
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            style.type === "teal"
              ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
              : "bg-white/5 text-brand-textSecondary border-white/10"
          }`}
        >
          {style.badge}
        </span>
      </div>
    </div>
  );
};

export default ProjectItem;