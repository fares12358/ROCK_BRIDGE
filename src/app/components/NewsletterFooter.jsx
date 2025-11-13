import { motion } from "framer-motion";
import Image from "next/image";

/* --- Newsletter + Footer (reads from translation) --- */
export function NewsletterFooter({ t }) {
  const n = t?.newsletter ?? {};
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeUp} className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 relative -top-20">
      <div className="bg-[#08355a] rounded-xl shadow-xl p-8 mt- flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{n.title ?? "Subscribe Our Newsletter To Get The Latest News From Us!"}</h3>
          <p className="text-white/80 mb-4">{n.subtitle ?? "Sign up and stay updated with our latest offers and company news."}</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input type="email" placeholder={n.placeholder ?? "Your Email"} className="px-4 py-3 rounded-md w-full max-w-md border focus:outline-none" />
            <button className="bg-[#9d1e17] text-white px-5 py-3 rounded-md font-semibold hover:scale-102 cursor-pointer transition-all duration-300 ">{n.subscribe ?? "Subscribe"}</button>
          </div>
        </div>

        <div className="w-48 h-48 relative hidden md:block">
          <Image src="/images/newsletter-person.png" alt="Delivery person" fill className="object-contain" />
        </div>
      </div>
    </motion.section>
  );
}

