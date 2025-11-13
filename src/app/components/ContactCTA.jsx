import { motion } from "framer-motion";
import Image from "next/image";

export function ContactCTA({ t }) {
  const contact = t?.contactCTA ?? {};


  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };
  const handleEmail = () => {
    window.location.href = "mailto:Window.ksa30@gmail.com";
  };

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
              <a href="/get-offer" className="inline-block bg-white text-[#9d1e17] px-5 py-3 rounded-md font-semibold shadow hover:scale-102 transition-all duration-300 " onClick={handleEmail}>
                {contact.cta ?? "Contact Us"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
