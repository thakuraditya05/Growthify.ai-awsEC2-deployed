import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // OPTIMISTIC DELETE
  const deleteProject = async (id) => {
    const originalProjects = [...projects];

    // instantly remove from UI
    setProjects((prev) => prev.filter((p) => p._id !== id));

    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Project deleted");
    } catch {
      toast.error("Delete failed");
      setProjects(originalProjects); // rollback
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    fetchProjects,
    deleteProject,
  };
};

export default useProjects;
