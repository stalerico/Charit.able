import React, { useState } from "react";
import Navbar from "../components/navbar.tsx";
import FloatingCircles from "../components/floatingcircles.tsx";

function SignupComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/signup", {
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

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-black p-4">
        <div className="relative w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
          {/* Floating circles background */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
            <div className="absolute w-20 h-20 bg-green-200/40 rounded-full blur-2xl animate-float" style={{ top: "-20%", left: "10%" }} />
            <div className="absolute w-16 h-16 bg-green-300/30 rounded-full blur-2xl animate-float" style={{ top: "30%", left: "80%" }} />
            <div className="absolute w-24 h-24 bg-green-100/30 rounded-full blur-3xl animate-float" style={{ top: "70%", left: "40%" }} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
            💚 Join Charit.able
          </h1>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:from-green-500 hover:to-green-600 transition"
          >
            Sign Up
          </button>

          {/* Message */}
          {message && (
            <div className="mt-4 p-3 text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-xl shadow-sm">
              {message}
            </div>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            Already have an account? <span className="text-green-500 cursor-pointer hover:underline">Login</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignupComponent;
