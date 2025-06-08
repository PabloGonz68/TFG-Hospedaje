import { Calendar, ExternalLink, Home, Mail, MapPin, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


interface Hospedaje {
    id: number;
    id_anfitrion: number;
    nombreAnfitrion: string;
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
const PerfilUser = () => {
    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        fotoPerfil: "",
        fechaRegistro: ""
    });
    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);

    const { IdAnfitrion } = useParams();
    const idNum = IdAnfitrion ? parseInt(IdAnfitrion) : null;

    const navigate = useNavigate();

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
    }



    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!idNum || !token) return console.log("Error al obtener los datos del usuario");

            try {
                const response = await fetch(`http://localhost:8080/usuario/${idNum}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        nombre: userData.nombre,
                        apellidos: userData.apellidos,
                        fotoPerfil: userData.fotoPerfil,
                        email: userData.email,
                        fechaRegistro: userData.fechaRegistro
                    });
                    console.log("Datos del usuario:", userData);


                } else {
                    console.error("Error al obtener los datos del usuario");
                }
            } catch (error) {
                console.error("Error de red al obtener el usuario", error);
            }
        }

        fetchUserData();
    }, [idNum]);

    useEffect(() => {
        const fetchHospedajes = async () => {
            const token = localStorage.getItem("token");
            console.log("El email es:", user.email);

            if (!token || !user.email) return;
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/email/${user.email}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Error al obtener los hospedajes");

                const data = await response.json();
                console.log("Hospedajes obtenidos:", data);
                setHospedajes(data);
            } catch (error) {
                console.error("Error al obtener los hospedajes", error);
            }
        }
        fetchHospedajes();
    }, [user.email]);


    const getZonaConfig = (zona: "CIUDAD" | "PUEBLO") => {
        switch (zona) {
            case "CIUDAD":
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-100",
                    label: "Ciudad",
                }
            case "PUEBLO":
                return {
                    color: "text-green-700",
                    bg: "bg-green-100",
                    label: "Pueblo",
                }
            default:
                return {
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    label: zona,
                }
        }
    }
    return (
        <div className="min-h-screen bg-principal">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <User className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Perfil de {user.nombre}</h1>
                            <p className="text-negro/80 mt-1">Conoce más sobre este anfitrión y sus hospedajes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Información del usuario */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10 sticky top-6">
                            {/* Foto de perfil */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    {user.fotoPerfil ? (
                                        <img
                                            src={user.fotoPerfil || "/placeholder.svg"}
                                            alt={`${user.nombre} ${user.apellidos}`}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-principal"
                                        />
                                    ) : (
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user?.nombre || "Usuario",
                                            )}&background=1d1d1b&color=ffcd40&size=96`}
                                            className="w-24 h-24 rounded-full border-4 border-principal"
                                            alt="Avatar"
                                        />
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <h2 className="text-xl font-bold text-negro mt-3">
                                    {user.nombre} {user.apellidos}
                                </h2>
                                <p className="text-negro/60 text-sm">Anfitrión verificado</p>
                            </div>

                            {/* Estadísticas */}
                            <div className="space-y-4 mb-6">


                                <div className="flex items-center gap-3 p-3 bg-principal/20 rounded-lg">
                                    <Home className="w-5 h-5 text-negro" />
                                    <div>
                                        <p className="font-bold text-negro">{hospedajes.length}</p>
                                        <p className="text-xs text-negro/60">Hospedajes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-principal/20 rounded-lg">
                                    <Calendar className="w-5 h-5 text-negro" />
                                    <div>
                                        <p className="font-bold text-negro">{formatearFecha(user.fechaRegistro || "")}</p>
                                        <p className="text-xs text-negro/60">Miembro desde</p>
                                    </div>
                                </div>
                            </div>

                            {/* Información de contacto */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-negro flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contacto
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-negro/80 break-all">{user.email}</p>
                                </div>
                            </div>



                            {/* Botón de contacto */}
                            <div className="mt-6">
                                <button
                                    onClick={() =>
                                        window.location.href = `mailto:${user.email}?subject=Interesado%20en%20tu%20hospedaje&body=Hola%20${user.nombre},%0A%0AEstoy%20interesado%20en%20tu%20hospedaje...`
                                    }

                                    className="w-full bg-negro hover:bg-[#2d2d2b] text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                                >
                                    Contactar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal - Hospedajes */}
                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-negro mb-2">
                                Hospedajes de {user.nombre} ({hospedajes.length})
                            </h2>
                            <p className="text-negro/70">Descubre los espacios únicos que ofrece este anfitrión</p>
                        </div>

                        {hospedajes.length === 0 ? (
                            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Home className="w-12 h-12 text-principal" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-negro mb-3">No hay hospedajes disponibles</h3>
                                    <p className="text-negro/70">Este anfitrión aún no ha publicado ningún hospedaje</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                {hospedajes.map((hospedaje) => {
                                    const zonaConfig = getZonaConfig(hospedaje.tipoZona)

                                    return (
                                        <div
                                            key={hospedaje.id}
                                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-negro/10 group cursor-pointer"
                                            onClick={() => navigate(`/hospedaje/${hospedaje.id}`)}
                                        >
                                            {/* Imagen */}
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={hospedaje.foto || "/placeholder.svg"}
                                                    alt={hospedaje.nombre}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <div
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${zonaConfig.bg} ${zonaConfig.color}`}
                                                    >
                                                        <MapPin className="w-3 h-3" />
                                                        {zonaConfig.label}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Contenido */}
                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="mb-4">
                                                    <h3 className="text-lg font-bold text-negro mb-2 line-clamp-1">{hospedaje.nombre}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-negro/60 mb-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="line-clamp-1">
                                                            {hospedaje.direccion}, {hospedaje.ciudad}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-negro/60">{hospedaje.pais}</p>
                                                </div>

                                                {/* Capacidad */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="flex items-center gap-1 bg-principal/20 px-3 py-1 rounded-lg">
                                                        <Users className="w-4 h-4 text-negro" />
                                                        <span className="text-sm font-medium text-negro">
                                                            {hospedaje.capacidad} {hospedaje.capacidad === 1 ? "persona" : "personas"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Descripción */}
                                                <p className="text-sm text-negro/70 mb-4 line-clamp-2">{hospedaje.descripcion}</p>

                                                {/* Acciones */}
                                                <div className="flex gap-2">


                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            window.open(
                                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                    `${hospedaje.direccion}, ${hospedaje.ciudad}, ${hospedaje.pais}`,
                                                                )}`,
                                                                "_blank",
                                                            )
                                                        }}
                                                        className="p-2 bg-principal/20 hover:bg-principal/30 text-negro rounded-lg transition-colors duration-200"
                                                        title="Ver en Google Maps"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    )
}

export default PerfilUser