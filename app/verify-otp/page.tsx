"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Mail } from "lucide-react";
import { API_BASE } from "@/lib/constants";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Invalid OTP");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to resend OTP");
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-cream to-white">
      <div className="w-full max-w-md premium-card p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gold-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Two-Factor Auth</h1>
          <p className="text-gray-500 text-sm mt-2">Enter the OTP sent to your email</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Mail className="w-4 h-4 text-gold-600" />
            <span className="text-sm text-gray-600 font-medium">{email}</span>
          </div>
          <div className="premium-divider mt-4 mx-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit OTP
            </label>
            <div className="flex items-center justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    digit ? "border-gold-500 bg-gold-50" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full gold-btn py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>
        </form>
        <div className="text-center mt-6">
          <button onClick={handleResend} disabled={countdown > 0}
            className="text-sm text-gold-600 hover:text-gold-700 font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          <button onClick={() => router.push("/login")} className="text-gold-600 hover:text-gold-700 font-medium hover:underline">
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
}
