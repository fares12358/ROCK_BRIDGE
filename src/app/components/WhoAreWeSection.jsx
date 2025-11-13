import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

/* --- Who Are We / Vision / Message (reads from translation) --- */
export function WhoAreWeSection({ t = {}, lang: overrideLang } = {}) {
  // detect language (simple heuristics), allow override via prop
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
    // fallback: check if who.title contains Arabic characters
    const maybe = t?.who?.company || "";
    if (/[؀-ۿ]/.test(maybe)) return "ar";
    return "en";
  };

  const lang = overrideLang || detectLang();
  const isRTL = lang === "ar";

  // pull content from translations when available
  const who = t?.who ?? {};
  const heading = who.heading ?? (isRTL ? "من نحن؟" : "Who are we?");
  const company = who.company ?? (isRTL ? "شركة روك بريدج للاستيراد والتصدير" : "ROCK BRIDGE Import and Export Company");
  const description = who.description ?? (isRTL
    ? "منذ أكثر من 16 عامًا نعمل في قلب الأسواق الصينية والخليجية، نبني الجسور بين الموردين والمستوردين لتسهيل حركة التجارة بأعلى درجات الكفاءة والثقة.\n\nنمتلك علاقات وشراكات راسخة مع مصانع صينية موثوقة، وموردين وتجار سعوديين وخليجيين، إلى جانب تعاونات لوجستية مع أبرز شركات الشحن والنقل لضمان سرعة التنفيذ وسلاسة العمليات من المنشأ إلى الوجهة النهائية.\n\nنؤمن أن نجاحنا يبدأ من نجاح عملائنا، لذلك نلتزم دائمًا بتقديم حلول استيراد وتوريد مبتكرة وآمنة، تحقق التوازن المثالي بين الجودة والتكلفة والالتزام بالمواعيد."
    : "For more than 16 years we have operated at the heart of Chinese and Gulf markets, building bridges between suppliers and importers to simplify trade with the highest levels of efficiency and trust.\n\nWe maintain long-standing relationships with trusted Chinese factories, Saudi and Gulf suppliers and traders, and logistics partners including major carriers to ensure fast execution and smooth operations from origin to final destination.\n\nWe believe our success starts with the success of our clients, so we always deliver innovative, secure sourcing solutions that balance quality, cost and on-time performance."
  );

  const visionTitle = who.visionTitle ?? (isRTL ? "رؤيتنا" : "Our Vision");
  const visionText = who.visionText ?? (isRTL
    ? "أن نكون الكيان الرائد في تقديم حلول الوساطة التجارية والتوريد الشامل بين الصين ودول الخليج، من خلال بناء شراكات استراتيجية طويلة الأمد تقوم على الثقة، الشفافية، والمصالح المشتركة، بما يدعم نمو عملائنا وازدهار أسواقنا."
    : "To be the leading provider of commercial mediation and comprehensive sourcing solutions between China and the Gulf, building long-term strategic partnerships grounded in trust, transparency and shared interests to support client growth and market prosperity."
  );

  const messageTitle = who.messageTitle ?? (isRTL ? "رسالتنا" : "Our Message");
  const messageText = who.messageText ?? (isRTL
    ? "تقديم خدمات تفتيش ومراجعة ومتابعة موثوقة وشاملة، لضمان التزام المنتجات والموردين بأعلى معايير الجودة والمواصفات الدولية، وتحقيق تجربة استيراد آمنة، دقيقة، ومستدامة لكل عميل نتعامل معه."
    : "Providing reliable, comprehensive inspection, review and follow-up services to ensure suppliers and products meet the highest international quality and specification standards — delivering a secure, precise and sustainable import experience for every client."
  );

  // numeric / short facts
  const experienceCount = who.experienceCount ?? who.experience ?? (isRTL ? "16+" : "16+");
  const experienceLabel = who.experienceLabel ?? (isRTL ? "سنوات الخبرة" : "Years Experience");
  const headquartersLabel = who.headquartersLabel ?? (isRTL ? "المقر الرئيسي" : "Headquarters");
  const headquartersValue = who.headquartersValue ?? (isRTL ? "المملكة العربية السعودية" : "Saudi Arabia");

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } }
  };

  const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
  const smallPop = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } } };

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-start ${isRTL ? "text-right" : "text-left"}`}>
          <motion.div variants={fadeUp}>
            <h3 className="text-4xl text-[#9d1e17] font-bold uppercase mb-2">{heading}</h3>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#003767] mb-4">{company}</h2>

            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">{description}</p>

            <h4 className="font-semibold text-2xl lg:text-3xl text-[#003767] mt-6">{visionTitle}</h4>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{visionText}</p>

            <h4 className="font-semibold text-2xl lg:text-3xl text-[#003767] mt-4">{messageTitle}</h4>
            <p className="text-gray-700 whitespace-pre-line">{messageText}</p>
          </motion.div>

          <motion.div className="flex flex-col gap-6" variants={fadeUp}>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image src={who.image ?? "/images/poster.png"} alt={company} width={700} height={420} className="w-full h-auto object-cover" />
            </div>

            <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
              <motion.div variants={smallPop} className="bg-[#f8fafc] p-4 rounded-lg shadow flex-1">
                <div className="font-bold text-xl text-[#9d1e17]">{experienceCount}</div>
                <div className="text-sm text-gray-600">{experienceLabel}</div>
              </motion.div>

              <motion.div variants={smallPop} className="bg-[#f8fafc] p-4 rounded-lg shadow flex-1">
                <div className="text-xs text-gray-500">{headquartersLabel}</div>
                <div className="font-bold text-xl text-[#9d1e17]">{headquartersValue}</div>
                <div className="text-sm text-gray-600">{who.operating ?? (isRTL ? "العمل محلياً ودولياً" : "Operating locally & internationally")}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
