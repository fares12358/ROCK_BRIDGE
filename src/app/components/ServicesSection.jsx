import { motion } from "framer-motion";

/* --- Services grid (reads from translation) --- */
export function ServicesSection({ t }) {
    const cards = t?.servicesSection?.cards ?? [
        { title: "Tests and Quality Measurement", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." },
        { title: "Production lines and spare parts", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." },
        { title: "Quotations and Consultations", description: "Professional service to support the process, ensuring compliance, quality and timely delivery." }
    ];

    const heading = t?.servicesSection?.heading ?? "Services";
    const title = t?.servicesSection?.title ?? "Services We Offer";
    const subtitle = t?.servicesSection?.subheading ?? "We provide a wide range of services to support your business needs.";
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
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={containerStagger}
            className="py-20 bg-gray-50"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 md:mt-50">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <span className="text-5xl text-[#9d1e17] font-bold uppercase">{heading}</span>
                    </div>
                    <h2 className="text-2xl  lg:text-4xl font-bold text-[#003767] mb-2">{title}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <motion.article
                            key={card.title + index}
                            variants={fadeUp}
                            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:scale-102 transition-all duration-300 "
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
