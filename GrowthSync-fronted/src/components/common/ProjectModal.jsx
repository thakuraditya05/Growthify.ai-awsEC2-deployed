import React, { useEffect, useState } from "react";
import { X, Calendar, Edit3, Download, Trash2, Loader2, Save } from "lucide-react";
import axios from "axios";
import { C } from "../../theme/theme.js";
import styles from "../../pages/Projects/Projects.module.css";
import { getStatusStyle, getPlatformIcon, getPlatformId } from "../../constants/projectConstants.jsx";

const ProjectModal = ({ project, onClose, refreshProjects }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState(project);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    platform: project?.platform || "",
    status: project?.status || "draft",
    niche: project?.niche || "",
    hook: project?.hook || "",
    description: project?.description || "",
    script: project?.script || "",
    hashtags: Array.isArray(project?.hashtags) ? project.hashtags.join(" ") : "",
    thumbnailUrl: project?.thumbnailUrl || "",
  });

  useEffect(() => {
    if (!project) return;
    setProjectData(project);
    setFormData({
      title: project?.title || "",
      platform: project?.platform || "",
      status: project?.status || "draft",
      niche: project?.niche || "",
      hook: project?.hook || "",
      description: project?.description || "",
      script: project?.script || "",
      hashtags: Array.isArray(project?.hashtags) ? project.hashtags.join(" ") : "",
      thumbnailUrl: project?.thumbnailUrl || "",
    });
    setIsEditing(false);
  }, [project]);

  if (!projectData) return null;

  const statusInfo = getStatusStyle(projectData.status);
  const platformId = getPlatformId(projectData.platform);
  const formattedDate = new Date(projectData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hasThumbnail = Boolean(projectData.thumbnailUrl);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: projectData.title || "",
      platform: projectData.platform || "",
      status: projectData.status || "draft",
      niche: projectData.niche || "",
      hook: projectData.hook || "",
      description: projectData.description || "",
      script: projectData.script || "",
      hashtags: Array.isArray(projectData.hashtags) ? projectData.hashtags.join(" ") : "",
      thumbnailUrl: projectData.thumbnailUrl || "",
    });
  };

  const handleDownload = () => {
    if (!projectData.thumbnailUrl) {
      alert("No thumbnail generated to download!");
      return;
    }

    const link = document.createElement("a");
    link.href = projectData.thumbnailUrl;
    link.download = `${(projectData.title || "Project").replace(/\s+/g, "_")}_Thumbnail.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    if (!projectData._id) return;

    try {
      setIsSaving(true);
      const payload = {
        title: formData.title,
        platform: formData.platform,
        status: formData.status,
        niche: formData.niche,
        hook: formData.hook,
        description: formData.description,
        script: formData.script,
        thumbnailUrl: formData.thumbnailUrl,
        hashtags: formData.hashtags
          .split(" ")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await axios.put(`/api/projects/${projectData._id}`, payload);
      setProjectData(response.data);
      await refreshProjects();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to save project changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectData._id) {
      alert("This is a demo project and cannot be deleted from the database.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this project? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/projects/${projectData._id}`);
      onClose();
      refreshProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}><X size={20} /></button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ background: "#0f1923", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {hasThumbnail ? (
                <img src={projectData.thumbnailUrl} alt="Thumbnail Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: C.textSecondary, fontSize: 14, fontWeight: 600 }}>
                  No thumbnail
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className={styles.actionBtnSecondary} onClick={handleDownload} style={{ flex: 1.2 }}>
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => {
                  if (isEditing) {
                    resetForm();
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
                style={{ flex: 1, background: C.accentDim, color: C.accent, border: `1px solid ${C.borderAccent}`, padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}
              >
                <Edit3 size={16} /> {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ flex: 1, background: "rgba(255, 69, 58, 0.1)", color: "#ff453a", border: "1px solid rgba(255, 69, 58, 0.3)", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: isDeleting ? "not-allowed" : "pointer", fontWeight: 600 }}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete
              </button>
            </div>
          </div>

          <div style={{ maxHeight: "520px", overflowY: "auto", paddingRight: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              {getPlatformIcon(platformId, 28)}
              {isEditing ? (
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Project title"
                  style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px", fontSize: 18, fontWeight: 700 }}
                />
              ) : (
                <h2 style={{ color: C.textPrimary, fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  {projectData.title || projectData.topic || "Untitled Project"}
                </h2>
              )}
            </div>

            <div style={{ background: C.bgSidebar, padding: 18, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: C.textSecondary }}>Target Platform:</span>
                {isEditing ? (
                  <input
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    style={{ background: C.bgPage, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 6, padding: "4px 8px", width: 130, textTransform: "capitalize" }}
                  />
                ) : (
                  <span style={{ color: C.textPrimary, fontWeight: 600, textTransform: "capitalize" }}>{projectData.platform || "Web"}</span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: C.textSecondary }}>Current Status:</span>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ background: C.bgPage, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 6, padding: "4px 8px" }}
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                ) : (
                  <span style={{ color: statusInfo.color, fontWeight: 700 }}>{statusInfo.label}</span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: C.textSecondary }}>Content Niche:</span>
                {isEditing ? (
                  <input
                    name="niche"
                    value={formData.niche}
                    onChange={handleInputChange}
                    style={{ background: C.bgPage, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 6, padding: "4px 8px", width: 130 }}
                  />
                ) : (
                  <span style={{ color: C.textPrimary, fontWeight: 500 }}>{projectData.niche || "General"}</span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: C.textSecondary }}>Date Created:</span>
                <span style={{ color: C.textPrimary, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} color={C.accent} /> {formattedDate}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ color: C.textPrimary, margin: "0 0 10px 0", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <Edit3 size={16} color={C.accent} /> Script / Overview
              </h4>
              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    name="hook"
                    value={formData.hook}
                    onChange={handleInputChange}
                    placeholder="Hook"
                    style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px" }}
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows={3}
                    style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px", resize: "vertical" }}
                  />
                  <textarea
                    name="script"
                    value={formData.script}
                    onChange={handleInputChange}
                    placeholder="Script"
                    rows={6}
                    style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px", resize: "vertical" }}
                  />
                  <input
                    name="hashtags"
                    value={formData.hashtags}
                    onChange={handleInputChange}
                    placeholder="#hashtag1 #hashtag2"
                    style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px" }}
                  />
                  <input
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="Thumbnail URL"
                    style={{ width: "100%", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "8px 10px" }}
                  />
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ alignSelf: "flex-start", background: C.accent, color: C.textDark, border: "none", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                  </button>
                </div>
              ) : (
                <div style={{ color: C.textSecondary, fontSize: 13.5, lineHeight: 1.6, background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap" }}>
                  {(projectData.hook ? `${projectData.hook}\n\n` : "") + (projectData.script || projectData.description || "No script generated yet. Use the AI Content Generator.")}
                </div>
              )}
            </div>

            {!isEditing && projectData.hashtags && projectData.hashtags.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ color: C.textPrimary, margin: "0 0 10px 0", fontSize: 13 }}>Tags</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {projectData.hashtags.map((tag, idx) => (
                    <span key={idx} style={{ background: C.bgSidebar, color: C.textSecondary, padding: "4px 10px", borderRadius: 50, fontSize: 11, border: `1px solid ${C.border}` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
