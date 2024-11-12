import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUserName] = useState("");
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:3000/register", {
          username,
          full_name,
          email,
          password,
          gender,
          age,
          nationality
        });

        // Show a success message
        setMessage("Registration successful! You can now log in.");
        window.location.href = `http://localhost:3001/login`;
    } catch (error) {
        setMessage(error.response?.data?.message || "Error occurred during registration");
    }
};

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="Nationality"
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;