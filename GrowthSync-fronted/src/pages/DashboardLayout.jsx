import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { C, font } from "../theme/theme.js";

import Topbar from "../components/layout/Topbar.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";

import Home from "./Home.jsx";
import Trends from "./Trends/Trends.jsx";
import Saves from "./Saves.jsx";
import ContentGenerator from "./ContentGenerator/ContentGenerator.jsx";
import Projects from "./Projects/Projects.jsx";
import Schedule from "./Schedule.jsx";
import Settings from "./Settings.jsx";
import ThumbnailStudio from "./ThumbnailStudio/ThumbnailStudio.jsx";
import ProjectWorkspace from "./ProjectWorkspace.jsx";

const DashboardLayout = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [workspaceProjectId, setWorkspaceProjectId] = useState("");
  const [linkedProjectId, setLinkedProjectId] = useState("");
  const [contentGeneratorData, setContentGeneratorData] = useState({
    topic: "",
    platform: "youtube",
  });

  const createProject = async () => {
    try {
      const response = await axios.post("/api/projects");
      const newProjectId = response.data?._id || "";
      setWorkspaceProjectId(newProjectId);
      setActiveNav("Project Workspace");
      toast.success("New project created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Project creation failed");
    }
  };

  const handleNavigate = (nav) => {
    setActiveNav(nav);
    if (nav !== "Content Generator" && nav !== "Thumbnail Studio") {
      setLinkedProjectId("");
    }
  };

  const openContentForProject = (projectId) => {
    setLinkedProjectId(projectId);
    setActiveNav("Content Generator");
  };

  const openThumbnailForProject = (projectId) => {
    setLinkedProjectId(projectId);
    setActiveNav("Thumbnail Studio");
  };

  const openProjectWorkspace = (projectId) => {
    setWorkspaceProjectId(projectId);
    setActiveNav("Project Workspace");
  };

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return (
          <Home
            onNavigate={handleNavigate}
            onProjectClick={openProjectWorkspace}
          />
        );
      case "Trends":
        return <Trends />;
      case "Saves":
        return <Saves onAddToProject={handleAddToProject} />;
      case "Content Generator":
        return (
          <ContentGenerator
            linkedProjectId={linkedProjectId}
            generatorData={contentGeneratorData}
            onDataUsed={() =>
              setContentGeneratorData({ topic: "", platform: "youtube" })
            }
          />
        );
      case "Thumbnail Studio":
        return <ThumbnailStudio linkedProjectId={linkedProjectId} />;
      case "Projects":
        return <Projects />;
      case "Project Workspace":
        return (
          <ProjectWorkspace
            projectId={workspaceProjectId}
            onGoToContent={openContentForProject}
            onGoToThumbnail={openThumbnailForProject}
          />
        );
      case "Schedule":
        return <Schedule />;
      case "Settings":
        return <Settings />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bgPage,
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Topbar onCreateProject={createProject} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activeItem={activeNav} onNavigate={handleNavigate} />
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
