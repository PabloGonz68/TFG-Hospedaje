import { useRef } from "react";

const Home = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const scrollToSection = () => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <section id="hero" className="relative h-screen overflow-hidden">
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-fixed bg-center bg-cover z-0"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
                    }}
                ></div>

                {/* Capa oscura */}
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

                {/* Contenido */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        Bienvenido a <span className="text-principal">Hospeda</span>
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl mb-6">
                        Tu plataforma para conseguir alojamiento casi gratis.
                    </p>
                    <button
                        onClick={scrollToSection}
                        className="bg-secundario hover:bg-secundario-hover text-principal-foreground font-semibold py-3 px-6 rounded-2xl shadow-lg transition duration-300"
                    >
                        Empezar
                    </button>
                </div>
            </section>

            {/* Sección destino del scroll */}
            <div ref={sectionRef} id="inicio" className="min-h-screen bg-white p-10 scroll-mt-20">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Cómo funciona Hospeda?</h2>
                <p className="text-gray-700 text-lg">
                    Aquí puedes explicar cómo funciona tu plataforma, mostrar un formulario de registro,
                    ventajas del sistema de tickets, etc.
                </p>
            </div>
        </>
    );
};

export default Home;
