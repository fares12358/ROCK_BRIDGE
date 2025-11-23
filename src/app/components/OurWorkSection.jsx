"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { getFullUrl } from "../lib/getFullUrl";
import { FaPlay, FaImage } from "react-icons/fa";

const API_MEDIA = "http://localhost:5000/api/media";

/**
 * OurWorkSection
 * Props:
 *  - t: translation object (optional)
 *  - lang: "en" | "ar" (optional) - if provided, this overrides detection
 */
export default function OurWorkSection({ t = {}, lang: propLang = undefined }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, item: null });

  // language detection (prop overrides t)
  const lang = useMemo(() => {
    if (propLang) return propLang === "ar" ? "ar" : "en";
    if (t?.lang && typeof t.lang === "string") {
      return t.lang.toLowerCase().startsWith("ar") ? "ar" : "en";
    }
    if (t?.dir && String(t.dir).toLowerCase() === "rtl") return "ar";
    const sample = t?.site?.name || t?.hero?.title || "";
    if (/[ء-ي]/.test(sample)) return "ar";
    return "en";
  }, [propLang, t]);

  // heading/title/subtitle — prefer translation object, fallback to default bilingual texts
  const heading = t?.ourWork?.heading ?? (lang === "ar" ? "أعمالنا" : "Our Work");
  const title = t?.ourWork?.title ?? (lang === "ar" ? "معرض الأعمال" : "Recent Work & Media");
  const subtitle = t?.ourWork?.subtitle ?? (lang === "ar" ? "ألقِ نظرة على أحدث مشاريعنا" : "A small sample of recent projects, images and videos.");

  useEffect(() => {
    let mounted = true;
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(API_MEDIA, { timeout: 15000 });
        if (!mounted) return;
        if (Array.isArray(resp.data)) setItems(resp.data);
        else if (Array.isArray(resp.data.media)) setItems(resp.data.media);
        else setItems(resp.data ? [resp.data] : []);
      } catch (err) {
        console.error("OurWorkSection: fetch error", err);
        toast.error(err?.response?.data?.message || (lang === "ar" ? "تعذر تحميل الوسائط" : "Could not load media"));
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMedia();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const renderTitle = (it) => {
    if (!it) return "";
    // prefer language-specific field, then fallbacks
    return it[`title_${lang}`] ?? it.title_en ?? it.title_ar ?? it.title ?? "";
  };

  const renderDescription = (it) => {
    if (!it) return "";
    return it[`description_${lang}`] ?? it.description_en ?? it.description_ar ?? it.description ?? "";
  };

  const renderMediaUrl = (it) => {
    if (!it) return "";
    const candidate = it.mediaUrl || it.url || "";
    if (!candidate) return "";
    return getFullUrl(candidate);
  };

  const openLightbox = (item) => setLightbox({ open: true, item });
  const closeLightbox = () => setLightbox({ open: false, item: null });

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerStagger}
      className="py-20 bg-gray-50"
      id="our-work"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl text-[#9d1e17] font-bold uppercase">{heading}</span>
          </div>

          <h2 className="text-2xl lg:text-4xl font-bold text-[#003767] mb-2">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse h-72" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-12">{lang === "ar" ? "لا توجد عناصر بعد" : "No items yet"}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => {
              const id = it._id || it.id;
              const url = renderMediaUrl(it);
              const isVideo = (it.mediaType || "").toLowerCase() === "video" || (/^video\//i).test(it.mimeType || "");
              const cardTitle = renderTitle(it) || (lang === "ar" ? "بدون عنوان" : "Untitled");
              const cardDesc = renderDescription(it) || "";

              return (
                <motion.article key={id} variants={fadeUp} className="bg-white rounded-xl shadow-md overflow-hidden group">
                  <div
                    className="relative h-56 bg-gray-100 cursor-pointer"
                    onClick={() => openLightbox(it)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(it)}
                    aria-label={cardTitle || (isVideo ? "Video" : "Image")}
                  >
                    {url ? (
                      isVideo ? (
                        <>
                          <video src={url} className="w-full h-full object-cover" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/40 text-white rounded-full p-3">
                              <FaPlay />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img src={url} alt={cardTitle} className="object-cover w-full h-full" loading="lazy" />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <FaImage size={28} />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                      {isVideo ? (lang === "ar" ? "فيديو" : "Video") : (lang === "ar" ? "صورة" : "Image")}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#003767]">{cardTitle}</h3>
                    <p className={`text-sm text-gray-600 mt-2 ${lang === "ar" ? "text-right" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                      {cardDesc}
                    </p>

                    <div className="mt-3 flex items-center justify-end">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openLightbox(it)} className="text-sm px-3 py-1 bg-[#003767] text-white rounded-md hover:opacity-90">
                          {lang === "ar" ? "عرض" : "View"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Lightbox (image/video) */}
        {lightbox.open && lightbox.item && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => closeLightbox()}
          >
            <div className="max-w-5xl w-full max-h-full overflow-hidden rounded-md" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-black">
                <button
                  onClick={() => closeLightbox()}
                  className="absolute top-3 right-3 z-10 bg-black/40 text-white p-2 rounded-full"
                  aria-label={lang === "ar" ? "إغلاق" : "Close"}
                >
                  ✕
                </button>

                {(() => {
                  const it = lightbox.item;
                  const url = renderMediaUrl(it);
                  const isVideo = (it.mediaType || "").toLowerCase() === "video" || (/^video\//i).test(it.mimeType || "");
                  if (!url) return <div className="p-8 text-white">{lang === "ar" ? "معاينة غير متوفرة" : "Preview not available"}</div>;

                  return isVideo ? (
                    <video src={url} controls autoPlay className="w-full h-[70vh] object-contain bg-black" />
                  ) : (
                    <img src={url} alt={renderTitle(it)} className="w-full max-h-[80vh] object-contain" />
                  );
                })()}

                <div className="p-4 bg-black/80 text-white">
                  <div className="font-semibold">{renderTitle(lightbox.item)}</div>
                  <div className="text-sm text-gray-200 mt-1">{renderDescription(lightbox.item)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
