// src/Pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../Components/InputField";
import API_URL from '../config';


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message , setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!firstName.trim())
        {
            setMessage("First Name Required")
            return;
        }
    
        if(!lastName.trim())
        {
            setMessage("Last Name Required")
            return;
        }

    if(!username.trim())
        {
            setMessage("Username Required")
            return;
        }

    if(!email.trim())
    {
        setMessage("Email Required")
        return;
    }

    if(!password.trim())
    {
        setMessage("Password Required")
        return;
    }

        
    if(password.length < 8)
    {
        setMessage("Password need to have at least 8 characters")
        return;
    }

    const userData = {
        firstName,
        lastName,
        username,
        email,
        password,
    };

    console.log("Sending data:", userData);

    try {
        const response = await fetch(`${API_URL}/user/register`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            setMessage("User created successfully");
            navigate('/login');
        } else {
            setMessage(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error connecting to the server");
    }

    
  };

 return (
    <main className="page register-page">
      <section className="register-card">
        <h2 className="register-title">Register</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <InputField
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <InputField
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />

          {message && <p className="register-message">{message}</p>}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login here
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;