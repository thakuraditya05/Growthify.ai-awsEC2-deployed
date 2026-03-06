import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Plus, Download, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";
import { C, font } from "../../theme/theme.js";
import styles from "./ThumbnailStudio.module.css";
import useProjects from "../../hooks/useProjects.js";

const ThumbnailStudio = ({ linkedProjectId = "" }) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    title: "",
    mood: "Dramatic",
    colorPreference: "",
    userDescription: ""
  });
  
  // --- UI State ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saveMode, setSaveMode] = useState("new");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const { projects, loading: projectsLoading } = useProjects();
  const isLinkedMode = Boolean(linkedProjectId);

  useEffect(() => {
    if (!linkedProjectId) return;
    setSaveMode("existing");
    setSelectedProjectId(linkedProjectId);
  }, [linkedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) return;
    const selectedProject = projects.find((project) => project._id === selectedProjectId);
    if (!selectedProject) return;

    setFormData((prev) => ({
      ...prev,
      title: selectedProject.title?.trim() || selectedProject.topic?.trim() || prev.title,
    }));
  }, [selectedProjectId, projects]);
  
  const fileInputRef = useRef(null);

  // --- Mock Project Context (Can be passed as props later) ---
  const projectContext = {
    name: "AI Workforce Future",
    title: formData.title || "Enter a title to begin...",
    platform: "YouTube"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedPhoto(imageUrl);
    }
  };

  const handleGenerateThumbnail = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Title is required to generate a thumbnail.");
      return;
    }
    if ((isLinkedMode || saveMode === "existing") && !selectedProjectId && !linkedProjectId) {
      setErrorMsg("Please select an existing project.");
      return;
    }

    setErrorMsg("");
    setIsGenerating(true);

    try {
      // Send data to your backend endpoint
      const payload = {
        title: formData.title,
        mood: formData.mood,
        colorPreference: formData.colorPreference,
        userDescription: formData.userDescription,
        createNew: isLinkedMode ? false : saveMode === "new",
      };

      if (isLinkedMode || saveMode === "existing") payload.projectId = selectedProjectId || linkedProjectId;

      const response = await axios.post('/api/ai/generate-thumbnail', payload);

      if (response.data && response.data.thumbnailUrl) {
        setGeneratedThumbnail(response.data.thumbnailUrl);
      } else {
        setErrorMsg("Failed to retrieve thumbnail URL from the server.");
      }
    } catch (error) {
      console.error("Thumbnail generation error:", error);
      setErrorMsg(error.response?.data?.message || "An error occurred while generating the thumbnail.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedThumbnail) return;
    const link = document.createElement('a');
    link.href = generatedThumbnail;
    link.download = `GrowthSync_${formData.title || 'Thumbnail'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ fontFamily: font, animation: "fadeIn 0.3s ease", padding: "20px" }}>
      <div className={styles.studioGrid}>
        
        {/* --- LEFT PANEL: INPUT CONTROLS --- */}
        <div className={styles.leftPanel}>
          <div className={styles.contextCard}>
            <h3 style={{ color: C.textPrimary, fontSize: 16, marginBottom: 16 }}>Project Details</h3>
            
            <form onSubmit={handleGenerateThumbnail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Title Input */}
              <div>
                <label style={{ display: 'block', color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>Video Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AI is Replacing Jobs" 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary }}
                  required
                />
              </div>

              {/* Mood Select */}
              <div>
                <label style={{ display: 'block', color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>Mood</label>
                <select 
                  name="mood"
                  value={formData.mood}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary }}
                >
                  <option value="Dramatic">Dramatic</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Vibrant">Vibrant & Exciting</option>
                  <option value="Dark & Mysterious">Dark & Mysterious</option>
                  <option value="Corporate/Professional">Corporate/Professional</option>
                </select>
              </div>

              {/* Color Preference */}
              <div>
                <label style={{ display: 'block', color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>Color Preference</label>
                <input 
                  type="text" 
                  name="colorPreference"
                  value={formData.colorPreference}
                  onChange={handleInputChange}
                  placeholder="e.g., Neon Green and Black" 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary }}
                />
              </div>

              {/* Additional Description */}
              <div >
                <label style={{ display: 'block', color: C.textSecondary, fontSize: 13, marginBottom: 6 }} >Visual Elements</label>
                <textarea 
                  name="userDescription"
                  value={formData.userDescription}
                  className={styles.mainContainer}
                  onChange={handleInputChange}
                  placeholder="Describe specific objects, characters, or text layouts you want..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {!isLinkedMode && (
                <div>
                  <label style={{ display: "block", color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>Save To *</label>
                  <select
                    value={saveMode}
                    onChange={(e) => {
                      setSaveMode(e.target.value);
                      if (e.target.value === "new") setSelectedProjectId("");
                    }}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary }}
                  >
                    <option value="new">Create a new project</option>
                    <option value="existing">Add to an existing project</option>
                  </select>
                </div>
              )}

              {isLinkedMode && (
                <div style={{ color: C.accent, fontSize: 12, border: `1px solid ${C.borderAccent}`, background: C.accentDim, borderRadius: 8, padding: "10px" }}>
                  This thumbnail will be saved to your active project.
                </div>
              )}

              {!isLinkedMode && saveMode === "existing" && (
                <div>
                  <label style={{ display: "block", color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>Select Project *</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={projectsLoading || projects.length === 0}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary }}
                  >
                    <option value="">
                      {projectsLoading ? "Loading projects..." : projects.length === 0 ? "No projects found" : "Choose a project"}
                    </option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title?.trim() ? project.title : `Untitled (${new Date(project.createdAt).toLocaleDateString()})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {errorMsg && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{errorMsg}</div>}

              <button 
                type="submit" 
                disabled={isGenerating || !formData.title.trim() || ((isLinkedMode || saveMode === "existing") && !(selectedProjectId || linkedProjectId))}
                style={{
                  background: C.accent,
                  color: C.textDark,
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: isGenerating || !formData.title.trim() ? 'not-allowed' : 'pointer',
                  opacity: isGenerating || !formData.title.trim() ? 0.7 : 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '10px'
                }}
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? "Generating Thumbnail..." : "Generate with AI"}
              </button>
            </form>
          </div>

          <div className={styles.uploadCard}>
            <h3 style={{ color: C.textPrimary, fontSize: 16, marginBottom: 16 }}>Reference Image (Optional)</h3>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: "none" }} />
            <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt="Uploaded" style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px"}} />
              ) : (
                <>
                  <Plus size={24} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Upload a face or style reference</span>
                </>
              )}
            </div>
            <p style={{ color: C.textMuted, fontSize: 11, marginTop: 8, textAlign: 'center' }}>Note: Image upload functionality may require backend support.</p>
          </div>
        </div>

        {/* --- RIGHT PANEL: PREVIEW AREA --- */}
        <div className={styles.rightPanel}>
          <div className={styles.fixedHeader}>
            <h2 style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, margin: 0 }}>
              Designing Thumbnail For: <span style={{color: C.textSecondary}}>{projectContext.title}</span>
            </h2>
          </div>
          
          <div className={styles.scrollableArea} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div className={`${styles.previewSection}`} style={{ width: '100%' }}>
              <div className={styles.imageWrapper} style={{ maxWidth: '800px', margin: '0 auto' }}>
                {isGenerating ? (
                   <div style={{color: C.accent, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px'}}>
                     <Loader2 size={48} className="animate-spin" />
                     <span style={{ fontSize: 16 }}>AI is crafting your thumbnail. This may take a minute...</span>
                   </div>
                ) : generatedThumbnail ? (
                  <>
                    <img src={generatedThumbnail} alt="AI Generated Thumbnail" className={styles.thumbnailImage} style={{ width: '100%', height: 'auto', display: 'block' }}/>
                    <button className={styles.downloadBtn} onClick={handleDownload} style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                      <Download size={14} /> Download High-Res
                    </button>
                  </>
                ) : (
                  <div style={{color: C.textMuted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '60px'}}>
                    <ImageIcon size={64} opacity={0.3} />
                    <span style={{ fontSize: 16 }}>Fill out the details on the left and hit generate.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThumbnailStudio;













// import React, { useState } from "react";
// import styles from "./ThumbnailStudio.module.css";
// import ThumbnailForm from "./ThumbnailForm";
// import ReferenceUpload from "./ReferenceUpload";
// import ThumbnailPreview from "./ThumbnailPreview";
// import { useThumbnail } from "./useThumbnail";

// const ThumbnailStudio = () => {

//   const { generateThumbnail, isGenerating, thumbnail, error } = useThumbnail();

//   const [formData, setFormData] = useState({
//     title: "",
//     mood: "Dramatic",
//     colorPreference: "",
//     userDescription: "",
//     projectId: "",
//     createNew: false,
//   });

//   const [uploadedPhoto, setUploadedPhoto] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     generateThumbnail({
//       ...formData,
//       projectId: formData.projectId || undefined,
//     });
//   };

//   const handleDownload = () => {
//     if (!thumbnail) return;
//     const link = document.createElement("a");
//     link.href = thumbnail;
//     link.download = "thumbnail.png";
//     link.click();
//   };

//   return (
//     <div className={styles.studioGrid}>

//       {/* LEFT PANEL */}
//       <div className={styles.leftPanel}>

//         <div className={styles.contextCard}>
//           <ThumbnailForm
//             formData={formData}
//             setFormData={setFormData}
//             onSubmit={handleSubmit}
//             isGenerating={isGenerating}
//           />
//           {error && <p style={{ color: "red" }}>{error}</p>}
//         </div>

//         <ReferenceUpload
//           uploadedPhoto={uploadedPhoto}
//           setUploadedPhoto={setUploadedPhoto}
//         />

//       </div>

//       {/* RIGHT PANEL */}
//       <ThumbnailPreview
//         thumbnail={thumbnail}
//         isGenerating={isGenerating}
//         onDownload={handleDownload}
//       />

//     </div>
//   );
// };

// export default ThumbnailStudio;






// import React, { useState, useRef } from "react";
// import { Youtube, Plus, Download, Send, Sparkles, User, Image as ImageIcon } from "lucide-react";
// import { C, font } from "../../theme/theme.js";
// import styles from "./ThumbnailStudio.module.css";

// const ThumbnailStudio = () => {
//   const [inputText, setInputText] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [uploadedPhoto, setUploadedPhoto] = useState(null);
//   const [generatedThumbnail, setGeneratedThumbnail] = useState(null); 
  
//   const fileInputRef = useRef(null);

//   const [chatHistory, setChatHistory] = useState([
//     { role: "ai", content: "GrowthSync AI is ready! Describe the thumbnail you want to generate." }
//   ]);

//   const projectContext = {
//     name: "AI Workforce Future",
//     title: "AI Is Replacing Entry-Level Jobs",
//     summary: "Exploring the impact of automation on early-career positions and skills."
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedPhoto(imageUrl);
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     setChatHistory(prev => [...prev, { role: "user", content: inputText }]);
//     setInputText("");
//     setIsGenerating(true);

//     setTimeout(() => {
//       setChatHistory(prev => [...prev, { role: "ai", content: "Thumbnail generated successfully! You can ask me to tweak the colors or text style if needed." }]);
//       setGeneratedThumbnail("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"); 
//       setIsGenerating(false);
//     }, 2000);
//   };

//   const handleDownload = () => {
//     if (!generatedThumbnail) return;
//     const link = document.createElement('a');
//     link.href = generatedThumbnail;
//     link.download = 'GrowthSync_Thumbnail.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div style={{ fontFamily: font, animation: "fadeIn 0.3s ease" }}>
//       <div className={styles.studioGrid}>
        
//         <div className={styles.leftPanel}>
//           <div className={styles.contextCard}>
//             <h3 style={{ color: C.textPrimary, fontSize: 16, marginBottom: 16 }}>Project Context</h3>
//             <div style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.8 }}>
//               <div>Project Name: <span style={{color: C.textPrimary}}>{projectContext.name}</span></div>
//               <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
//                 Platform: <Youtube size={14} color="#ff0000"/> <span style={{color: C.textPrimary}}>YouTube</span>
//               </div>
//               <div style={{marginTop: 8}}>Content Title:<br/><span style={{color: C.textPrimary, fontWeight: 600}}>{projectContext.title}</span></div>
//               <div style={{marginTop: 12}}>Short script summary:<br/><span style={{color: C.textPrimary}}>{projectContext.summary}</span></div>
//             </div>
//           </div>

//           <div className={styles.uploadCard}>
//             <h3 style={{ color: C.textPrimary, fontSize: 16, marginBottom: 16 }}>Creator Image</h3>
//             <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: "none" }} />
//             <div className={styles.uploadBox} onClick={() => fileInputRef.current.click()}>
//               {uploadedPhoto ? (
//                 <img src={uploadedPhoto} alt="Uploaded" style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px"}} />
//               ) : (
//                 <>
//                   <Plus size={24} />
//                   <span style={{ fontSize: 13, fontWeight: 500 }}>Upload Your Photo</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className={styles.rightPanel}>
//             <div className={styles.fixedHeader}>
//                 <h2 style={{ color: C.textPrimary, fontSize: 18, fontWeight: 700, margin: 0 }}>
//                 Designing Thumbnail For: <span style={{color: C.textSecondary}}>{projectContext.title}</span>
//                 </h2>
//             </div>
          
//           <div className={styles.scrollableArea}>
//             <div className={`${styles.previewSection}`}>
//               <div className={styles.imageWrapper}>
//                 {generatedThumbnail ? (
//                   <>
//                     <img src={generatedThumbnail} alt="AI Generated Thumbnail" className={styles.thumbnailImage} />
//                     <button className={styles.downloadBtn} onClick={handleDownload}>
//                       <Download size={14} /> Download
//                     </button>
//                   </>
//                 ) : (
//                   <div style={{color: C.textMuted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
//                     <ImageIcon size={40} opacity={0.5} />
//                     <span>Awaiting prompt...</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div style={{ padding: "0 24px" }}>
//               <h3 style={{ color: C.textPrimary, fontSize: 16, margin: "10px 0 0 0" }}>Refine with AI</h3>
//             </div>

//             <div className={styles.chatArea}>
//               {chatHistory.map((msg, idx) => (
//                 <div key={idx} className={`${styles.messageRow} ${msg.role === 'ai' ? styles.messageAI : styles.messageUser}`}>
//                   {msg.role === 'ai' && (
//                     <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0, 230, 195, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                       <Sparkles size={12} color={C.accent} />
//                     </div>
//                   )}
//                   <div>{msg.content}</div>
//                 </div>
//               ))}
//               {isGenerating && <div style={{color: C.accent, fontSize: 13}}>Generating new image variations...</div>}
//             </div>
            
//           </div>
          
//           <form onSubmit={handleSendMessage} className={styles.inputContainer}>
//             <div className={styles.inputWrapper}>
//                 <input 
//                 type="text" 
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 placeholder="Ask AI to change colors, swap background, or make text bolder..." 
//                 className={styles.textInput}
//                 disabled={isGenerating}
//                 />
//                 <button type="submit" className={styles.sendBtn} disabled={isGenerating || !inputText.trim()}>
//                 {isGenerating ? "..." : "Send"}
//                 </button>
//             </div>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThumbnailStudio;
