import { useState } from "react";
import { HiEnvelope, HiLockClosed, HiUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useForgotPasswordMutation,
    useLoginMutation,
    useResetPasswordMutation,
} from "../app/api/auth";
import { setCredentials } from "../app/features/auth/authSlice";
import { useAppDispatch } from "../app/hooks";
import HeroImage from "../assets/login.png";
import Logo from "../assets/pplogo.png";

type View = "login" | "forgot" | "reset";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: forgotLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetLoading }] = useResetPasswordMutation();

  const [view, setView] = useState<View>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetData, setResetData] = useState({ email: "", token: "", newPassword: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // ── Login ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginData).unwrap();
      dispatch(setCredentials({ user: result.data, token: result.token }));
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Invalid credentials. Please try again.");
    }
  };

  // ── Forgot password ────────────────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: forgotEmail }).unwrap();
      toast.success("Reset code sent! Check your email.");
      setResetData((prev) => ({ ...prev, email: forgotEmail }));
      setView("reset");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Failed to send reset code.");
    }
  };

  // ── Reset password ─────────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(resetData).unwrap();
      toast.success("Password reset successfully! You can now log in.");
      setView("login");
      setResetData({ email: "", token: "", newPassword: "" });
      setForgotEmail("");
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      toast.error(error?.data?.error || "Invalid or expired code.");
    }
  };

  const isLoading = loginLoading || forgotLoading || resetLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-secondary-200 shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
        {/* Left Side */}
        <div className="hidden w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-700 p-8 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <img src={Logo} alt="Logo" className="h-16 w-16 rounded-full bg-secondary-200 p-2 shadow-lg" />
            </div>
            <h1 className="mb-6 text-2xl font-semibold text-secondary-200">Welcome to Pallotti Presse</h1>
            <div className="flex justify-center">
              <img src={HeroImage} alt="Admin" className="max-w-[250px] rounded-lg opacity-90" />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 p-8 lg:w-1/2">
          <div className="w-full max-w-sm">

            {/* ── LOGIN VIEW ── */}
            {view === "login" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-secondary-200">Login</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <HiUser className="h-5 w-5 text-secondary-300" />
                    </div>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full rounded-full border-0 bg-secondary-200 py-3 pl-12 pr-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <HiLockClosed className="h-5 w-5 text-secondary-300" />
                    </div>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                      required
                      className="w-full rounded-full border-0 bg-secondary-200 py-3 pl-12 pr-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                      placeholder="Password"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-sm font-semibold text-primary-100 hover:text-secondary-200"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-primary-700 py-3 text-base font-bold uppercase tracking-wider text-primary-100 shadow-lg transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loginLoading ? "Signing in..." : "LOGIN"}
                  </button>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === "forgot" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-secondary-200">Forgot Password</h2>
                  <p className="mt-2 text-sm text-secondary-200/80">
                    Enter your email and we'll send a reset code.
                  </p>
                </div>
                <form onSubmit={handleForgot} className="space-y-5">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <HiEnvelope className="h-5 w-5 text-secondary-300" />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full rounded-full border-0 bg-secondary-200 py-3 pl-12 pr-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                      placeholder="Your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-primary-700 py-3 text-base font-bold uppercase tracking-wider text-primary-100 shadow-lg transition hover:bg-primary-800 disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="w-full text-center text-sm text-secondary-200/80 hover:text-secondary-200"
                  >
                    ← Back to Login
                  </button>
                </form>
              </>
            )}

            {/* ── RESET PASSWORD VIEW ── */}
            {view === "reset" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-secondary-200">Reset Password</h2>
                  <p className="mt-2 text-sm text-secondary-200/80">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>
                <form onSubmit={handleReset} className="space-y-5">
                  <input
                    type="email"
                    value={resetData.email}
                    onChange={(e) => setResetData((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full rounded-full border-0 bg-secondary-200 py-3 px-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                    placeholder="Your email address"
                  />
                  <input
                    type="text"
                    value={resetData.token}
                    onChange={(e) => setResetData((p) => ({ ...p, token: e.target.value }))}
                    required
                    maxLength={6}
                    className="w-full rounded-full border-0 bg-secondary-200 py-3 px-4 text-center text-xl font-bold tracking-[0.5em] text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                    placeholder="000000"
                  />
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <HiLockClosed className="h-5 w-5 text-secondary-300" />
                    </div>
                    <input
                      type="password"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                      className="w-full rounded-full border-0 bg-secondary-200 py-3 pl-12 pr-4 text-sm text-secondary-100 placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200/50"
                      placeholder="New password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-primary-700 py-3 text-base font-bold uppercase tracking-wider text-primary-100 shadow-lg transition hover:bg-primary-800 disabled:opacity-50"
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="w-full text-center text-sm text-secondary-200/80 hover:text-secondary-200"
                  >
                    ← Resend Code
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-secondary-200/80 hover:text-secondary-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
