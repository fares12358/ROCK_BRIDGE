"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import LanguageToggle from "./components/LanguageToggle";
import useTranslation from "./lib/useTranslation";
import Image from "next/image";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "./components/Footer";
import { ServicesSection } from "./components/ServicesSection";
import { WhoAreWeSection } from "./components/WhoAreWeSection";
import { DistinguishSection } from "./components/DistinguishSection";
import { CoreValuesSection } from "./components/CoreValuesSection";
import { TourismSection } from "./components/TourismSection";
import { WhyChooseSection } from "./components/WhyChooseSection";
import { ContactCTA } from "./components/ContactCTA";
import HowWeWorkSection from "./components/HowWeWorkSection";
import Link from "next/link";
import MarketsAndSectorsSection from "./components/MarketsAndSectorsSection";
import OurWorkSection from "./components/OurWorkSection";

/* -------------------------
   Motion variants (subtle)
   ------------------------- */

const containerStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const slideIn = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.5 } },
};

/* -------------------------
   Fallback slides (language-agnostic)
   ------------------------- */
const slidesFallback = [
  {
    id: 1,
    type: "image",
    src: "/images/im4.jpg",
    srcAr: "/images/im4.jpg",
    alt: "Cargo hub at sunrise",
    altAr: "مركز شحن عند شروق الشمس",
    title: "Global Cargo Solutions",
    titleAr: "حلول شحن عالمية",
    subtitle: "Fast • Secure • Reliable",
    subtitleAr: "سريع • آمن • موثوق"
  },
  {
    id: 2,
    type: "image",
    src: "/images/im100.jpg",
    srcAr: "/images/im100.jpg",
    alt: "Container ship port",
    altAr: "ميناء حاويات",
    title: "Sea Freight & Logistics",
    titleAr: "الشحن البحري والخدمات اللوجستية",
    subtitle: "Worldwide routes",
    subtitleAr: "شبكات شحن عالمية"
  },
  {
    id: 3,
    type: "image",
    src: "/images/im101.jpg",
    srcAr: "/images/im101.jpg",
    alt: "Air freight plane",
    altAr: "شحن جوي",
    title: "Air Cargo Services",
    titleAr: "خدمات الشحن الجوي",
    subtitle: "Speed when you need it",
    subtitleAr: "السرعة عندما تحتاجها"
  }
];

const AUTO_ADVANCE_MS_DEFAULT = 4000;

/* default nav order keys (we'll map to translations) */
const NAV_KEYS_ORDER = ["home", "services", "who", "distinguish", "core-values", "tourism", "why"];

const EMAIL = "Window.ksa30@gmail.com";

