"use client"

import type React from "react"
import { motion, type MotionValue, useScroll, useSpring, useTransform } from "motion/react"
import { useRef } from "react"
import { MapPin, Ticket, CheckCircle, Users, CalendarCheck } from "lucide-react"
import { AccordionTicketType } from "../accordions/accordionTicketType"

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance])
}

function ParallaxSection({
    children,
    className = "",
    parallaxDistance = 100,
    bgColor = "bg-blanco",
}: {
    children: React.ReactNode
    className?: string
    parallaxDistance?: number
    bgColor?: string
}) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref })
    const y = useParallax(scrollYProgress, parallaxDistance)
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])




    return (
        <section className={`parallax-section ${className}`}>
            <motion.div className={`parallax-bg ${bgColor}`} style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }} />
            <div ref={ref} className="parallax-content">
                <motion.div style={{ opacity }} className="content-wrapper">
                    {children}
                </motion.div>
            </div>
        </section>
    )
}

function IconCard({ icon: Icon, className = "" }: { icon: any; className?: string }) {
    return (
        <motion.div
            className={`icon-card ${className}`}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Icon className="w-16 h-16 relative z-10" />
        </motion.div>
    )
}

export default function HospedaParallax() {
    const { scrollYProgress } = useScroll()
    const rawScaleX = useSpring(scrollYProgress, {
        damping: 30,
        restDelta: 0.001,
    })
    const scaleX = useTransform(rawScaleX, [0, 0, 0.9], [0, 0, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.8, 0.9], [1, 1, 0])







    return (
        <div className="bg-principal relative scroll-smooth">

            <div className="relative z-10 px-4 sm:px-8 py-8 max-w-6xl mx-auto">


                {/* Qué es Hospeda */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="que-es"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 flex justify-center"
                    >
                        <img
                            src="https://i.ibb.co/XkKPrxRK/logo-Hospeda-negro.png"
                            alt="Logo Hospeda"
                            className="w-82"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="content-card"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Qué es Hospeda?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Hospeda es una plataforma que te permite alojarte en casas de otros usuarios usando un sistema de tickets.
                            Comparte tu hospedaje, consigue tickets y úsalos para descubrir nuevos lugares.
                        </p>
                    </motion.div>

                </ParallaxSection>

                {/* Cómo funciona */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="como-funciona"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 flex justify-center order-2 md:order-1"
                    >
                        <IconCard icon={MapPin} className="text-principal" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="content-card order-1 md:order-2"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Cómo funciona?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Explora hospedajes en ciudades y pueblos. Cada noche por persona tiene un coste en tickets, y dependiendo
                            del destino será más o menos costoso. Organiza tu viaje, reserva y listo.
                        </p>
                    </motion.div>
                </ParallaxSection>

                {/* Tickets */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="tickets"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 content-card"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Cómo se usan los tickets?</h2>
                        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                            Utilizamos tickets como forma de gestionar las estancias:
                        </p>
                        <AccordionTicketType />
                        <div className="bg-principal/10 border border-principal/20 rounded-lg p-4 text-center">
                            <span className="font-semibold text-principal">1 ticket de ciudad = 2 tickets de pueblo</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <IconCard icon={Ticket} className="text-principal" />
                    </motion.div>
                </ParallaxSection>

                {/* Cómo conseguir tickets */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="conseguir-tickets"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 flex justify-center order-2 md:order-1"
                    >
                        <IconCard icon={CheckCircle} className="text-principal" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="content-card order-1 md:order-2"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Cómo consigo tickets?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Publica tu hospedaje y permite que otros usuarios se alojen en tu casa. Si tu hospedaje está en una ciudad
                            obtendrás tickets de ciudad, si está en un pueblo, obtendrás de pueblo. ¡Así de fácil!
                        </p>
                    </motion.div>
                </ParallaxSection>

                {/* Viajar en grupo */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="viajar-grupo"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 content-card"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Puedo viajar con un grupo?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            Sí. Puedes crear un grupo de viaje con tus amigos registrados. Solo tenéis que repartiros los tickets
                            según los días y el número de personas.
                        </p>
                        <div className="bg-principal/10 border border-principal/20 rounded-lg p-4 text-center">
                            <span className="text-principal font-medium">Ejemplo: 3 personas × 3 noches = 9 tickets totales</span>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <IconCard icon={Users} className="text-principal" />
                    </motion.div>
                </ParallaxSection>

                {/* Gestión de reservas */}
                <ParallaxSection className="h-fit grid md:grid-cols-2 gap-16 items-center" bgColor="bg-blanco">
                    <motion.div
                        id="gestion-reservas"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="scroll-mt-80 flex justify-center order-2 md:order-1"
                    >
                        <IconCard icon={CalendarCheck} className="text-principal" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="content-card order-1 md:order-2"
                    >
                        <h2 className="text-3xl font-semibold text-principal mb-4">¿Cómo se gestionan las reservas?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Las reservas llegan al anfitrión, quien podrá aceptarlas, marcarlas como completadas o cancelarlas si es
                            necesario. Todo el proceso es claro y sencillo para ambas partes.
                        </p>
                    </motion.div>
                </ParallaxSection>
            </div>

            {/* Progress Bar */}
            <motion.div
                className="fixed left-0 right-0 h-1 bg-principal bottom-8 mx-4 rounded-full shadow-lg z-50"
                style={{ scaleX, opacity, transformOrigin: "0%" }}
            />

            <style>{`
        .parallax-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

      .parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* o 100vh */
  z-index: -1;
  background-size: cover;
  background-position: center;
  will-change: transform;
}


        .parallax-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .content-wrapper {
          padding: 2rem;
        }

        .hero-content {
          text-align: center;
          max-width: 4xl;
          margin: 0 auto;
        }

        .content-card {
          padding: 1rem;
        }

        .icon-card {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        html {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        @media (max-width: 768px) {
          .parallax-section {
            min-height: auto;
            padding: 4rem 0;
          }
          
          .content-card {
            padding: 0;
          }
          
          .icon-card {
            width: 110px;
            height: 110px;
          }
          
          .icon-card svg {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
        </div>
    )
}
