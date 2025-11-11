"use client";

import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../providers/LanguageProvider";

export default function useTranslation() {
  const { lang } = useContext(LanguageContext);
  const [t, setT] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const path = `/locales/${lang}.json`;
    console.log("fetching translations:", path);

    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load translations: " + r.status);
        return r.json();
      })
      .then((json) => {
        if (mounted) setT(json);
      })
      .catch((err) => {
        console.error("translation load error:", err);
        if (mounted) setT({});
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [lang]);

  return { t, lang, loading };
}
