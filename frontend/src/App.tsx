import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import MobileNav from "./components/layout/MobileNav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StudentsBatches from "./pages/StudentsBatches";
import Sessions from "./pages/Sessions";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 relative z-0 custom-scrollbar">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  const { auth } = useAuth();

  return (
    <Routes>
      {!auth.user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/students" element={<DashboardLayout><StudentsBatches /></DashboardLayout>} />
          <Route path="/sessions" element={<DashboardLayout><Sessions /></DashboardLayout>} />
          <Route path="/finances" element={<DashboardLayout><Finances /></DashboardLayout>} />
          <Route path="/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  );
}
