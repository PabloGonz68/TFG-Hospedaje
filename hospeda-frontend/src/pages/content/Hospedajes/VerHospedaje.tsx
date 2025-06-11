import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../../../components/shared/map";
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Edit, ExternalLink, Home, MapPin, Users } from "lucide-react";


interface Hospedaje {
    id: number;
    id_anfitrion: number;
    nombre: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    pais: string;
    capacidad: number;
    tipoZona: 'CIUDAD' | 'PUEBLO';
    descripcion: string;
    ubicacion: string;
    visible: boolean;
    foto: string;
}

interface Anfitrion {
    id: number;
    fotoPerfil: string;
    nombre: string;
    apellidos: string;
    email: string;
    fechaRegistro: string;

}

const VerHospedaje = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const idNum = id ? parseInt(id) : null;
    console.log("ID recibido:", idNum);
    console.log("ID recibido por useParams:", id);
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("userId");
    const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;

    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);
    const [anfitrion, setAnfitrion] = useState<Anfitrion | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const getZonaConfig = (zona: "CIUDAD" | "PUEBLO") => {
        switch (zona) {
            case "CIUDAD":
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-100",
                    label: "Ciudad",
                    icon: Home,
                }
            case "PUEBLO":
                return {
                    color: "text-green-700",
                    bg: "bg-green-100",
                    label: "Pueblo",
                    icon: Home,
                }
            default:
                return {
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    label: zona,
                    icon: Home,
                }
        }
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
    }


    const handleClickEditar = (id: number) => {
        navigate(`/hospedajes/editar/${id}`)
    }
    useEffect(() => {
        const fetchHospedaje = async () => {
            if (!token) return;
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });


                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al obtener el hospedaje");
                }

                const data = await response.json();
                setHospedaje(data); // guardar hospedaje en el estado
            } catch (err: any) {
                toast.error(err.message || "Error desconocido al cargar el hospedaje");
                setError(err.message);


            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchHospedaje();
        }
    }, [id, token]);

    useEffect(() => {
        const fetchAnfitrion = async () => {
            if (!token) return;
            try {
                const response = await fetch(`http://localhost:8080/usuario/${hospedaje?.id_anfitrion}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al obtener el anfitrion");
                }
                const data = await response.json();
                setAnfitrion(data); // guardar anfitrion en el estado
            } catch (err: any) {
                toast.error(err.message || "Error desconocido al cargar el anfitrion");
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (hospedaje) {
            fetchAnfitrion();
        }
    }, [hospedaje, token]);



    if (loading) {
        return <div className="text-center mt-8 text-blue-600 font-semibold">Cargando hospedaje...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600 font-semibold">{error}</div>;
    }

    if (!hospedaje) {
        return <div className="text-center mt-8 text-gray-500">Hospedaje no encontrado</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ffcd40] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d1d1b] mx-auto mb-4"></div>
                    <p className="text-[#1d1d1b] font-medium">Cargando hospedaje...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#ffcd40] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1d1d1b] mb-2">Error al cargar</h2>
                    <p className="text-[#1d1d1b]/70">{error}</p>
                </div>
            </div>
        )
    }

    if (!hospedaje) {
        return (
            <div className="min-h-screen bg-[#ffcd40] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="w-12 h-12 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1d1d1b] mb-2">Hospedaje no encontrado</h2>
                    <p className="text-[#1d1d1b]/70">El hospedaje que buscas no existe o ha sido eliminado</p>
                </div>
            </div>
        )
    }

    const zonaConfig = getZonaConfig(hospedaje.tipoZona)
    const esPropio = hospedaje.id_anfitrion === usuarioIdNum

    return (
        <div className="min-h-screen bg-[#ffcd40]">
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {/* Header con navegación */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-[#1d1d1b] hover:text-[#1d1d1b]/80 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Volver</span>
                    </button>


                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenido principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Imagen principal */}
                        <div className="relative overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src={hospedaje.foto || "/placeholder.svg"}
                                alt={hospedaje.nombre}
                                className="w-full h-96 object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <div
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${zonaConfig.bg} ${zonaConfig.color}`}
                                >
                                    <zonaConfig.icon className="w-4 h-4" />
                                    {zonaConfig.label}
                                </div>
                            </div>
                        </div>

                        {/* Información principal */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#1d1d1b] mb-2">{hospedaje.nombre}</h1>
                                    <div className="flex items-center gap-2 text-[#1d1d1b]/60 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {hospedaje.direccion}, {hospedaje.ciudad}, {hospedaje.pais}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 bg-[#ffcd40]/20 px-3 py-1 rounded-lg">
                                            <Users className="w-4 h-4 text-[#1d1d1b]" />
                                            <span className="text-sm font-medium text-[#1d1d1b]">
                                                {hospedaje.capacidad} {hospedaje.capacidad === 1 ? "persona" : "personas"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {esPropio && (
                                    <button
                                        onClick={() => handleClickEditar(hospedaje.id)}
                                        className="flex items-center gap-2 bg-[#1d1d1b] hover:bg-[#2d2d2b] text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>
                                )}
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="font-bold text-[#1d1d1b] mb-3">Descripción</h3>
                                <p className="text-[#1d1d1b]/80 leading-relaxed">{hospedaje.descripcion}</p>
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="p-2 bg-principal rounded-lg flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-negro" />
                                        <h3 className="font-bold text-[#1d1d1b]">Ubicación</h3>
                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                `${hospedaje.direccion}, ${hospedaje.ciudad}, ${hospedaje.pais}`,
                                            )}`,
                                            "_blank",
                                        )
                                    }
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Ver en Google Maps
                                </button>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col gap-2">

                                    <Map direccion={hospedaje.ubicacion} />
                                </div>

                            </div>


                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Card de reserva */}
                        {!esPropio && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10 sticky top-36">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-[#1d1d1b] mb-2">Reservar este hospedaje</h3>
                                    <p className="text-[#1d1d1b]/60 text-sm">Elige tu opción de reserva</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate(`/reserva/individual/${hospedaje.id}`)}
                                        className="w-full bg-[#1d1d1b] hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-bold transition-colors duration-200"
                                    >
                                        Reservar ahora
                                    </button>

                                    <button
                                        onClick={() => navigate(`/reserva/grupal/${hospedaje.id}`)}
                                        className="w-full border border-[#1d1d1b] text-[#1d1d1b] hover:bg-[#1d1d1b] hover:text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                                    >
                                        Reserva grupal
                                    </button>

                                    <div className="text-center">
                                        <p className="text-xs text-[#1d1d1b]/60">Contacta con el anfitrión para más detalles</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información del anfitrión */}
                        {anfitrion && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                                <h3 className="font-bold text-[#1d1d1b] mb-4">Tu anfitrión</h3>

                                <div className="flex items-center gap-4 mb-4">
                                    {anfitrion.fotoPerfil ? (
                                        <img
                                            src={anfitrion.fotoPerfil || "/placeholder.svg"}
                                            alt={`${anfitrion.nombre} ${anfitrion.apellidos}`}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-principal"
                                        />
                                    ) : (
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                anfitrion?.nombre || "Usuario",
                                            )}&background=1d1d1b&color=ffcd40&size=96`}
                                            className="w-24 h-24 rounded-full border-4 border-principal"
                                            alt="Avatar"
                                        />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-[#1d1d1b]">
                                                {anfitrion.nombre} {anfitrion.apellidos}
                                            </h4>

                                        </div>

                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-[#1d1d1b]/60">
                                        <Calendar className="w-4 h-4" />
                                        <span>Anfitrión desde {formatearFecha(anfitrion.fechaRegistro)}</span>
                                    </div>

                                </div>

                                <button
                                    onClick={() => navigate(`/perfil/${anfitrion.id}`)}
                                    className="w-full border border-[#1d1d1b] text-[#1d1d1b] hover:bg-[#1d1d1b] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Contactar anfitrión
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerHospedaje;
/*
{idNum !== null && hospedaje.id_anfitrion === usuarioIdNum ? (
                            <div className="flex  mt-4">
                                <button
                                    onClick={() => handleClickEditar(idNum)}
                                    className="bg-principal text-negro py-2 px-4 rounded-md hover:bg-principal-hover transition"
                                >
                                    Editar
                                </button>
                            </div>
                        ) : (
                            id && <ReservaModal hospedajeId={id} />
                        )}

*/