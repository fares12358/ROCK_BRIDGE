import { motion } from "framer-motion";

/* --- What Distinguishes Us (reads from translation) --- */
export function DistinguishSection({ t }) {
  // read items from translations, fallback to defaults below
  const items = t?.distinguish?.items ?? [
    { key: "experience", title: "Experience", text: "In-depth knowledge of the technical regulations and regulatory legislation of the target countries." },
    { key: "speed", title: "Speed", text: "Reducing waiting time through the ability to complete processes from manufacturing and shipping to the final destination." },
    { key: "prices", title: "Prices", text: "Competitive pricing and guaranteed quality through a wide network of trusted factories and global markets." },
    { key: "compliance", title: "Compliance", text: "Ensuring products conform to local and governmental requirements and specifications." },
    { key: "neutrality", title: "Neutrality", text: "We are a neutral third party that enhances transparency and credibility in commercial mediation." }
  ];

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

  // icon mapper - small inline SVGs
  const Icon = ({ name, className = "w-6 h-6" }) => {
    const common = { stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" };
    switch (name) {
      case "prices":
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 1v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "speed":
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 12h3l2-4 4 8 6-6 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          </svg>
        );
      case "experience":
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2l2.9 6.3L21 9l-5 3.7L17.8 21 12 17.8 6.2 21 8 12.7 3 9l6.1-0.7L12 2z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" />
          </svg>
        );
      case "neutrality":
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="7" cy="12" r="2" fill="currentColor"/>
            <circle cx="17" cy="12" r="2" fill="currentColor"/>
          </svg>
        );
      case "compliance":
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          </svg>
        );
      default:
        return (
          <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        );
    }
  };

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h3 variants={fadeUp} className="md:text-4xl text-2xl text-[#9d1e17] font-bold uppercase mb-2">{t?.distinguish?.heading ?? "What distinguishes us"}</motion.h3>
          <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-bold text-[#003767]">{t?.distinguish?.title ?? "Why choose ROCK BRIDGE"}</motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="bg-white p-6 rounded-lg shadow hover:scale-103 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gradient-to-br from-[#9d1e17] to-[#003767] text-white">
                  <Icon name={f.key || f.icon || f.title.toLowerCase()} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{f.title}</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{f.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
