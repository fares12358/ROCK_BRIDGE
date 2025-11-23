// app/get-offer/page.jsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function GetOfferPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  // optional base for API (set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local if needed)
  const API_BASE = 'http://localhost:5000';

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.phone.trim()) e.phone = "Please enter your phone";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!emailPattern.test(form.email)) e.email = "Please enter a valid email";
    if (!form.message.trim()) e.message = "Please enter a message or details";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: null, error: null });

    if (!validate()) return;

    try {
      setStatus({ loading: true, success: null, error: null });

      const url = `${API_BASE}/api/quotes` ;

      const resp = await axios.post(
        url,
        { ...form },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      // success
      toast.success(resp?.data?.message || "Request sent — we'll contact you soon");
      setStatus({ loading: false, success: "Request sent! We will contact you soon.", error: null });
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      // prefer server message
      const serverMsg = err?.response?.data?.message || (err?.response?.data && JSON.stringify(err.response.data)) || err.message;
      toast.error(serverMsg || "Failed to send request");
      setStatus({ loading: false, success: null, error: serverMsg || "Failed to send request" });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#9d1e17] to-[#003767] flex items-center justify-center text-white font-bold">
              OF
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003767]">Get Offer</h1>
              <p className="text-gray-600 text-sm">Fill the form and our team will prepare a tailored offer for you.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Full name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003767] ${errors.name ? "border-red-400" : "border-gray-200"}`}
                  placeholder="Your Name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003767] ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                  placeholder="+966 5xxxxxxxx"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
              </label>

              <label className="flex flex-col sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003767] ${errors.email ? "border-red-400" : "border-gray-200"}`}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
              </label>

              <label className="flex flex-col sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Message / Details</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#003767] ${errors.message ? "border-red-400" : "border-gray-200"}`}
                  placeholder="Tell us about the cargo, HS code (if any), origin, destination, incoterms you prefer..."
                  aria-invalid={!!errors.message}
                />
                {errors.message && <span className="text-xs text-red-500 mt-1">{errors.message}</span>}
              </label>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={status.loading}
                className="inline-flex items-center gap-2 bg-[#003767] text-white px-5 py-2 rounded-md font-semibold disabled:opacity-60"
              >
                {status.loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" fill="none" /></svg>
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", phone: "", email: "", message: "" });
                  setErrors({});
                  setStatus({ loading: false, success: null, error: null });
                }}
                className="px-4 py-2 rounded-md border text-sm"
              >
                Reset
              </button>
            </div>

            {status.success && <div className="mt-4 text-green-600 font-medium">{status.success}</div>}
            {status.error && <div className="mt-4 text-red-600 font-medium">{status.error}</div>}
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          We will contact you within 1 business day. Your details remain private — handled per company policy.
        </div>
      </div>
    </main>
  );
}
