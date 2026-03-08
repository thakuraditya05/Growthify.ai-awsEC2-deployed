import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";

const savedTheme = localStorage.getItem("theme");
document.documentElement.setAttribute("data-theme", savedTheme === "light" ? "light" : "dark");

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
  // </StrictMode>,
);
