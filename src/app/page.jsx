"use client";

import React from "react";
import LanguageToggle from "./components/LanguageToggle";
import useTranslation from "./lib/useTranslation";
import Image from "next/image";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { motion } from "framer-motion";

/* -------------------------
   Motion variants (subtle)
   ------------------------- */
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const smallPop = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const handleScroll = () => {
  window.scrollTo({
    top: 2350,
    behavior: "smooth", // smooth scrolling
  });
};

const handleEmail = () => {
  window.location.href = "mailto:Window.ksa30@gmail.com";
};

/* --- Small UI blocks --- */
function ServicePill({ icon, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg min-w-[180px] font-semibold text-gray-800 border border-gray-100">
      <div className="w-9 h-9 flex items-center justify-center bg-[#9d1e17] text-white rounded-lg text-lg" aria-hidden>
        {icon}
      </div>
      <span className="text-sm sm:text-base">{children}</span>
    </div>
  );
}

function WhatsAppCard({ t }) {
  const title = t?.whatsapp?.title ?? "Contact Us on WhatsApp";
  const desc = t?.whatsapp?.description ?? "Have questions or need assistance? Chat with our support team on WhatsApp for fast help.";
  const cta = t?.whatsapp?.cta ?? "Chat on WhatsApp";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={smallPop}
      className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center"
    >
      <h3 className="font-bold text-lg mb-4 text-[#003767]">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <a
        href="https://wa.me/+8613711197481"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 bg-[#25D366] text-white py-3 rounded-md font-semibold hover:bg-[#1ebe5b] transition"
      >
        <span className="text-lg">💬 {cta}</span>
      </a>
    </motion.div>
  );
}

