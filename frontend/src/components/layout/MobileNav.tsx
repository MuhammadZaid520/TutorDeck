import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarClock, FileBarChart, Settings, Mail } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/sessions", label: "Sessions", icon: CalendarClock },
  { to: "/finances", label: "Ledger", icon: FileBarChart },
  { to: "/messages", label: "Messages", icon: Mail },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 surface-panel !rounded-none !border-x-0 !border-b-0 flex justify-around px-2 py-2 z-40 pb-safe">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-btn text-[10px] font-bold transition-all duration-200 flex-1 ${
              isActive ? "text-accent-foreground bg-accent shadow-md shadow-accent/20" : "text-foreground/60 hover:text-foreground hover:bg-muted"
            }`
          }
        >
          <Icon size={20} strokeWidth={2.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
