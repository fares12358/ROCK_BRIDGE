"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaImage, FaList } from "react-icons/fa";
import LoginForm from "../components/LoginForm";
import ServiceTab from "../components/ServiceTab";
import { useAppContext } from "../context/contextApi";
import MediaTab from "../components/MediaTab";
import QuotesTab from "../components/QuotesTab";

export default function DashboardPage() {
  // 1) call all hooks first (in a stable order)
  const [tab, setTab] = useState("service");
  const { user, setUser, isLogin, setIsLogin } = useAppContext();

  // 2) safe early return after hooks are declared
  if (!isLogin) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || user?.email || "user"}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                setUser(null);
                setIsLogin(false);
                toast.success("Logged out");
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-md"
            >
              Logout
            </button>
          </div>
        </header>

        <nav className="mb-6">
          <div className="inline-flex rounded-lg bg-white shadow-sm p-1">
            <button
              onClick={() => setTab("service")}
              className={`px-4 py-2 rounded-md font-medium ${tab === "service" ? "bg-orange-500 text-white" : "text-gray-700"}`}
            >
              Services
            </button>

            <button
              onClick={() => setTab("media")}
              className={`px-4 py-2 rounded-md font-medium ${tab === "media" ? "bg-orange-500 text-white" : "text-gray-700"}`}
            >
              Media
            </button>

            <button
              onClick={() => setTab("quote")}
              className={`px-4 py-2 rounded-md font-medium ${tab === "quote" ? "bg-orange-500 text-white" : "text-gray-700"}`}
            >
              Quotes
            </button>
          </div>
        </nav>

        <main>
          {tab === "service" ? (
            <ServiceTab />
          ) : tab === "media" ? (
            <MediaTab />
          ) : tab === "quote" ? (
            <QuotesTab />
          ) : null}
        </main>

      </div>
    </div>
  );
}
