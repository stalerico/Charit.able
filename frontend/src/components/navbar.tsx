import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavItem({ text, onClick }) {
  return (
    <button
      type="button"
      className="px-4 py-2 text-md font-medium text-neutral-200 hover:text-white hover:bg-white/10 rounded-lg transition"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([
    { text: "Beneficiaries", onClick: () => navigate("/test") },
    { text: "Testimonials", onClick: () => navigate("/") },
    { text: "Pricing", onClick: () => alert("Navigate to Pricing") },
    { text: "FAQ", onClick: () => alert("Navigate to FAQ") },
  ]);

  return (
    <header className="w-full border-b border-black/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto max-w-8xl px-8 py-4 flex">
        
        {/* LEFT: Logo + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fkawaii-penguin&ved=0CBYQjRxqFwoTCNCm_fG0lJIDFQAAAAAdAAAAABAj&opi=89978449"
            className="h-12 w-12"
            alt="Logo"
          />
          <span className="uppercase font-extrabold text-lg text-left text-white">
            Charit.able
          </span>
        </div>

        {/* RIGHT: Nav + CTA */}
        <div className="flex items-center ml-auto">
          <nav className="hidden md:flex items-center gap-4 mr-6">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                text={item.text}
                onClick={item.onClick}
              />
            ))}
          </nav>

          <button
            className="shrink-0 px-6 py-3 font-medium text-green-400 text-lg rounded-full bg-black hover:bg-black/80 transition"
            onClick={() => alert("Donate Now button clicked")}
          >
            Donate Now
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      <nav className="md:hidden px-5 pb-3 flex flex-wrap gap-2 justify-center">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            text={item.text}
            onClick={item.onClick}
          />
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
