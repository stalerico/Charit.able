import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'
import Test from "./pages/Test.jsx";
import Home from "./pages/Home.jsx";



function App() {
  const navigate = useNavigate();
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />"
      <Route path="/test" element={<Test />} />
    </Routes>
    </>
  );
}

export default App
