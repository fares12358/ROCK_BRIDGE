// components/ResetPasswordForm.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

export default function ResetPasswordForm({ otpFromUrl = "" }) {
  const router = useRouter();
  const API_BASE = "http://localhost:5000/api/auth/reset";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(otpFromUrl || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // inline field errors returned from server or client validation
  const [fieldErrors, setFieldErrors] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "", general: "" });

  // refs for focusing
  const emailRef = useRef(null);
  const otpRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (otpFromUrl) setOtp(otpFromUrl);
  }, [otpFromUrl]);

  const validateEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

  // helper: focus first field with an error
  const focusFirstError = (errors) => {
    if (errors.email) {
      emailRef.current?.focus();
    } else if (errors.otp) {
      otpRef.current?.focus();
    } else if (errors.newPassword) {
      newPasswordRef.current?.focus();
    } else if (errors.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }
  };

  const clearFieldErrors = () => setFieldErrors({ email: "", otp: "", newPassword: "", confirmPassword: "", general: "" });

  const handleSubmit = async (ev) => {
    ev?.preventDefault();
    clearFieldErrors();

    // client-side validation
    const clientErrors = {};
    if (!validateEmail(email)) clientErrors.email = "Please enter a valid email address";
    if (!otp || otp.trim().length === 0) clientErrors.otp = "Please provide the OTP sent to your email";
    if (!newPassword || newPassword.length < 6) clientErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) clientErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(clientErrors).length) {
      setFieldErrors((s) => ({ ...s, ...clientErrors }));
      focusFirstError(clientErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim(), otp: otp.trim(), newPassword };
      const resp = await axios.post(API_BASE, payload, { timeout: 10000 });

      // success
      toast.success(resp?.data?.message || "Password reset successful");
      // redirect to login (or dashboard if you prefer)
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err) {
      // default error message
      const networkMsg = "Unable to reach server — please try again.";

      // If axios got a response from the server
      if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;

        // server is expected to return { message: '...' }
        const serverMessage = data?.message || (typeof data === "string" ? data : null);

        // Map known messages to field-specific errors where appropriate
        // (This mapping mirrors your backend messages)
        const errors = { email: "", otp: "", newPassword: "", confirmPassword: "", general: "" };

        if (serverMessage) {
          // Normalize message for easier matching
          const msg = serverMessage.toString().toLowerCase();

          if (msg.includes("email") && msg.includes("required")) {
            errors.email = "Email is required.";
          } else if (msg.includes("email") && (msg.includes("not") || msg.includes("found"))) {
            errors.email = "Email not found.";
          } else if (msg.includes("invalid") && msg.includes("otp")) {
            errors.otp = "Invalid or expired OTP.";
          } else if (msg.includes("incorrect") && msg.includes("otp")) {
            errors.otp = "Incorrect OTP.";
          } else if (msg.includes("expired") && msg.includes("otp")) {
            errors.otp = "OTP has expired — request a new one.";
          } else if (msg.includes("password") && msg.includes("required")) {
            errors.newPassword = "New password is required.";
          } else {
            // fallback: show server message as general error
            errors.general = serverMessage;
          }
        } else {
          errors.general = `Server responded with status ${status}`;
        }

        setFieldErrors(errors);
        // also show toast for immediate notice
        if (errors.general) toast.error(errors.general);
        else if (errors.email) toast.error(errors.email);
        else if (errors.otp) toast.error(errors.otp);
        else if (errors.newPassword) toast.error(errors.newPassword);

        focusFirstError(errors);
      } else if (err?.request) {
        // request made but no response (network error / timeout)
        setFieldErrors((s) => ({ ...s, general: networkMsg }));
        toast.error(networkMsg);
      } else {
        // other errors
        const msg = err?.message || "Reset failed";
        setFieldErrors((s) => ({ ...s, general: msg }));
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: branded panel with logo on white badge */}
        <div
          className="hidden md:flex flex-col items-center justify-center gap-4 p-10"
          style={{ background: "linear-gradient(180deg, rgba(14,30,64,1) 0%, rgba(18,41,84,1) 100%)" }}
        >
          <div className="rounded-md bg-white p-4 drop-shadow-lg">
            <img src="/images/logo.png" alt="Logo" className="w-36 h-auto object-contain" />
          </div>

          <h3 className="text-xl font-semibold text-white">Rock Bridge</h3>
          <p className="text-sm text-indigo-200 text-center max-w-xs">
            Secure access portal — enter your email, OTP, and a new password to reset your account password.
          </p>

          <div className="mt-6 w-full max-w-xs">
            <div className="rounded-lg p-4 bg-white/5 border border-white/6">
              <p className="text-xs text-indigo-200">Quick tips</p>
              <ul className="mt-2 text-sm text-white/80 space-y-1 list-disc list-inside">
                <li>Use the email you registered with</li>
                <li>OTP is trimmed of spaces when sent</li>
                <li>Passwords must be at least 6 characters</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="bg-white p-8 md:p-12 flex items-center">
          <div className="w-full">
            {/* Mobile header with badge */}
            <div className="flex items-center gap-3 mb-6 md:hidden">
              <div className="rounded-md bg-white p-2">
                <img src="/images/logo.png" alt="Logo" className="w-12 h-auto" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Rock Bridge</h3>
                <p className="text-sm text-gray-500">Reset your password</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Reset password</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your email, the OTP you received, and choose a new password.</p>

            {/* general server error (non-field) */}
            {fieldErrors.general ? (
              <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">{fieldErrors.general}</div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <FaEnvelope /> Email
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                    fieldErrors.email ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-orange-300"
                  } bg-gray-50`}
                  required
                />
                {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
              </label>

              <label className="block">
                <span className="text-sm text-gray-600 flex items-center gap-2">OTP</span>
                <input
                  ref={otpRef}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                    fieldErrors.otp ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-orange-300"
                  } bg-gray-50`}
                  required
                />
                {fieldErrors.otp ? <p className="mt-1 text-xs text-red-600">{fieldErrors.otp}</p> : null}
              </label>

              <label className="block relative">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <FaLock /> New password
                </span>
                <div className="mt-2 relative">
                  <input
                    ref={newPasswordRef}
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className={`w-full rounded-lg border px-3 py-2 pr-12 focus:ring-2 focus:border-transparent ${
                      fieldErrors.newPassword ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-orange-300"
                    } bg-gray-50`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white border"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {fieldErrors.newPassword ? <p className="mt-1 text-xs text-red-600">{fieldErrors.newPassword}</p> : null}
              </label>

              <label className="block">
                <span className="text-sm text-gray-600 flex items-center gap-2">Confirm password</span>
                <input
                  ref={confirmPasswordRef}
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:ring-2 focus:border-transparent ${
                    fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-orange-300"
                  } bg-gray-50`}
                  required
                  minLength={6}
                />
                {fieldErrors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p> : null}
              </label>

              <div className="flex items-center justify-between">
                <div />
                <button
                  type="button"
                  onClick={() => {
                    setOtp(otpFromUrl || "");
                    setNewPassword("");
                    setConfirmPassword("");
                    setEmail("");
                    clearFieldErrors();
                  }}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-lg shadow hover:from-orange-600 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset password</span>
                  )}
                </button>

                <button type="button" onClick={() => router.push("/dashboard")} className="px-4 py-3 border rounded-lg">
                  Back to login
                </button>
              </div>
            </form>

            <div className="mt-6 text-xs text-gray-400 text-center">Need help? contact admin@rockbridge.local</div>
          </div>
        </div>
      </div>
    </div>
  );
}
