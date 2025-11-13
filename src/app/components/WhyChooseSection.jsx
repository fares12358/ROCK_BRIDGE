import { motion } from "framer-motion";

/* --- WhyChooseSection (improved UI + icons + reads from t.why) --- */
export function WhyChooseSection({ t = {}, lang: overrideLang } = {}) {
  // detect language quickly (allow override)
  const detectLang = () => {
    const possible = [t.lang, t.locale, t.currentLocale, t.language];
    for (const v of possible) {
      if (typeof v === "string") {
        const lower = v.toLowerCase();
        if (lower.startsWith("ar")) return "ar";
        if (lower.startsWith("en")) return "en";
      }
    }
    if (t.dir && typeof t.dir === "string" && t.dir.toLowerCase() === "rtl") return "ar";
    return "en";
  };
  const lang = overrideLang || detectLang();
  const isRTL = lang === "ar";

  // translation-driven items (fallback defaults)
  const items = t?.why?.items ?? [
    { key: "network", title: "Trusted Factory Network", text: "Certified factory network in China and the Gulf." },
    { key: "incoterms", title: "Clear Customs & Incoterms", text: "Clear customs estimates and Incoterms before execution." },
    { key: "transit", title: "Competitive Transit Times", text: "Competitive shipping times with real-time tracking." },
    { key: "compliance", title: "Specification Compliance", text: "Commitment to specs, tests and regulatory compliance." }
  ];

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.06 } }
  };
  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

  // Icon mapper
  const Icon = ({ name }) => {
    switch ((name || "").toString().toLowerCase()) {
      case "network":
      case "factories":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h4v4H4zM16 7h4v4h-4zM10 14h4v4h-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 9.5L12 12l4-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "incoterms":
      case "customs":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 7h18M7 21V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 21v-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "transit":
      case "shipping":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 13h14l4 4V7H3v6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 21h.01M17 21h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "compliance":
      default:
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#9d1e17] uppercase">{t?.why?.heading ?? (isRTL ? "لماذا تختارنا" : "Why Choose Us")}</motion.h3>
          <motion.p variants={fadeUp} className="mt-3 text-[#003767] text-lg md:text-xl font-semibold">{t?.why?.title ?? (isRTL ? "نضمن حلول متميزة من روك بريدج لأداء أعمال مثالي" : "Ensuring Superior Solutions at ROCK BRIDGE For Optimal Business Performance")}</motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((it, idx) => (
            <motion.article key={it.title + idx} variants={fadeUp} className="flex gap-4 items-start p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#9d1e17] to-[#003767] text-white shrink-0">
                <Icon name={it.key || it.icon || it.title} />
              </div>

              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <h4 className="font-semibold text-lg">{it.title}</h4>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{it.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
