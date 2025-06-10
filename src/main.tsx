// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // ✅ add this
import { FirebaseAuthProvider } from "./hooks/useFirebaseAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FirebaseAuthProvider>
            <App />
          </FirebaseAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
