import { motion } from "framer-motion";

import { NewsletterFooter } from "./NewsletterFooter";
import Image from "next/image";

export function Footer({ t }) {
  const footer = t?.footer ?? {};
  const footerAbout = t?.footer?.about ?? t?.footer ?? "ROCK BRIDGE - Commercial mediation and export/import solutions tailored for global markets.";
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };
  return (
    <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeIn} className="mt-16 bg-[#9d1e17] text-white">
      <NewsletterFooter t={t} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image src="/images/logo.png" alt={t?.site?.name ?? "ROCK BRIDGE"} width={160} height={48} className="object-contain mb-4" />
            <p className="text-white/80 mb-6">{footerAbout}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t?.footer?.contactHeading ?? "Contact Us"}</h4>
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white text-[#9d1e17] p-3 rounded-md">📞</div>
              <div>
                <div className="text-sm text-white/80">{t?.footer?.contact?.consultations ?? "Consultations"}</div>
                <div className="font-semibold">+9660540846666</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-[#9d1e17] p-3 rounded-md">✉️</div>
              <div>
                <div className="text-sm text-white/80">{t?.footer?.contact?.support ?? "Support"}</div>
                <div className="font-semibold">{t?.footer?.contact?.email ?? "Window.ksa30@gmail.com"}</div>
              </div>
            </div>
          </div>
          <div className=" max-w-full w-[150px] rounde flex flex-col items-start gap-2 justify-start">
            <h4 className="font-semibold">Scan to Chat</h4>
            <img src="/images/qr.jpg" alt="qr-code" className="object-contain  rounded-md" />
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/80">
          {(t?.footer?.copyright ?? "ROCK BRIDGE © {year}. All rights reserved.").replace("{year}", String(new Date().getFullYear()))}
        </div>
        <div className="border-t border-white/10 mt-3 pt-3 text-center text-white/70">
          Developed by Fares Mohamed
        </div>
      </div>
    </motion.footer>
  );
}