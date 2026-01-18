import { Home, User, Briefcase, FileText } from "lucide-react";
import NavBar from "./NavBar";

export default function NavBarDemo() {
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
    { name: "Projects", url: "/projects", icon: Briefcase },
    { name: "Resume", url: "/resume", icon: FileText },
  ];

  return <NavBar items={navItems} />;
}
