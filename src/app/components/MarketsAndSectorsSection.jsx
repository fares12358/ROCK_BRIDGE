// components/MarketsAndSectorsSection.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * MarketsAndSectorsSection
 * Props:
 *  - t: translation object (expects t.marketsSection)
 *
 * Expects translation keys:
 *  t.marketsSection.heading
 *  t.marketsSection.intro
 *  t.marketsSection.markets -> array [{ key, title, description, flag }]
 *  t.marketsSection.sectors -> array of sector strings
 *
 * Usage:
 *  <MarketsAndSectorsSection t={t} />
 */

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function MarketsAndSectorsSection({ t }) {
  const ms = t?.marketsSection ?? {};
  const heading = ms.heading ?? "Markets & Sectors";
  const intro = ms.intro ?? "";
  const markets = Array.isArray(ms.markets) && ms.markets.length > 0 ? ms.markets : [
    // fallback
    { key: "china", title: "China", description: "Direct partnerships with factories and suppliers.", flag: "🇨🇳" },
    { key: "sa", title: "Saudi Arabia", description: "Local partners and projects aligned with Vision 2030.", flag: "🇸🇦" },
    { key: "gcc", title: "GCC", description: "Strategic coverage across GCC for fast deliveries.", flag: "🌐" },
  ];
  const sectors = Array.isArray(ms.sectors) && ms.sectors.length > 0 ? ms.sectors : [
    "Automotive spare parts",
    "Contract manufacturing",
    "E-commerce & wholesale supply",
    "Production lines",
    "Logistics & transportation",
    "Brand development & agencies",
    "Business & tourist trips to China"
  ];

  return (
    <motion.section
      id="markets"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div variants={fadeUp} className="text-center mb-8">
          <h3 className="text-3xl md:text-4xl font-bold text-[#9d1e17] uppercase">{heading}</h3>
          {intro && <p className="mt-3 text-gray-600 max-w-3xl mx-auto">{intro}</p>}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Markets column */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#003767] mb-2">{t?.marketsSection?.marketsHeading ?? (t?.lang && t.lang.startsWith("ar") ? "الأسواق" : "Markets")}</h4>

            <div className="space-y-3">
              {markets.map((m) => (
                <div key={m.key ?? m.title} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white/10 text-2xl flex-shrink-0">
                    <span aria-hidden>{m.flag ?? "🌍"}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{m.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{m.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vertical separator + illustration */}
          <motion.div variants={fadeUp} className="flex flex-col items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {/* decorative image / icon */}
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#08355a] to-[#9d1e17] flex items-center justify-center text-white">
                {/* You can replace this with a proper SVG or image */}
                <div className="text-center px-4">
                  <div className="text-2xl font-bold">{t?.marketsSection?.bridgeTitle ?? (t?.lang && t.lang.startsWith("ar") ? "روك بريدج" : "ROCK BRIDGE")}</div>
                  <div className="text-xs mt-1">{t?.marketsSection?.bridgeSubtitle ?? (t?.lang && t.lang.startsWith("ar") ? "ربط الشرق بالغرب" : "Connecting East & West")}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sectors column */}
          <motion.div variants={fadeUp} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#003767] mb-2">{t?.marketsSection?.sectorsHeading ?? (t?.lang && t.lang.startsWith("ar") ? "القطاعات التي نخدمها" : "Sectors We Serve")}</h4>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              {sectors.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 text-[#9d1e17]">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
