// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";     
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";  
import AuthProvider from "./AuthContext";

//Helper to decide if we are in preview mode
function isPreviewMode(){
  if (process.env.REACT_APP_PREVIEW === "1") return true;
  return false;
}

async function boot() {
// CRA/Webpack style (no Vite)
if (process.env.NODE_ENV === 'development') {
  import('./Mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  });
}

  console.log("[Preview] MSW started !");
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
 root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
  );


boot();

 