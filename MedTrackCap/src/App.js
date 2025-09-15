import { Routes, Route, Link } from "react-router-dom";
import Login from "./Pages/Login"; 
import Register from "./Pages/Register";
function Home() {
  return <div>Home OK</div>;
}

export default function App() {
  return (
    <>
      <nav style={{ padding: 12, display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
         <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
      </Routes>
    </>
  );
}