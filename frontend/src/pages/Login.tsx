import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import TutorDeckLogo from "../components/ui/TutorDeckLogo";
import loginBg from "../assets/login_bg.png";

export default function Login() {
  const navigate = useNavigate();
  const { login, auth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div 
      style={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ── LEFT PANEL — Slogan Overlay ──────────────── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 relative z-10">
        <h1 style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 54,
          color: "#FFFFFF",
          lineHeight: 1.1,
          marginBottom: 18,
        }}>
          Run your tutoring business,<br />not spreadsheets.
        </h1>
        <p style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 20,
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.6,
          maxWidth: 440,
        }}>
          Manage students, batches, schedules, payments, and growth from one organized workspace.
        </p>
      </div>

      {/* ── RIGHT PANEL — Login Form ──────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full lg:w-1/2">
        <div 
          className="w-full max-w-[460px] p-10 bg-white/95 backdrop-blur-md shadow-2xl relative overflow-hidden"
          style={{ borderRadius: 32 }}
        >
          {/* Header */}
          <div className="mb-10 text-center flex flex-col items-center">
            <TutorDeckLogo size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-gray-900 font-display">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your workspace to continue.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tutor@example.com"
                  autoComplete="email"
                  required
                  className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C6551E]/20 focus:border-[#C6551E] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-sm text-[#C6551E] font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full h-12 pl-11 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C6551E]/20 focus:border-[#C6551E] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer w-max select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#C6551E] bg-gray-100 border-gray-300 rounded focus:ring-[#C6551E] focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={auth.isLoading}
              className={`w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                auth.isLoading ? 'bg-[#E8B49A] cursor-not-allowed shadow-none hover:translate-y-0 hover:shadow-none' : 'bg-gradient-to-r from-[#C6551E] to-[#A8421A]'
              }`}
            >
              {auth.isLoading ? "Signing in…" : "Access Workspace →"}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-400 uppercase">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full h-12 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:shadow-sm"
              onClick={() => {
                // Mock Google OAuth login
                login("tutor@google.com", "password").then(() => navigate("/")).catch(console.error);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.55V20.3H19.28C21.36 18.38 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.3L15.72 17.55C14.74 18.21 13.48 18.6 12 18.6C9.13001 18.6 6.69001 16.66 5.82001 14.07H2.15002V16.92C3.97002 20.53 7.69001 23 12 23Z" fill="#34A853"/>
                <path d="M5.82001 14.07C5.59001 13.41 5.46002 12.72 5.46002 12C5.46002 11.28 5.59001 10.59 5.82001 9.93V7.08H2.15002C1.40002 8.57 1 10.23 1 12C1 13.77 1.40002 15.43 2.15002 16.92L5.82001 14.07Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.45 2.08 14.97 1 12 1C7.69001 1 3.97002 3.47 2.15002 7.08L5.82001 9.93C6.69001 7.34 9.13001 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500 font-medium">
            New to TutorDeck?{" "}
            <button className="text-[#C6551E] font-bold hover:underline" onClick={() => navigate("/signup")}>
              Create your workspace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
