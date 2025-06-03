"use client"

import { useRef } from "react"
import HospedaParallax from "@/components/content/contentHome"
import { motion } from "motion/react"
import { House } from "lucide-react"
const Home = () => {
    const sectionRef = useRef<HTMLDivElement>(null)

    const scrollToSection = () => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <>
            <section id="hero" className="relative h-[110vh] overflow-hidden ">
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-fixed bg-center bg-cover z-0 difuminado-bajo  overflow-hidden"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
                    }}
                ></div>

                {/* Capa oscura */}
                <div className="absolute inset-0 bg-black opacity-60 z-10 difuminado-bajo"></div>

                {/* Contenido */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-content"
                    >
                        <div className="flex justify-center mb-8">
                            <motion.div whileHover={{ rotate: 10 }} transition={{ duration: 0.3 }} className="relative">
                                <House className="w-16 h-16 text-principal" />
                            </motion.div>
                        </div>



                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Bienvenido a <span className="text-principal">Hospeda</span>
                        </h1>
                        <p className="text-xl  rounded-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Intercambia estancias, explora destinos únicos y forma parte de una comunidad que viaja conectando
                            personas.
                        </p>
                        <button
                            onClick={scrollToSection}
                            className="bg-principal hover:bg-principal-hover text-principal-foreground font-semibold py-3 px-6 rounded-2xl shadow-lg transition duration-300"
                        >
                            Empezar
                        </button>
                    </motion.div>

                </div>
            </section>


            {/* Sección destino del scroll */}
            <div ref={sectionRef} id="inicio" className="scroll-mt-10">
                <HospedaParallax />
            </div>
        </>
    )
}

export default Home
