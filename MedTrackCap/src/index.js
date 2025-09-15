// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("INDEX.JS LOADED ✅");

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  // StrictMode is optional; remove if it confuses logs
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);
