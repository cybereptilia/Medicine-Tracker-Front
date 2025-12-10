// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import MedicationForm from "./Pages/MedicationForm.jsx";
//import Schedules from "./Pages/Schedules.jsx";
import Inventory from "./Pages/Inventory.jsx";
import Settings from "./Pages/Settings.jsx";
import "./App.css";
import Medicines from "./Pages/Medicines.jsx";


// Demo: sin auth. Sin auth real por ahora.
function ProtectedRoute({ children }) {
  return children; // <- permite todo en la demo
}

export default function App() {
  return (
    <div className="app-root">
      <div className="app-shell">
        <Routes>
          {/* Ruta por defecto. Si prefiere Login: */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
          }
          />
          
          <Route
          path="medications/new"
          element={
            <ProtectedRoute>
              <MedicationForm />
            </ProtectedRoute>
          }
          />

          <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
              </ProtectedRoute>
          }
          />

          <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
              </ProtectedRoute>
          }
          />
          <Route
          path="/medicines"
          element={
          <ProtectedRoute>
            <Medicines />
            </ProtectedRoute>
          }
          />

          {/* Wildcard route para rutas no definidas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}
