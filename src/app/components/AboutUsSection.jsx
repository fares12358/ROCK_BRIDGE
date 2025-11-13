import { motion } from "framer-motion";
import Image from "next/image";

export function AboutUsSection({ t }) {
    const features = t?.about?.features ?? [
      "Accelerated Delivery",
      "Reduction of Operational Costs",
      "Business Process Efficiency",
      "Increased Competitiveness",
      "Better Risk Management",
      "Increased Customer Satisfaction",
      "Supply Chain Integration",
      "Optimal Use of Technology"
    ];
  
    return (
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image src="/images/about.jpg" alt="Delivery" width={700} height={500} className="w-full h-auto object-cover" sizes="(max-width: 1024px) 700px, 700px" priority />
                <div className="absolute left-0 bottom-0 bg-[#9d1e17] text-white p-6 rounded-tr-xl rounded-br-xl w-full">
                  <blockquote className="text-sm sm:text-base">{t?.about?.quote ?? "“Ut interdum in lacus vitae... ”"}</blockquote>
                </div>
              </div>
  
              <div className="absolute top-[-40px] right-[-40px] ">
                <div className="bg-white rounded-xl shadow-lg w-28 h-28 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-[#9d1e17]">{t?.who?.experienceCount ?? "16+"}</div>
                  <div className="text-xs text-gray-500">{t?.who?.experienceLabel ?? "Years Experience"}</div>
                </div>
              </div>
            </div>
  
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <svg width="420" height="220" viewBox="0 0 420 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 150 H380 L420 120 V190 H10 Z" fill="#003767" />
                </svg>
              </div>
  
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1.5 h-6 bg-[#9d1e17] inline-block" />
                  <span className="text-sm text-[#9d1e17] font-bold uppercase">{t?.about?.heading ?? "About Us"}</span>
                </div>
  
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#003767] mb-4">{t?.about?.title ?? "Reliability And Efficiency In Logistics"}</h2>
  
                <p className="text-gray-600 mb-6">{t?.about?.description ?? "Tristique pharetra nunc sed amet viverra..."}</p>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {features.map((f) => (
                    <motion.div variants={fadeUp} key={f} className="flex items-start gap-3">
                      <div className="mt-1 text-[#9d1e17]">✔</div>
                      <div className="font-semibold text-gray-800">{f}</div>
                    </motion.div>
                  ))}
                </div>
  
                <a href="#" className="inline-block bg-[#9d1e17] text-white px-5 py-3 rounded-md font-semibold">
                  {t?.common?.readMore ?? "More About Us"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }
  