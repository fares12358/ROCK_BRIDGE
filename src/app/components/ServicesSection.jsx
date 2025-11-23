"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getFullUrl } from "../lib/getFullUrl"; // adjust path to your helper

const API_SERVICES = "http://localhost:5000/api/services";

export function ServicesSection({ t = {}, lang: propLang = undefined }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // detect language: prop overrides t.lang; fallback to 'en'
  const lang = useMemo(() => {
    if (propLang) return propLang === "ar" ? "ar" : "en";
    if (t?.lang && typeof t.lang === "string") {
      return t.lang.toLowerCase().startsWith("ar") ? "ar" : "en";
    }
    // fallback: check direction or sample strings
    if (t?.dir && String(t.dir).toLowerCase() === "rtl") return "ar";
    const sample = t?.site?.name || t?.hero?.title || "";
    if (/[ء-ي]/.test(sample)) return "ar";
    return "en";
  }, [t, propLang]);

  // translation fallbacks
  const fallbackCards = t?.servicesSection?.cards ?? [];
  const heading = t?.servicesSection?.heading ?? "Services";
  const title = t?.servicesSection?.title ?? "Services We Offer";
  const subtitle = t?.servicesSection?.subheading ?? "We provide a wide range of services.";
  const placeholders = t?.servicesSection?.placeholderImage ?? [];

  // fetch services from API
  useEffect(() => {
    let mounted = true;
    const fetchServices = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(API_SERVICES, { timeout: 10000 });
        if (!mounted) return;
        if (Array.isArray(resp?.data)) setServices(resp.data);
        else if (Array.isArray(resp?.data?.services)) setServices(resp.data.services);
        else setServices([]);
      } catch (err) {
        console.error("ServicesSection: fetch error", err);
        toast.error(err?.response?.data?.message || "Could not load services");
        if (mounted) setServices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServices();
    return () => { mounted = false; };
  }, []);

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const renderTitle = (item) => {
    // prefer language-specific fields; fallback to generic title
    if (!item) return "";
    return item[`title_${lang}`] ?? item.title_en ?? item.title_ar ?? item.title ?? "";
  };

  const renderDescription = (item) => {
    if (!item) return "";
    return item[`description_${lang}`] ?? item.description_en ?? item.description_ar ?? item.description ?? item.text ?? "";
  };

  const renderImageUrl = (item, idx) => {
    if (!item) return placeholders[idx] ?? "/images/im-placeholder.jpg";
    // item.img may be full URL or relative path
    const urlCandidate = item.img || item.image || item.imgUrl || "";
    if (!urlCandidate) return placeholders[idx] ?? "/images/im-placeholder.jpg";
    return getFullUrl(urlCandidate);
  };

  return (
    <motion.section
      viewport={{ once: true, amount: 0.12 }}
      variants={containerStagger}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-0">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-5xl text-[#9d1e17] font-bold uppercase">{heading}</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-[#003767] mb-2">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {loading && <div className="text-center text-gray-500">Loading services…</div>}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services.length > 0 ? services : fallbackCards).map((item, index) => {
              const isFallback = services.length === 0;
              const titleText = isFallback ? (item.title ?? item.title_en ?? "") : renderTitle(item);
              const descText = isFallback ? (item.description ?? item.text ?? "") : renderDescription(item);
              const imgUrl = isFallback ? (placeholders[index] ?? "/images/im-placeholder.jpg") : renderImageUrl(item, index);

              return (
                <motion.article key={item._id ?? item.title ?? index} variants={fadeUp} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-102 transition-all duration-300">
                  <div className="h-44 w-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                    <img src={imgUrl} alt={titleText || "service"} className="object-cover w-full h-full" />
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-[#003767]">{titleText}</h3>
                    <p className={`text-sm text-gray-600 ${lang === "ar" ? "text-right" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                      {descText}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}
