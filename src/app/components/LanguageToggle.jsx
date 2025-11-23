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
      className="cursor-pointer bg-transparent border border-[#ddd] text-[#ddd] py-[8px] px-[12px] rounded-[8px]"
    >
      {lang === "en" ? "AR" : "EN"}
    </button>
  );
}
