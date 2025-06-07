import { ConfirmToast } from "@/components/toasts/ConfirmToast";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Edit, ExternalLink, Filter, Home, MapPin, Plus, Search, Star, Trash2, Users } from "lucide-react"
import { motion } from "motion/react";

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

const Hospedajes = () => {
    const navigate = useNavigate();

    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);
    const [filtroCiudad, setFiltroCiudad] = useState("");
    const [filtroPais, setFiltroPais] = useState("");
    const [filtroTipoZona, setFiltroTipoZona] = useState("");
    const [filtroCapacidad, setFiltroCapacidad] = useState<number | null>(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [rol, setRol] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (id) {
            setUsuarioId(parseInt(id));
        }
        const usuarioStr = localStorage.getItem("user");
        if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            console.log("Rol del usuario:", usuario.rol);
            setRol(usuario.rol);
        }
    }, [])

    useEffect(() => {
        const aplicarFiltrosAuto = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                let url = `http://localhost:8080/hospedaje/filtrar?`;

                const params = new URLSearchParams();//Se utiliza para manejar los parámetros de una URL
                if (filtroCiudad) params.append("ciudad", filtroCiudad);
                if (filtroPais) params.append("pais", filtroPais);
                if (filtroTipoZona) params.append("tipoZona", filtroTipoZona);
                if (filtroCapacidad !== null && !isNaN(filtroCapacidad)) params.append("capacidad", filtroCapacidad.toString());

                url += params.toString();

                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Error al aplicar filtros");

                const data = await response.json();
                setHospedajes(data);
            } catch (error) {
                console.error("Error al aplicar filtros", error);
            }
        };

        // Llamamos la función cada vez que cambie algún filtro
        aplicarFiltrosAuto();
    }, [filtroCiudad, filtroPais, filtroTipoZona, filtroCapacidad]);


    useEffect(() => {
        const fetchHospedajes = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;
            try {
                const response = await fetch("http://localhost:8080/hospedaje/", {
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
    }, []);

    const handleClickEditar = (id: number) => {
        navigate(`/hospedajes/editar/${id}`)
    }

    const handleClickCrear = () => {
        navigate("/hospedajes/crear")
    }

    const eliminarHospedaje = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await fetch(`http://localhost:8080/hospedaje/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setHospedajes(hospedajes.filter((hospedaje) => hospedaje.id !== id));
            toast.success("Hospedaje eliminado");
        } catch (error) {
            console.error("Error al eliminar el hospedaje", error);
        }
    }

    const handleClickEliminar = (id: number) => {
        toast.custom((t) => (
            <ConfirmToast message="¿Desea eliminar el hospedaje?" onConfirm={() => eliminarHospedaje(id)} onCancel={() => toast.dismiss(t)} />
        ))
    }

    const handleClickDetalles = (id: number) => {
        navigate(`/hospedaje/${id}`)
    }

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


    const limpiarFiltros = () => {
        setFiltroCiudad("")
        setFiltroPais("")
        setFiltroTipoZona("")
        setFiltroCapacidad(null)
    }

    const hayFiltrosActivos = filtroCiudad || filtroPais || filtroTipoZona || filtroCapacidad


    return (
        <div className="min-h-screen bg-principal p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-negro rounded-xl">
                            <Home className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Hospedajes</h1>
                            <p className="text-negro/80 mt-1">Descubre lugares increíbles para tu próxima aventura</p>
                        </div>
                    </div>

                    {/* Acciones principales */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${mostrarFiltros || hayFiltrosActivos
                                ? "bg-negro text-white"
                                : "bg-white/80 text-negro hover:bg-white"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                            {hayFiltrosActivos && (
                                <span className="bg-principal text-negro px-2 py-0.5 rounded-full text-xs">Activos</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleClickCrear()}
                            className="inline-flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            Crear hospedaje
                        </button>
                    </div>

                    {/* Panel de filtros */}
                    {mostrarFiltros && (
                        <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Ciudad"
                                        value={filtroCiudad}
                                        onChange={(e) => setFiltroCiudad(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                    />
                                </div>

                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="País"
                                        value={filtroPais}
                                        onChange={(e) => setFiltroPais(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                    />
                                </div>

                                <select
                                    value={filtroTipoZona}
                                    onChange={(e) => setFiltroTipoZona(e.target.value)}
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                >
                                    <option value="">Tipo de zona</option>
                                    <option value="CIUDAD">Ciudad</option>
                                    <option value="PUEBLO">Pueblo</option>
                                </select>

                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-4 h-4" />
                                    <input
                                        type="number"
                                        placeholder="Capacidad mínima"
                                        value={filtroCapacidad || ""}
                                        onChange={(e) => setFiltroCapacidad(Number(e.target.value) || null)}
                                        className="w-full pl-10 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {hayFiltrosActivos && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={limpiarFiltros}
                                        className="text-negro/60 hover:text-negro text-sm font-medium"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                {hospedajes.length === 0 ? (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center mx-auto mb-6">
                                <Home className="w-12 h-12 text-principal" />
                            </div>
                            <h2 className="text-2xl font-semibold text-negro mb-3">No hay hospedajes disponibles</h2>
                            <p className="text-negro/70 mb-6">
                                {hayFiltrosActivos
                                    ? "No se encontraron hospedajes con los filtros aplicados"
                                    : "Sé el primero en crear un hospedaje increíble"}
                            </p>
                            {hayFiltrosActivos ? (
                                <button
                                    onClick={limpiarFiltros}
                                    className="inline-flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                                >
                                    Limpiar filtros
                                </button>
                            ) : (
                                <button
                                    onClick={() => toast.info("Función de crear hospedaje en desarrollo")}
                                    className="inline-flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                                >
                                    <Plus className="w-5 h-5" />
                                    Crear mi primer hospedaje
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {hospedajes.map((hospedaje) => {
                            const zonaConfig = getZonaConfig(hospedaje.tipoZona)
                            const esPropio = hospedaje.id_anfitrion === usuarioId || rol === "ADMIN"

                            return (
                                <div
                                    key={hospedaje.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-negro/10 group"
                                >
                                    {/* Imagen */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={hospedaje.foto || "/placeholder.svg?height=200&width=300"}
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
                                            <h3 className="text-xl font-bold text-negro mb-2 line-clamp-1">{hospedaje.nombre}</h3>
                                            <div className="flex items-center gap-2 text-sm text-negro/60 mb-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="line-clamp-1">
                                                    {hospedaje.direccion}, {hospedaje.ciudad}
                                                </span>
                                            </div>
                                            <p className="text-sm text-negro/60">{hospedaje.pais}</p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1 bg-principal/20 px-3 py-1 rounded-lg">
                                                <Users className="w-4 h-4 text-negro" />
                                                <span className="text-sm font-medium text-negro">{hospedaje.capacidad}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm text-negro/60">4.8</span>
                                            </div>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-sm text-negro/70 mb-4 line-clamp-2">{hospedaje.descripcion}</p>

                                        {/* Anfitrión */}
                                        <div className="mb-4 p-3 bg-principal/10 rounded-lg">
                                            <p className="text-sm text-negro/60 mb-1">Anfitrión</p>
                                            <button
                                                onClick={() => navigate(`/perfil/${hospedaje.id_anfitrion}`)}
                                                className="font-medium text-negro hover:text-negro/80 transition-colors"
                                            >
                                                {hospedaje.nombreAnfitrion}
                                            </button>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-2">
                                            <button onClick={() => handleClickDetalles(hospedaje.id)}
                                                className="flex-1 bg-negro hover:bg-[#2d2d2b] text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                                            >
                                                Ver detalles
                                            </button>

                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        `https://www.google.com/maps/search/?api=1&query=${hospedaje.direccion}, ${hospedaje.ciudad}, ${hospedaje.pais}`,
                                                        "_blank",
                                                    )
                                                }
                                                className="p-2 bg-principal/20 hover:bg-principal/30 text-negro rounded-lg transition-colors duration-200"
                                                title="Ver en Google Maps"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>

                                            {esPropio && (
                                                <>
                                                    <button
                                                        onClick={() => handleClickEditar(hospedaje.id)}
                                                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                                                        title="Editar hospedaje"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleClickEliminar(hospedaje.id)}
                                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                                                        title="Eliminar hospedaje"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div >


    )
}

export default Hospedajes;

{/* <div className="container mx-auto p-4">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <input
                    type="text"
                    placeholder="Ciudad"
                    onChange={(e) => setFiltroCiudad(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-blanco"
                />
                <input
                    type="text"
                    placeholder="País"
                    onChange={(e) => setFiltroPais(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-blanco"
                />
                <select
                    onChange={(e) => setFiltroTipoZona(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-blanco"
                >
                    <option value="">Zona</option>
                    <option value="CIUDAD">Ciudad</option>
                    <option value="PUEBLO">Pueblo</option>
                </select>
                <input
                    type="number"
                    placeholder="Capacidad mínima"
                    onChange={(e) => setFiltroCapacidad(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 bg-blanco"
                />

            </div>

            <h1 className="text-3xl font-bold mb-6 text-center">Hospedajes</h1>

            <div className="flex justify-center mb-4">
                <Link
                    to="/hospedajes/crear"
                    className="bg-secundario text-white py-2 px-4 rounded-md hover:bg-secundario-hover transition"
                >
                    Crea tu hospedaje
                </Link>
            </div>


            {
                hospedajes.length === 0 ? (
                    <div className="h-64 w-full flex items-center justify-center">
                        <h2 className="text-xl font-semibold">No hay hospedajes disponibles todavia...</h2>
                    </div>

                ) :
                    (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


                            {hospedajes.map((h) => (

                                <div key={h.id} className="bg-negro text-blanco border border-gray-300 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
                                    <Link to={`/hospedaje/${h.id}`}>
                                        <img src={h.foto} className="w-full rounded-t-lg h-56 object-cover mb-4" alt="" />
                                        <h2 className="text-xl font-semibold mb-2">{h.nombre}</h2>
                                        <p className="text-gray-300"><span className="font-medium">Dirección:</span> {h.direccion}, {h.codigoPostal}</p>
                                        <p className="text-gray-300"><span className="font-medium">Ciudad:</span> {h.ciudad}, {h.pais}</p>
                                        <p className="text-gray-300 mb-4"><span className="font-medium">Capacidad:</span> {h.capacidad} personas</p>
                                        <p className="text-gray-300 flex items-center gap-2"><IconCard icon={MapPin} className="text-principal" /><span className="font-medium">Zona: <span className={zonaSelector(h.tipoZona)}>{h.tipoZona}</span></span></p>
                                        <p className="text-gray-400 mt-2 truncate w-full">{h.descripcion}</p>
                                    </Link>
                                    <div className="flex justify-between flex-col">
                                        <a href={`/perfil/${h.id_anfitrion}`}

                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 ">
                                            <span className="text-gray-300 font-medium">Anfitrion:</span>  <span className="text-principal hover:underline font-semibold">{h.nombreAnfitrion}</span>
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${h.direccion}, ${h.ciudad}, ${h.pais}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-blue-600 hover:underline"
                                        >
                                            Ver en Google Maps
                                        </a>

                                    </div>
                                    {(h.id_anfitrion === usuarioId || rol === "ADMIN") && (
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => handleClickEditar(h.id)}
                                                className="bg-principal text-negro py-2 px-4 rounded-md hover:bg-principal-hover transition"
                                            >
                                                Editar
                                            </button>
                                            <button onClick={() => handleClickEliminar(h.id)} className="bg-red-500 text-blanco py-2 px-4 rounded-md hover:bg-red-600 transition ml-2">Eliminar</button>
                                        </div>
                                    )}

                                </div>

                            ))}
                        </div>
                    )}
        </div>*/}