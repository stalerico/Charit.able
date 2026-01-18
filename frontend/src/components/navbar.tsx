import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavItem({ text, onClick, classDetails }: { text: string; onClick: () => void; classDetails?: string }) {
  return (
    <button
      type="button"
      className={classDetails}
      onClick={onClick}>
      {text}</button>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [navItems] = useState([
    { text: "Organizations", onClick: () => navigate("/donate"), classDetails: "px-4 py-2 rounded-lg text-green-400 hover:bg-green-400/10 transition font-medium" },
    // { text: "Charities", onClick: () => navigate("/charities"), classDetails: "px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-medium" },
    { text: "Dashboard", onClick: () => navigate("/company-dashboard"), classDetails: "px-4 py-2 rounded-lg text-cyan-300 hover:bg-cyan-400/10 transition font-medium" },
    { text: "Pricing", onClick: () => navigate("/pricing"), classDetails: "px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-medium" },
    { text: "FAQ", onClick: () => navigate("/faq"), classDetails: "px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-medium" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Do something with the search query, e.g., navigate or filter results
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="w-full border-b border-black/10 bg-black/90 backdrop-blur-xl">
      <div className="max-w-8xl px-8 py-4 flex items-center">
        {/* LEFT: Logo + Brand */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3 shrink-0 cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="../../public/images/logo.png"
            className="h-12 w-12"
            alt="Logo"
          />
          <span className="uppercase font-extrabold text-2xl text-left text-white">
            Charit.able
          </span>
        </button>

        
        {/* Donate Button */}
        <div className="flex items-center ml-auto gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item, index) => (
              <NavItem key={index} text={item.text} onClick={item.onClick} classDetails={item.classDetails} />
            ))}
          </nav>
        </div>
      </div>

      {/* MOBILE NAV */}
      <nav className="md:hidden px-5 pb-3 flex flex-wrap gap-2 justify-center">
        {navItems.map((item, index) => (
          <NavItem key={index} text={item.text} onClick={item.onClick} classDetails={item.classDetails} />
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
