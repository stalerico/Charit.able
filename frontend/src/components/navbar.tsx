import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavItem({ text, onClick, classDetails }) {
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
    { text: "Donate Now", onClick: () => navigate("/donate"), classDetails: "px-4 py-2 rounded-lg text-green-400 hover:bg-white/10 transition font-extrabo" },
    { text: "Pricing", onClick: () => navigate("/"), classDetails: "px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-medium" },
    { text: "FAQ", onClick: () => alert("Navigate to FAQ"), classDetails: "px-4 py-2 rounded-lg text-white hover:bg-white/10 transition font-medium" },
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
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fkawaii-penguin&opi=89978449"
            className="h-12 w-12"
            alt="Logo"
          />
          <span className="uppercase font-extrabold text-lg text-left text-white">
            Charit.able
          </span>
        </div>
        
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
          <NavItem key={index} text={item.text} onClick={item.onClick} />
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
