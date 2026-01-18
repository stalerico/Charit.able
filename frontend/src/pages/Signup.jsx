import React, { useState } from "react";
import Navbar from "../components/navbar.tsx";

function SignupComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <div className="m-auto w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
          Sign Up
        </h1>
        
        {/* Username */}
        <div className="mt-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-black"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-black"
          />
        </div>

        {/* Password */}
        <div className="mt-4 flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 text:black dark:text-black"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Signup Button */}
        <div className="mt-6">
          <button
            onClick={handleSignup}
            className="w-full bg-black hover:bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Sign Up
          </button>
        </div>

        {/* Success / Error Message */}
        {message && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md dark:bg-green-900 dark:text-green-300">
            {message}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default SignupComponent;
