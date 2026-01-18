import React, { useState, useEffect } from "react";

function NavItem({ text, onClick }) {
  return (
    <button
      type="button"
      className="px-4 py-2 text-sm font-medium text-neutral-200 hover:text-white hover:bg-white/10 rounded-lg transition"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function Navbar() {
  const [navItems, setNavItems] = useState([
    { text: "Experience", onClick: () => alert("Navigate to Experience") },
    { text: "Testimonials", onClick: () => alert("Navigate to Testimonials") },
    { text: "Pricing", onClick: () => alert("Navigate to Pricing") },
    { text: "FAQ", onClick: () => alert("Navigate to FAQ") },
  ]);

  useEffect(() => {
    async function fetchNavItems() {
      try {
        const response = await fetch("/api/navItems");
        const data = await response.json();
        setNavItems(
          data.map((item) => ({
            ...item,
            onClick: () => alert(`Navigate to ${item.text}`),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch navigation items", error);
      }
    }
    fetchNavItems();
  }, []);

  return (
    <header className="w-full border-b border-black/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 py-3 flex items-center">
        
        {/* LEFT: Logo + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/96ed444f12f2297ccd4006841bd1831940e6f23d36396492d16831d2cdf15c29?apiKey=5b7d47d822c447fbbf3f0faf7f51790e&"
            className="h-9 w-9"
            alt="Logo"
          />
          <span className="uppercase font-extrabold text-lg text-white">
            Harmony
          </span>
        </div>

        {/* RIGHT: Nav + CTA */}
        <div className="ml-auto flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                text={item.text}
                onClick={item.onClick}
              />
            ))}
          </nav>

          <button
            className="shrink-0 px-5 py-2 text-sm font-medium text-white rounded-full bg-black hover:bg-black/80 transition"
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
