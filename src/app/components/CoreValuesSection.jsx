import { motion } from "framer-motion";

/* --- Core values (reads from translation) --- */
export function CoreValuesSection({ t }) {
    const values = t?.coreValues?.items ?? [
      { title: "Integrity", text: "We operate with complete transparency and are honest in our dealings." },
      { title: "Accuracy", text: "We are meticulous when approving applications to ensure all details are correct and meet specifications." },
      { title: "Leadership", text: "We keep pace with the latest developments and changes in global trade systems to provide the best solutions." }
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
    
    return (
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.h3 variants={fadeUp} className="text-4xl text-[#9d1e17] font-bold uppercase mb-10">{t?.coreValues?.heading ?? "Core Values"}</motion.h3>
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-[#003767] mb-6">{t?.coreValues?.title ?? "Our Principles"}</motion.h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="bg-gray-50 p-6 rounded-lg shadow hover:scale-103 transition-all duration-300 ">
                <h4 className="font-semibold text-lg mb-2">{v.title}</h4>
                <p className="text-sm text-gray-700">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }
  
  