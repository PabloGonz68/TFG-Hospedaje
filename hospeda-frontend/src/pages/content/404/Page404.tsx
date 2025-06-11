"use client"

import { Home, ArrowLeft, Search, MapPin, Compass } from "lucide-react"
import { useNavigate } from "react-router-dom"



const NotFoundPage = () => {
    const handleGoHome = () => {
        window.location.href = "/"
    }

    const handleGoBack = () => {
        window.history.back()
    }


    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-principal flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Ilustración 404 */}
                <div className="mb-8">
                    <div className="relative">
                        {/* Número 404 grande */}
                        <div className="text-[12rem] md:text-[16rem] font-black text-negro/20 leading-none select-none">
                            404
                        </div>

                        {/* Iconos flotantes */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center animate-bounce">
                                    <Compass className="w-12 h-12 text-principal" />
                                </div>

                                {/* Iconos pequeños flotantes */}
                                <div className="absolute -top-4 -left-8 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    <MapPin className="w-4 h-4 text-negro" />
                                </div>

                                <div className="absolute -bottom-4 -right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse delay-300">
                                    <Home className="w-4 h-4 text-negro" />
                                </div>

                                <div className="absolute top-8 -right-12 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse delay-500">
                                    <Search className="w-3 h-3 text-negro" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-negro/10">
                    <h1 className="text-4xl md:text-5xl font-bold text-negro mb-4">¡Ups! Te has perdido</h1>

                    <p className="text-xl text-negro/80 mb-2">La página que buscas no existe</p>

                    <p className="text-negro/60 mb-8 max-w-md mx-auto">
                        Parece que has tomado un desvío en tu aventura. No te preocupes, te ayudamos a encontrar el camino de
                        vuelta.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleGoHome}
                            className="flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Home className="w-5 h-5" />
                            Ir al inicio
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="flex items-center gap-2 border-2 border-negro text-negro hover:bg-negro hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver atrás
                        </button>
                    </div>


                </div>

                {/* Enlaces útiles */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate("/hospedajes")}
                        className="bg-white/80 hover:bg-white text-negro p-4 rounded-xl transition-all duration-200 hover:shadow-lg group"
                    >
                        <Home className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Hospedajes</span>
                    </button>

                    <button
                        onClick={() => navigate("/grupoViaje/mis-grupos")}
                        className="bg-white/80 hover:bg-white text-negro p-4 rounded-xl transition-all duration-200 hover:shadow-lg group"
                    >
                        <MapPin className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Grupos</span>
                    </button>

                    <button
                        onClick={() => navigate("/reserva/mis-reservas")}
                        className="bg-white/80 hover:bg-white text-negro p-4 rounded-xl transition-all duration-200 hover:shadow-lg group"
                    >
                        <Search className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Reservas</span>
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="bg-white/80 hover:bg-white text-negro p-4 rounded-xl transition-all duration-200 hover:shadow-lg group"
                    >
                        <Compass className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Explorar</span>
                    </button>
                </div>

                {/* Mensaje motivacional */}
                <div className="mt-8 text-negro/60">
                    <p className="text-sm">"No todos los que vagan están perdidos" - J.R.R. Tolkien</p>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
