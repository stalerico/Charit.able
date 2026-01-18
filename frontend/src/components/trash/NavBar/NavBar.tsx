import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "./utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export default function NavBar({ items, className }: NavBarProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentItem = items.find((i) => i.url === location.pathname);
    if (currentItem) setActiveTab(currentItem.name);
  }, [location.pathname, items]);

  return (
    <div className={cn("fixed top-4 left-1/2 -translate-x-1/2 z-50", className)}>
      <div className="flex justify-center items-center gap-2 bg-white/5 backdrop-blur-md border border-gray-300 rounded-full shadow-lg p-1 relative max-w-4xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActiveTab(item.name)}
              className="relative flex items-center gap-2 px-5 py-2 rounded-full cursor-pointer font-medium transition-all duration-200 z-10"
            >
              {/* Active tubelight glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-purple-400/20 rounded-full -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}

              {/* Icon (mobile) */}
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>

              {/* Text (desktop) */}
              <span className="hidden md:inline text-gray-900">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
