import { motion } from "framer-motion";

/* --- Tourism paragraph (reads from translation) --- */
export function TourismSection({ t }) {
    const tourism = t?.tourism ?? {};
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
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-16 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
                <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-lg p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-4xl text-[#9d1e17] font-bold uppercase mb-10">{tourism.heading ?? "Tourism"}</h3>
                            <h2 className="text-xl md:text-2xl font-bold text-[#003767] mb-4">{tourism.title ?? "A Unique Tourism Experience to China"}</h2>
                            <p className="text-gray-700 leading-relaxed">{tourism.text ?? ""}</p>
                        </div>

                        <div className="rounded-lg overflow-hidden shadow">
                            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400"><img src="/images/tr.jpg" alt="tourism" /></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