/* --- Page component --- */
export default function Page() {
  const { t, loading } = useTranslation();

  // Detect language & RTL
  const detectLang = () => {
    if (!t) return "en";
    if (typeof t.lang === "string") {
      if (t.lang.toLowerCase().startsWith("ar")) return "ar";
      if (t.lang.toLowerCase().startsWith("en")) return "en";
    }
    if (t.dir && t.dir.toLowerCase && t.dir.toLowerCase() === "rtl") return "ar";
    const sample = t?.site?.name || t?.hero?.title || "";
    if (/[ء-ي]/.test(sample)) return "ar";
    return "en";
  };
  const lang = detectLang();
  const isRTL = lang === "ar";

  // Hero texts
  const heroTag = t?.hero?.tagline ?? (t?.heroTagline ?? "LOGISTIC CARGO & TRANSPORTATION");
  const heroTitle = loading ? "..." : (t?.title ?? t?.hero?.title ?? "Connecting Your Business To The World Through Reliable Logistics");
  const heroCta = t?.hero?.cta ?? "Our Service";
  const heroDescription = t?.hero?.description ?? t?.hero?.subtitle ?? "We connect your business with global markets through ROCK BRIDGE solutions.";

  // slides: prefer t.hero.slides, fallback to slidesFallback
  const slides = useMemo(() => {
    const raw = t?.hero?.slides ?? slidesFallback;
    return raw.map((s, idx) => {
      const id = s.id ?? idx;
      const type = s.type ?? "image";
      const src = lang === "ar" ? (s.srcAr ?? s.src) : (s.srcEn ?? s.src);
      const alt = lang === "ar" ? (s.altAr ?? s.alt ?? "") : (s.altEn ?? s.alt ?? "");
      const title = lang === "ar" ? (s.titleAr ?? s.title ?? "") : (s.titleEn ?? s.title ?? s.title ?? "");
      const subtitle = lang === "ar" ? (s.subtitleAr ?? s.subtitle ?? "") : (s.subtitleEn ?? s.subtitle ?? s.subtitle ?? "");
      return { id, type, src, alt, title, subtitle, raw: s };
    });
  }, [t, lang]);

  // build nav items using t.nav (preserve order), fallback to prettified keys
  const navItems = useMemo(() => {
    const nav = t?.nav ?? {};
    return NAV_KEYS_ORDER.map((key) => {
      const candidates = [
        nav[key],
        nav[key.replace(/-/g, "_")],
        nav[key.replace(/-/g, "")],
        nav[camelize(key)],
      ];
      const label = candidates.find(Boolean) ?? prettifyKey(key, isRTL);
      return { id: key, label };
    });
  }, [t, isRTL]);

  // slider state
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoAdvanceMs] = useState(AUTO_ADVANCE_MS_DEFAULT);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef({});

  // nav/mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // slider helpers
  const goTo = useCallback((i) => {
    setIndex((prev) => {
      const next = (i + slides.length) % slides.length;
      return next;
    });
  }, [slides.length]);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // progress & auto-advance
  useEffect(() => {
    setProgress(0);
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    if (isPaused) return;

    const current = slides[index];
    if (!current) return;

    const totalMs = autoAdvanceMs;
    const stepMs = 40;
    const steps = Math.max(1, Math.floor(totalMs / stepMs));
    let step = 0;
    setProgress(0);

    progressRef.current = setInterval(() => {
      step += 1;
      const p = Math.min(100, (step / steps) * 100);
      setProgress(p);
    }, stepMs);

    timerRef.current = setTimeout(() => {
      clearInterval(progressRef.current);
      progressRef.current = null;
      setProgress(100);
      next();
    }, totalMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    };
  }, [index, isPaused, autoAdvanceMs, slides, next]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsPaused((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // observe sections
  useEffect(() => {
    const ids = ["home", "services", "who", "distinguish", "core-values", "tourism", "why"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "0px 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // scroll helper (smooth) + update hash
  const scrollToId = useCallback((id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try { history.replaceState(null, "", `#${id}`); } catch (e) { }
      setTimeout(() => {
        try { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); } catch (e) { }
      }, 600);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      try { history.replaceState(null, "", `#${id}`); } catch (e) { }
    }
  }, []);

  // controls
  const togglePlay = () => setIsPaused((p) => !p);
  const handleThumbClick = (i) => { setIndex(i); setIsPaused(false); };
  const currentSlide = slides[index];
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // ---------- ACTION BUTTONS (WhatsApp & Get Offer) ----------
  const getWhatsappNumber = () => {
    const phoneCandidates = [
      t?.whatsapp?.phone,
      t?.whatsapp?.number,
      t?.footer?.contact?.phone,
      t?.contact?.phone
    ];
    const raw = phoneCandidates.find(Boolean) ?? "";
    return raw;
  };

  const formatWa = (raw) => {
    if (!raw) return "";
    const digits = raw.replace(/[^\d+]/g, "");
    return digits.replace(/^\+/, "");
  };

  const handleWhatsApp = () => {
    const number = '+8613711197481';
    if (!number) {
      window.open("https://web.whatsapp.com/", "_blank");
      return;
    }
    const text = encodeURIComponent(t?.whatsapp?.message ?? "");
    window.open(`https://wa.me/${number}${text ? `?text=${text}` : ""}`, "_blank");
  };

  const handleGetOffer = () => {
    const subject = encodeURIComponent(t?.getOffer?.subject ?? (isRTL ? "طلب عرض" : "Get Offer from Website"));
    const mail = t?.contact?.email ?? t?.footer?.contact?.email ?? EMAIL;
    window.location.href = `mailto:${mail}?subject=${subject}`;
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white font-sans text-gray-900 relative">
      {/* Glass Header / Nav */}
      <motion.header initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="absolute inset-x-0 top-0 z-50" aria-label="Main navigation">
        <div className="backdrop-blur-md bg-white/18 border-b border-white/8" style={{ WebkitBackdropFilter: "blur(8px)" }}>
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 ">
            <div className="flex items-center justify-between gap-4">
              <button onClick={() => scrollToId("home")} className="flex items-center gap-3 focus:outline-none" aria-label="Home">
                <Image src="/images/logo.png" alt={t?.site?.name ?? (isRTL ? "روك بريدج" : "ROCK BRIDGE")} width={96} height={40} className="object-contain" />
              </button>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-4">

              {/* Slide preview */}
              {currentSlide && (
                <div className="hidden lg:flex items-center gap-3 bg-white/6 px-2 py-1 rounded-md ">
                  <div className="w-12 h-8 relative rounded-sm overflow-hidden bg-gray-200">
                    <Image src={currentSlide.src} alt={currentSlide.alt} fill style={{ objectFit: "cover" }} sizes="48px" />
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="text-white/95 font-semibold leading-tight">{currentSlide.title}</span>
                    <span className="text-white/70 leading-tight">{currentSlide.subtitle}</span>
                  </div>
                </div>
              )}

              {/* Desktop nav tabs - use anchors for proper browser behavior */}
              <nav className="hidden lg:flex items-center justify-center gap-2 ml-4 text-xl" aria-label="Primary">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(item.id);
                    }}
                    className="relative px-3 py-2 rounded-md text-ةي font-medium transition-colors text-white/90 hover:text-white"
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    <span className={activeSection === item.id ? "text-[#003767] font-semibold" : ""}>{item.label}</span>
                    {activeSection === item.id && (
                      <motion.span layoutId="nav-underline" className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-0.5 w-10 bg-[#003767] rounded" />
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                {/* Use button for mailto behaviour */}
                <Link href={'/get-offer'}
                  className="bg-[#9d1e17] text-white px-4 py-2 rounded-md text-md font-semibold shadow-sm hover:scale-[1.02] transition-transform"
                >
                  {t?.nav?.getOffer ?? (isRTL ? "اطلب عرض" : "Get Offer")}
                </Link>
                <LanguageToggle />
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden flex items-center">
                <button onClick={() => setMobileOpen((s) => !s)} aria-expanded={mobileOpen} aria-label="Toggle menu" className="p-2 rounded-md bg-white/20 hover:bg-white/30">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    {mobileOpen ? (
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          {mobileOpen && (
            <div className="lg:hidden bg-white/6 backdrop-blur-sm border-t border-white/8">
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToId(item.id); }}
                    className={`w-full block text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${activeSection === item.id ? "text-[#003767] bg-white/20" : "text-white/90 hover:bg-white/10"}`}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="pt-2 border-t border-white/8">
                  <Link href={'/get-offer'} className="w-full block text-left bg-[#9d1e17] text-white px-3 py-2 rounded-md font-semibold">
                    {t?.nav?.getOffer ?? (isRTL ? "اطلب عرض" : "Get Offer")}
                  </Link>
                </div>
                <div className="pt-2">
                  <LanguageToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.header>

      {/* HERO SLIDER */}
      <section aria-label="Hero slider" className="relative w-full h-[calc(70vh)] overflow-hidden select-none">
        {/* media layer */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} mode="wait">
            {slides.map((slide, i) => i === index && (
              <motion.div key={slide.id} variants={slideIn} initial="initial" animate="animate" exit="exit" className="absolute inset-0 z-10">
                {slide.type === "image" ? (
                  <div className="w-full h-full relative filter brightness-75">
                    <Image src={slide.src} alt={slide.alt ?? ""} fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
                  </div>
                ) : (
                  <video
                    ref={(el) => { if (el) videoRefs.current[slide.id] = el; }}
                    className="w-full h-full object-cover filter brightness-75"
                    src={slide.src}
                    playsInline
                    muted
                    controls={false}
                    autoPlay
                    aria-label={slide.alt ?? "Hero video"}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* stronger overlay (darker to improve contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/16 to-black/65 z-20 pointer-events-none" />

        <div className="absolute inset-0 z-30 flex items-center ">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-0 w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerStagger} className="py-20 md:py-28 lg:py-32">
              <div className={`flex flex-col lg:flex-row items-start gap-8 ${isRTL ? "text-right" : "text-left"}`}>
                <motion.div variants={fadeUp} className="w-full lg:w-1/2 z-20 text-white">
                  {/* Make text readable: semi-opaque panel + blur + padding + rounded + drop shadow */}
                  <div className="inline-block bg-black/20 backdrop-blur-sm p-6 rounded-lg">
                    <p className="text-white/90 font-bold text-sm sm:text-base tracking-wide mb-3">{currentSlide?.subtitle ?? heroTag}</p>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]">
                      {currentSlide?.title ?? heroTitle}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => scrollToId("services")} className="inline-block bg-[#003767] text-white font-semibold px-6 py-3 rounded-lg cursor-pointer text-sm hover:scale-[1.03] transition-transform">
                        {heroCta}
                      </button>
                      <Link href={'/get-offer'} className="inline-block bg-white/90 text-[#003767] font-semibold px-4 py-3 rounded-lg cursor-pointer text-sm hover:scale-[1.03] transition-transform">
                        {t?.nav?.getOffer ?? (isRTL ? "اطلب عرض" : "Get Offer")}
                      </Link>

                      <button onClick={togglePlay} aria-pressed={isPaused} className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20">
                        {isPaused ? (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3v18h4V3H5zM15 3v18h4V3h-4z" strokeWidth="1.5" /></svg>
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 3l14 9-14 9V3z" strokeWidth="1.5" /></svg>
                        )}
                        <span className="text-xs">{isPaused ? (isRTL ? "موقوف" : "Paused") : (isRTL ? "تشغيل" : "Playing")}</span>
                      </button>
                    </div>

                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/95 max-w-xl leading-relaxed whitespace-pre-line">
                      {heroDescription}
                    </p>

                    <p className="text-sm text-white/80 max-w-xl mt-4">{t?.hero?.extra ?? ""}</p>
                  </div>
                </motion.div>

                {/* Right side - thumbnail list and progress */}
                <div className="w-full lg:w-1/2 z-20 lg:flex flex-col items-stretch gap-4 hidden">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#9d1e17] to-[#003767]" style={{ width: `${progress}%`, transition: "width 40ms linear" }} />
                  </div>

                  <div className="hidden sm:flex items-center gap-3 overflow-x-auto py-2">
                    {slides.map((s, i) => (
                      <button key={s.id} onClick={() => handleThumbClick(i)} className={`flex items-center gap-3 py-1 px-2 rounded-md min-w-[220px] hover:bg-white/6 transition-colors ${i === index ? "ring-2 ring-white/30 bg-white/6" : "bg-white/3"}`} aria-current={i === index ? "true" : undefined}>
                        <div className="w-20 h-12 relative rounded-sm overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image src={s.src} alt={s.alt} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white/95">{s.title}</span>
                          <span className="text-xs text-white/70">{s.subtitle}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={prev} className="p-2 rounded-md bg-white/10 hover:bg-white/20">‹</button>
                    <button onClick={next} className="p-2 rounded-md bg-white/10 hover:bg-white/20">›</button>
                    <div className="ml-3 text-xs text-white/70">{isRTL ? "استخدم ← → أو الصور المصغرة للتنقل" : "Use ← → keys or thumbnails to navigate"}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-6 z-40 hidden lg:block">
          <div className="flex gap-3 items-center">
            {slides.map((_, i) => (
              <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} className={`w-3 h-3 rounded-full transition-all ${i === index ? "scale-125 bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Content sections — each wrapped with the ID the nav uses */}
      <div id="home" className="sr-only" />

      <section id="services" aria-labelledby="services-heading">
        <ServicesSection t={t} />
      </section>
      <section id="services" aria-labelledby="services-heading">
        <OurWorkSection t={t} />
      </section>

      <section id="how-we-work" aria-labelledby="how-we-work-heading">
        <HowWeWorkSection t={t} />
      </section>

      <MarketsAndSectorsSection t={t} />
      <section id="who" aria-labelledby="who-heading">
        <WhoAreWeSection t={t} />
      </section>

      <section id="distinguish" aria-labelledby="distinguish-heading">
        <DistinguishSection t={t} />
      </section>

      <section id="core-values" aria-labelledby="core-values-heading">
        <CoreValuesSection t={t} />
      </section>
      <section id="tourism" aria-labelledby="tourism-heading">
        <TourismSection t={t} />
      </section>

      <section id="why" aria-labelledby="why-heading">
        <WhyChooseSection t={t} />
      </section>

      <section id="contact" aria-labelledby="contact-heading">
        <ContactCTA t={t} />
      </section>

      <ScrollToTopButton />
      <Footer t={t} />

      {/* ---------- Fixed action buttons ---------- */}
      <div aria-hidden={false} className={`fixed bottom-20 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <div className="flex flex-col items-end gap-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            aria-label={t?.whatsapp?.title ?? (isRTL ? "تواصل عبر واتساب" : "Contact via WhatsApp")}
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M21 11.5a8.5 8.5 0 10-3.4 6.6L21 21l-3.5-0.9A8.5 8.5 0 0021 11.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 14.5c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.2-.9.9-1.1 1.1-.2.3-.4.3-.7.1-.3-.2-1.2-.4-2.2-1.3-.8-.8-1.4-1.8-1.6-2.1-.2-.3 0-.5.1-.7.1-.2.3-.5.5-.8.1-.2.1-.3 0-.5-.1-.1-.7-1.6-.9-2.1-.2-.5-.4-.4-.7-.4-.3 0-.6 0-.9 0-.3 0-.7.1-1 .4-.4.4-1 1-1 2.4 0 1.5 1.1 3 1.2 3.3.1.3 1.9 3 4.8 4.3 3 .8 3 .5 3.5.5.6 0 2.1-.8 2.4-1.6.3-.8.3-1.3.2-1.4z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">{t?.whatsapp?.cta ?? (isRTL ? "الدردشة عبر واتساب" : "Chat on WhatsApp")}</span>
          </button>

          {/* Get Offer */}
          <Link href={'/get-offer'}
            aria-label={t?.nav?.getOffer ?? (isRTL ? "اطلب عرض" : "Get Offer")}
            className="flex items-center gap-3 bg-[#9d1e17] hover:bg-[#7f1a15] text-white px-4 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9d1e17]/40"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M3 7h18M3 12h12M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">{t?.nav?.getOffer ?? (isRTL ? "اطلب عرض" : "Get Offer")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

/* -------------------------
   Helpers
   ------------------------- */
function camelize(str = "") {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}
function prettifyKey(k = "", isRTL = false) {
  const mappedAr = {
    home: "الرئيسية",
    services: "خدماتنا",
    who: "من نحن",
    distinguish: "ما الذي يميزنا",
    "core-values": "القيم الأساسية",
    tourism: "السياحة",
    why: "لماذا تختارنا",
  };
  if (isRTL && mappedAr[k]) return mappedAr[k];
  return k.replace(/[-_]/g, " ").split(" ").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}
