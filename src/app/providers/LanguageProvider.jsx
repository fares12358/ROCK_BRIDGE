"use client";

import React, { createContext, useEffect, useState } from "react";

export const LanguageContext = createContext({
  lang: "en",
  setLang: () => {}
});

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    try {
      console.log("lang changed:", lang);
      localStorage.setItem("lang", lang);
    } catch (e) {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
