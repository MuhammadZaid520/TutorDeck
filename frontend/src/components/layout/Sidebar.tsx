import { NavLink } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, CalendarClock, FileBarChart, Settings, Sun, Moon, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import TutorDeckLogo from "../ui/TutorDeckLogo";

const NAV_ITEMS = [
  { to: "/",              label: "Overview",            icon: LayoutDashboard },
  { to: "/students",      label: "Students & Batches",  icon: Users },
  { to: "/sessions",      label: "Calendar",            icon: CalendarClock },
  { to: "/finances",      label: "Ledger",              icon: FileBarChart },
  { to: "/messages",      label: "Messages",            icon: Mail },
];

export default function Sidebar() {
  const { auth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-72 shrink-0 hidden md:flex flex-col h-screen sidebar-bg z-20 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border shrink-0">
        <TutorDeckLogo size="lg" />
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest px-3 mb-4">Menu</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-full text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-accent text-accent-foreground font-bold shadow-md shadow-accent/20 dark:bg-accent/15 dark:text-accent dark:shadow-[0_0_16px_rgba(224,106,46,0.25)] dark:border dark:border-accent/40"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/10 font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`shrink-0 transition-colors duration-200 ${isActive ? "text-accent-foreground dark:text-accent" : "text-foreground/40 group-hover:text-accent/70"}`} />
                <span className="flex-1">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-full text-sm transition-all duration-200 group ${
              isActive 
                ? "bg-accent text-accent-foreground font-bold shadow-md shadow-accent/20 dark:bg-accent/15 dark:text-accent dark:shadow-[0_0_16px_rgba(224,106,46,0.25)] dark:border dark:border-accent/40" 
                : "text-foreground/60 hover:text-foreground hover:bg-accent/10 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={17} className={`shrink-0 transition-colors duration-200 ${isActive ? "text-accent-foreground dark:text-accent" : "text-foreground/40 group-hover:text-accent/70"}`} />
              <span className="flex-1">Settings</span>
            </>
          )}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium text-foreground/60 hover:bg-danger/10 hover:text-danger transition-all duration-200 group"
        >
          <LogOut size={17} className="text-foreground/40 group-hover:text-danger/80 transition-colors duration-200 shrink-0" />
          <span className="flex-1 text-left">Sign out</span>
        </button>

        {/* User profile & Theme Toggle */}
        <div className="pt-4 mt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-btn bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
              {auth.user?.name?.charAt(0).toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{auth.user?.name ?? "Tutor"}</p>
              <p className="text-[10px] text-foreground/40 truncate">{auth.user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-btn border border-border bg-card text-foreground/40 hover:text-foreground hover:bg-muted transition-all duration-150"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
