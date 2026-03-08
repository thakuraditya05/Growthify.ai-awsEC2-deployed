import React, { useState } from "react";
import { Calendar as CalendarIcon, ListTodo, Plus, ChevronLeft, ChevronRight, Edit2, Check } from "lucide-react";
import styles from "./schedule.module.css";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Form States
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  
  // 🟢 Edit Mode State
  const [editingTaskId, setEditingTaskId] = useState(null); 

  // Initial Data
  const [tasks, setTasks] = useState([
    { id: 1, text: "Upload YouTube Video", date: "2026-03-10", type: "scheduled", priority: "high" },
    { id: 2, text: "Write script", date: "2026-03-10", type: "scheduled", priority: "medium" },
    { id: 3, text: "Brainstorm niches", date: "", type: "unscheduled", priority: "low" },
  ]);

  // Calendar Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const formatDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 🟢 Add OR Update Task Logic
  const handleAddOrUpdateTask = () => {
    if (!newTaskText) return;

    if (editingTaskId) {
      setTasks(tasks.map(task => task.id === editingTaskId ? {
        ...task,
        text: newTaskText,
        type: activeTab,
        priority: newTaskPriority,
        date: activeTab === "scheduled" ? newTaskDate : "",
      } : task));
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: newTaskText,
        type: activeTab,
        priority: newTaskPriority,
        date: activeTab === "scheduled" ? newTaskDate : "",
      };
      setTasks([...tasks, newTask]);
    }
    resetForm();
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setNewTaskText(task.text);
    setNewTaskPriority(task.priority);
    setNewTaskDate(task.date || "");
    setActiveTab(task.type);
  };

  const resetForm = () => {
    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskPriority("medium");
    setEditingTaskId(null);
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  return (
    <div className={styles.container}>
      
      {/* 🟢 LEFT HALF: CALENDAR */}
      <div className={styles.panel}>
        <h2 className={styles.title}><CalendarIcon color="#0ea5e9" /> Calendar</h2>
        
        <div className={styles.calendarHeader}>
          <button onClick={prevMonth} style={{background: 'none', border:'none', color:'white', cursor:'pointer'}}><ChevronLeft/></button>
          <span>{currentDate.toLocaleString("default", { month: "long" })} {year}</span>
          <button onClick={nextMonth} style={{background: 'none', border:'none', color:'white', cursor:'pointer'}}><ChevronRight/></button>
        </div>

        <div className={styles.weekdays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day}>{day}</div>)}
        </div>

        <div className={styles.daysGrid}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className={`${styles.dayCell} ${styles.empty}`}></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisCellDate = formatDate(year, month, dayNum);
            
            const dayTasks = tasks.filter(t => t.date === thisCellDate && t.type === "scheduled");
            const isSelected = formatDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) === thisCellDate;

            return (
              <div 
                key={dayNum} 
                className={`${styles.dayCell} ${isSelected ? styles.active : ""}`}
                // 🟢 MAGIC HAPPENS HERE: Auto-fill date & switch tab
                onClick={() => {
                  setSelectedDate(new Date(year, month, dayNum)); 
                  setNewTaskDate(thisCellDate); 
                  setActiveTab("scheduled");
                }}
              >
                {dayNum}
                
                <div className={styles.dotsContainer}>
                  {dayTasks.map(t => (
                    <div 
                      key={t.id} 
                      className={`${styles.taskDot} ${
                        t.priority === 'high' ? styles.dotHigh : 
                        t.priority === 'medium' ? styles.dotMedium : styles.dotLow
                      }`}
                      title={t.text}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟢 RIGHT HALF: TODO LIST */}
      <div className={styles.panel}>
        <h2 className={styles.title}><ListTodo color="#10b981" /> Tasks & Planning</h2>

        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === "scheduled" ? styles.activeTab : ""}`} onClick={() => setActiveTab("scheduled")}>Scheduled Task</button>
          <button className={`${styles.tabBtn} ${activeTab === "unscheduled" ? styles.activeTab : ""}`} onClick={() => setActiveTab("unscheduled")}>Non Scheduled Task</button>
        </div>

        {/* Input Form with Priority Dropdown */}
        <div className={styles.inputGroup}>
          <div className={styles.inputRow}>
            <input 
              type="text" placeholder="What needs to be done?" className={styles.input}
              value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)}
            />
            <select 
              className={styles.prioritySelect}
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          {activeTab === "scheduled" && (
            <input type="date" className={styles.input} value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
          )}

          {/* 🟢 Dynamic Buttons based on Edit State */}
          <div className={styles.formButtons}>
            <button onClick={handleAddOrUpdateTask} className={styles.addBtn}>
              {editingTaskId ? (
                <><Check size={18} style={{verticalAlign: 'middle', marginRight: 5}}/> Update Task</>
              ) : (
                <><Plus size={18} style={{verticalAlign: 'middle', marginRight: 5}}/> Add Task</>
              )}
            </button>

            {editingTaskId && (
              <button onClick={resetForm} className={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Render Task List */}
        <div className={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <p style={{color: '#94a3b8', textAlign: 'center', marginTop: 20}}>All done for now!</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                
                <div className={styles.taskContent}>
                  <div className={styles.radioBtn} onClick={() => handleCompleteTask(task.id)} title="Mark as done"></div>
                  <div>
                    <div className={styles.taskText}>{task.text}</div>
                    {task.date && <div className={styles.taskDate}>{task.date}</div>}
                  </div>
                </div>

                <div className={styles.taskActions}>
                  <div className={`${styles.priorityBadge} ${
                      task.priority === 'high' ? styles.badgeHigh : 
                      task.priority === 'medium' ? styles.badgeMedium : styles.badgeLow
                    }`}>
                    {task.priority}
                  </div>
                  
                  <button 
                    className={styles.editBtn} 
                    onClick={() => handleEditClick(task)}
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Schedule;

















