"use client";

import React, { useContext } from "react";
import { LanguageContext } from "../providers/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useContext(LanguageContext);

  const toggle = () => {
    console.log("toggle click, current lang:", lang);
    if (typeof setLang !== "function") return;
    setLang(lang === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        background: "transparent",
        cursor: "pointer"
      }}
    >
      {lang === "en" ? "AR" : "EN"}
    </button>
  );
}
