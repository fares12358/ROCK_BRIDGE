import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* translations (fallbacks) */
export const howWeWorkEn = {
  title: "How We Work",
  subtitle: "5 illustrated steps to move your shipments",
  cta: "Request a Quote",
  steps: [
    { id: 1, title: "Request a Quote", desc: "Send us details about your cargo and requirements.", icon: "request" },
    { id: 2, title: "HS Code Review", desc: "We review product HS codes and compliance requirements.", icon: "search" },
    { id: 3, title: "Pricing & Incoterms", desc: "Receive pricing and recommended Incoterms for your shipment.", icon: "price" },
    { id: 4, title: "Ship / Inspect", desc: "We handle shipment execution and inspection as needed.", icon: "ship" },
    { id: 5, title: "Delivery & Clearance", desc: "Final delivery and customs clearance handled end-to-end.", icon: "delivery" }
  ]
};

export const howWeWorkAr = {
  title: "كيف نعمل؟",
  subtitle: "5 خطوات مصورة: طلب عرض سعر → مراجعة HS Code → عرض تسعير + إنكوتيرمز → تنفيذ الشحن/الفحص → التسليم/التخليص",
  cta: "اطلب عرض سعر",
  steps: [
    { id: 1, title: "طلب عرض سعر", desc: "أرسل لنا تفاصيل البضاعة والمتطلبات الخاصة بك.", icon: "request" },
    { id: 2, title: "مراجعة HS Code", desc: "نقوم بمراجعة رموز التعريفة HS ومتطلبات المطابقة.", icon: "search" },
    { id: 3, title: "عرض تسعير و إنكوتيرمز", desc: "استلم عرض الأسعار واقتراحات إنكوتيرمز المناسبة.", icon: "price" },
    { id: 4, title: "تنفيذ الشحن / الفحص", desc: "نتولى تنفيذ الشحن وإجراءات الفحص حسب الحاجة.", icon: "ship" },
    { id: 5, title: "التسليم و التخليص", desc: "التسليم النهائي والتخليص الجمركي بنهاية الخدمة.", icon: "delivery" }
  ]
};

/* Icon renderer (same as before) */
const Icon = ({ name, className = "w-8 h-8" }) => {
  switch (name) {
    case "request":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 7H4v10a2 2 0 002 2h12a2 2 0 002-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "search":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "price":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 1v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "ship":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 10h18v5H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10V6h8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "delivery":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 7h13l4 4v6H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="1" fill="currentColor" />
          <circle cx="17" cy="18" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return <div className={className} />;
  }
};

/**
 * HowWeWorkSection
 *
 * Props:
 * - t: translation object (expected shape: t.howWeWork or t.lang / t.dir etc.)
 * - lang: optional override ('en'|'ar')
 */
export default function HowWeWorkSection({ t = {}, lang: overrideLang } = {}) {
  // Detect language: priority order
  const detectLangFromT = () => {
    if (!t) return null;
    // common keys used by i18n objects
    const possible = [t.lang, t.locale, t.currentLocale, t.localeCode, t.language];
    for (const v of possible) {
      if (typeof v === "string") {
        const lower = v.toLowerCase();
        if (lower.startsWith("ar")) return "ar";
        if (lower.startsWith("en")) return "en";
      }
    }
    // some systems put direction or nested metadata
    if (t.dir && typeof t.dir === "string" && t.dir.toLowerCase() === "rtl") return "ar";
    if (t.locale && typeof t.locale === "string") {
      if (t.locale.toLowerCase().includes("ar")) return "ar";
    }
    // fallback: if translation object contains Arabic-looking keys
    if (t.howWeWork) {
      // quick heuristic: check title contains Arabic characters
      const title = t.howWeWork.title || "";
      if (/[؀-ۿ]/.test(title)) return "ar";
    }
    return null;
  };

  const detected = overrideLang || detectLangFromT() || "en";
  const isRTL = detected === "ar" || (t.dir && t.dir === "rtl");

  // prefer passed in translations (t.howWeWork); otherwise fallback to builtin objects
  const data = t?.howWeWork ?? (detected === "ar" ? howWeWorkAr : howWeWorkEn);

  // safe defaults
  const title = data?.title ?? (detected === "ar" ? howWeWorkAr.title : howWeWorkEn.title);
  const subtitle = data?.subtitle ?? (detected === "ar" ? howWeWorkAr.subtitle : howWeWorkEn.subtitle);
  const steps = Array.isArray(data?.steps) ? data.steps : (detected === "ar" ? howWeWorkAr.steps : howWeWorkEn.steps);
  const ctaText = data?.cta ?? (detected === "ar" ? howWeWorkAr.cta : howWeWorkEn.cta);
  const contactEmail = t?.contactEmail || t?.contact?.email || "Window.ksa30@gmail.com";

  return (
    <section id={isRTL ? "كيف-نعمل" : "how-we-work"} dir={isRTL ? "rtl" : "ltr"} className="py-14 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-0">
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`}>
          {steps.map((step) => (
            <motion.article
              key={step.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#9d1e17] to-[#003767] text-white flex items-center justify-center shadow-md">
                    <Icon name={step.icon} className="w-7 h-7 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{step.desc}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="text-sm text-gray-500">{isRTL ? `الخطوة ${step.id}` : `Step ${step.id}`}</div>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#9d1e17] to-[#003767]" style={{ width: `${(step.id / steps.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href={'/get-offer'}
            onClick={() => (window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(ctaText)}`)}
            className="inline-block bg-[#9d1e17] text-white px-6 py-3 rounded-md font-semibold shadow"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
