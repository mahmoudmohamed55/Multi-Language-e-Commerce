import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeContextProvider } from "./Context/Theme/ThemeContext";
import "./i18n";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./Context/Auth/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
