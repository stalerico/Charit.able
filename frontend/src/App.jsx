import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'
import Test from "./pages/Test.jsx";
import TypingAnimatedText from "./components/TypingAnimatedText.tsx";


function App() {
  const navigate = useNavigate();
  return (
    <>
    <h1>Hello Vite + React!</h1>
    <button onClick={() => navigate("/test")}>Click me woof woof</button>
    <TypingAnimatedText />
    <Routes>
      <Route path="/test" element={<Test />} />
    </Routes>
    </>
  );
}

export default App
