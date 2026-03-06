import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { C } from "../theme/theme.js";
import styles from "./settings.module.css";

const SettingsItem = ({ icon: Icon, label, onClick, isOpen, children }) => {
  return (
    <div className={styles.itemWrapper}>
      <button type="button" onClick={onClick} className={styles.itemHeader}>
        <div className={styles.headerLeft}>
          <Icon size={20} color={C.accent} />
          <span className={styles.itemLabel}>{label}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} color={C.textSecondary} />
        ) : (
          <ChevronDown size={18} color={C.textSecondary} />
        )}
      </button>

      {isOpen && (
        <div className={styles.itemContent}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SettingsItem;