/* --- Services grid (reads from translation) --- */
function ServicesSection({ t }) {
  const cards = t?.servicesSection?.cards ?? [
    { title: "Tests and Quality Measurement", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." },
    { title: "Production lines and spare parts", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." },
    { title: "Quotations and Consultations", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." }
  ];

  const heading = t?.servicesSection?.heading ?? "Services";
  const title = t?.servicesSection?.title ?? "Services We Offer";
  const subtitle = t?.servicesSection?.subheading ?? "We provide a wide range of services to support your business needs.";

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerStagger}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-5xl text-[#9d1e17] font-bold uppercase">{heading}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl lg:text-4xl font-bold text-[#003767] mb-2">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.article
              key={card.title + index}
              variants={fadeUp}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="h-44 w-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                {/* keep your image markup: fall back to image placeholder list from translations */}
                <img src={t?.servicesSection?.placeholderImage?.[index] ?? "/images/im-placeholder.jpg"} alt={"Image Placeholder"} className="object-cover w-full h-full" />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description ?? card.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* --- Who Are We / Vision / Message (reads from translation) --- */
function WhoAreWeSection({ t }) {
  const who = t?.who ?? {};
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerStagger}
      className="py-20 bg-white md:mt-50 "
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div variants={fadeUp}>
            <h3 className="text-4xl text-[#9d1e17] font-bold uppercase mb-2">{who.heading ?? "Who are we?"}</h3>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#003767] mb-4">{who.company ?? "ROCK BRIDGE Import and Export Company"}</h2>

            <p className="text-gray-700 mb-4 leading-relaxed">{who.description ?? "We believe our success begins with an effective customer experience..."}</p>

            <h4 className="font-semibold text-2xl lg:text-3xl  text-[#003767] mt-6">{who.visionTitle ?? "Our Vision"}</h4>
            <p className="text-gray-700 mb-4">{who.visionText ?? ""}</p>

            <h4 className="font-semibold text-2xl lg:text-3xl  text-[#003767] mt-4">{who.messageTitle ?? "Our Message"}</h4>
            <p className="text-gray-700">{who.messageText ?? ""}</p>
          </motion.div>

          <motion.div className="flex flex-col gap-6" variants={fadeUp}>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image src="/images/poster.png" alt={who.company ?? "ROCK BRIDGE"} width={700} height={420} className="w-full h-auto object-cover" />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <motion.div variants={smallPop} className="bg-[#f8fafc] p-4 rounded-lg shadow">
                <div className="font-bold text-xl text-[#9d1e17]">{who.experienceCount ?? "16+"}</div>
                <div className="text-sm text-gray-600">{t?.who?.experienceLabel ?? "Years Experience"}</div>
              </motion.div>

              <motion.div variants={smallPop} className="bg-[#f8fafc] p-4 rounded-lg shadow">
                <div className="text-xs text-gray-500">{t?.who?.headquartersLabel ?? "Headquarters"}</div>
                <div className="font-bold text-xl text-[#9d1e17]">{who.headquartersValue ?? "Saudi Arabia"}</div>
                <div className="text-sm text-gray-600">Operating locally & internationally</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* --- What Distinguishes Us (reads from translation) --- */
function DistinguishSection({ t }) {
  const features = t?.distinguish?.items ?? [
    { title: "Experience", text: "In-depth knowledge of the technical regulations and regulatory legislation of the target countries." },
    { title: "Speed", text: "Reducing waiting time through the ability to complete processes from manufacturing and shipping to the final destination." },
    { title: "Prices", text: "Guaranteed competitive prices and high quality through a wide network of factories and wholesale markets." },
    { title: "Compliance", text: "Ensuring that products conform to private and governmental conditions and specifications." },
    { title: "Neutrality", text: "We are a neutral third party that enhances transparency and credibility of commercial mediation." }
  ];

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h3 variants={fadeUp} className="md:text-4xl text-2xl  text-[#9d1e17] font-bold uppercase mb-2">{t?.distinguish?.heading ?? "What distinguishes us"}</motion.h3>
          <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-bold text-[#003767]">{t?.distinguish?.title ?? "Why choose ROCK BRIDGE"}</motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-[#9d1e17] text-white rounded-md flex items-center justify-center mb-4">✓</div>
              <h4 className="font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* --- Core values (reads from translation) --- */
function CoreValuesSection({ t }) {
  const values = t?.coreValues?.items ?? [
    { title: "Integrity", text: "We operate with complete transparency and are honest in our dealings." },
    { title: "Accuracy", text: "We are meticulous when approving applications to ensure all details are correct and meet specifications." },
    { title: "Leadership", text: "We keep pace with the latest developments and changes in global trade systems to provide the best solutions." }
  ];

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <motion.h3 variants={fadeUp} className="text-4xl text-[#9d1e17] font-bold uppercase mb-10">{t?.coreValues?.heading ?? "Core Values"}</motion.h3>
        <motion.h2 variants={fadeUp} className="text-2xl font-bold text-[#003767] mb-6">{t?.coreValues?.title ?? "Our Principles"}</motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {values.map((v) => (
            <motion.div key={v.title} variants={fadeUp} className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-2">{v.title}</h4>
              <p className="text-sm text-gray-700">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* --- Tourism paragraph (reads from translation) --- */
function TourismSection({ t }) {
  const tourism = t?.tourism ?? {};
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

/* --- Reused smaller sections that can also read from translation --- */
function WhyChooseSection({ t }) {
  const items = t?.why?.items ?? [
    { title: "100% Guarantee", text: "Tincidunt facilisis massa. Orci leo Nunc auctor dignissim." },
    { title: "Fast Response", text: "Tincidunt facilisis massa. Orci leo Nunc auctor dignissim." },
    { title: "Experience Team", text: "Tincidunt facilisis massa. Orci leo Nunc auctor dignissim." },
    { title: "Good Quality", text: "Tincidunt facilisis massa. Orci leo Nunc auctor dignissim." }
  ];

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={containerStagger} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl text-[#9d1e17] font-bold uppercase">{t?.why?.heading ?? "Why Choose Us"}</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-[#003767] mb-6">{t?.why?.title ?? "Ensuring Superior Logistics Solutions For Optimal Business Performance"}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((it) => (
                <motion.div key={it.title} variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#9d1e17] rounded-lg flex items-center justify-center text-white text-xl">✓</div>
                  <div>
                    <h4 className="font-semibold">{it.title}</h4>
                    <p className="text-sm text-gray-600">{it.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AboutUsSection({ t }) {
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

function ContactCTA({ t }) {
  const contact = t?.contactCTA ?? {};
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeUp} className="py-20">
      <div className="">
        <div className="relative bg-[#9d1e17] overflow-hidden py-10">
          <div className="absolute inset-0 bg-[#9d1e17]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center">
            <div className="flex items-center justify-center relative pl-12 w-fit">
              <div className="relative w-[420px] h-[280px]">
                <Image src="/images/van-2.png" alt="Delivery van" fill className="object-contain" sizes="(max-width: 1024px) 420px, 420px" />
              </div>
            </div>
            <div className="p-12 text-white">
              <h3 className="text-xl font-semibold mb-4">{contact.title ?? "Discuss Your Shipping Needs"}</h3>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{contact.subtitle ?? "With Our Experts!"}</h2>
              <p className="text-white/90 max-w-xl mb-6">{contact.text ?? "Tristique pharetra nunc sed amet viverra..."}</p>
              <a href="#" className="inline-block bg-white text-[#9d1e17] px-5 py-3 rounded-md font-semibold shadow" onClick={handleEmail}>
                {contact.cta ?? "Contact Us"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* --- Newsletter + Footer (reads from translation) --- */
function NewsletterFooter({ t }) {
  const n = t?.newsletter ?? {};
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeUp} className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 relative -top-20">
      <div className="bg-[#08355a] rounded-xl shadow-xl p-8 mt- flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{n.title ?? "Subscribe Our Newsletter To Get The Latest News From Us!"}</h3>
          <p className="text-white/80 mb-4">{n.subtitle ?? "Sign up and stay updated with our latest offers and company news."}</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input type="email" placeholder={n.placeholder ?? "Your Email"} className="px-4 py-3 rounded-md w-full max-w-md border focus:outline-none" />
            <button className="bg-[#9d1e17] text-white px-5 py-3 rounded-md font-semibold">{n.subscribe ?? "Subscribe"}</button>
          </div>
        </div>

        <div className="w-48 h-48 relative hidden md:block">
          <Image src="/images/newsletter-person.png" alt="Delivery person" fill className="object-contain" />
        </div>
      </div>
    </motion.section>
  );
}

function Footer({ t }) {
  const footer = t?.footer ?? {};
  const footerAbout = t?.footer?.about ?? t?.footer ?? "ROCK BRIDGE - Commercial mediation and export/import solutions tailored for global markets.";

  return (
    <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={fadeIn} className="mt-16 bg-[#9d1e17] text-white">
      <NewsletterFooter t={t} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="font-semibold">{t?.footer?.contact?.phone ?? "+8613711197481"}</div>
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
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/80">
          {(t?.footer?.copyright ?? "ROCK BRIDGE © {year}. All rights reserved.").replace("{year}", String(new Date().getFullYear()))}
        </div>
        <div className="border-t border-white/10 mt-1 pt-1 text-center text-white/20">
          Developed by Fares Mohamed
        </div>
      </div>
    </motion.footer>
  );
}

/* --- Final Page EXPORT --- */
export default function Page() {
  const { t, loading } = useTranslation();
  const heroTag = t?.hero?.tagline ?? (t?.heroTagline ?? "LOGISTIC CARGO & TRANSPORTATION");
  const heroTitle = loading ? "..." : (t?.title ?? t?.hero?.title ?? "Connecting Your Business To The World Through Reliable Logistics");
  const heroCta = t?.hero?.cta ?? "Our Service";

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 relative ">
      {/* Header */}
      <motion.header initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeIn} className="sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src="/images/logo.png" alt={t?.site?.name ?? "ROCK BRIDGE"} width={100} height={50} className="object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#9d1e17] text-white px-3 py-2 rounded-md" onClick={handleEmail}>{t?.nav?.contact ?? "Contact us"}</button>
            <LanguageToggle />
          </div>
        </div>
      </motion.header>

      {/* Hero / decorative */}
      <div className="w-full h-[620px] md:h-[720px] lg:h-[820px] bg-[url('/images/bgg.jpg')] bg-center bg-cover" />

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerStagger} className="-mt-[520px] md:-mt-[600px] lg:-mt-[700px] max-w-7xl mx-auto px-6 sm:px-8 lg:px-0 relative">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <motion.div variants={fadeUp} className="w-full lg:w-1/2 z-20">
            <p className="text-[#9d1e17] font-bold text-[16px] sm:text-[20px] tracking-wide mb-6">{heroTag}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003767] leading-tight mb-6">{heroTitle}</h1>

            <div className="flex items-center gap-4 mb-8">
              <button className="inline-block bg-[#003767] text-white font-semibold px-6 py-3 rounded-lg transition text-sm" onClick={handleScroll}>
                {heroCta}
              </button>
            </div>

            <div className="mt-8 lg:mt-20">
              <WhatsAppCard t={t} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full lg:w-1/2 relative flex items-end justify-end">
            <div className="hidden lg:flex flex-col gap-4 absolute top-24 right-16 z-30">
              <ServicePill icon="✈">{t?.servicesPill?.air ?? "Air Freight"}</ServicePill>
              <ServicePill icon="⚓">{t?.servicesPill?.ocean ?? "Ocean Freight"}</ServicePill>
              <ServicePill icon="🚆">{t?.servicesPill?.rail ?? "Rail Freight"}</ServicePill>
              <ServicePill icon="🚚">{t?.servicesPill?.land ?? "Land Freight"}</ServicePill>
            </div>

            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl z-20 lg:top-[300px] lg:-left-[50px]">
              <Image
                src="/images/Container-Red.png"
                alt="Shipping container"
                width={1200}
                height={800}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 700px, 1200px"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* New content sections */}
      <WhoAreWeSection t={t} />
      <ServicesSection t={t} />
      <DistinguishSection t={t} />
      <CoreValuesSection t={t} />
      <TourismSection t={t} />

      {/* Keep existing helpful sections */}
      <WhyChooseSection t={t} />
      <ContactCTA t={t} />

      {/* utility and footer */}
      <ScrollToTopButton />
      <Footer t={t} />
    </main>
  );
}
