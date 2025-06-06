import { useEffect, useState } from "react";
import { EstadoModal } from "@/components/modals/estadoModal";
import { AlertCircle, ArrowRight, Calendar, CheckCircle, Clock, Home, Ticket, User, Users, XCircle } from "lucide-react";

type ReservaDTO = {
    id_reserva: number;
    id_hospedaje: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    costeTotalTickets: number;
    numPersonas: number;
    reservasUsuarios: {
        id_usuario: number;
        nombre_usuario: string;
        rol: string;
    }[];
};

const VerReservas = () => {
    const token = localStorage.getItem("token");
    const [misReservas, setMisReservas] = useState<ReservaDTO[]>([]);
    const [recibidas, setRecibidas] = useState<ReservaDTO[]>([]);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"mis-reservas" | "recibidas">("mis-reservas")

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const resMis = await fetch("http://localhost:8080/reservas/", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (resMis.status === 404) {
                    setMisReservas([]);  // No hay reservas realizadas
                } else if (!resMis.ok) {
                    throw new Error("Error al obtener tus reservas");
                } else {
                    const dataMis = await resMis.json();
                    setMisReservas(dataMis);
                }

                const resRecibidas = await fetch("http://localhost:8080/reservas/propietario", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (resRecibidas.status === 404) {
                    setRecibidas([]);  // No hay reservas recibidas
                } else if (!resRecibidas.ok) {
                    throw new Error("Error al obtener las reservas recibidas");
                } else {
                    const dataRecibidas = await resRecibidas.json();
                    setRecibidas(dataRecibidas);
                }
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchReservas();
    }, [token]);

    const getEstadoConfig = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "pendiente":
                return {
                    color: "text-orange-700",
                    bg: "bg-orange-100",
                    icon: Clock,
                    label: "Pendiente",
                }
            case "confirmada":
                return {
                    color: "text-green-700",
                    bg: "bg-green-100",
                    icon: CheckCircle,
                    label: "Confirmada",
                }
            case "completada":
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-100",
                    icon: CheckCircle,
                    label: "Completada",
                }
            case "cancelada":
                return {
                    color: "text-red-700",
                    bg: "bg-red-100",
                    icon: XCircle,
                    label: "Cancelada",
                }
            default:
                return {
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    icon: AlertCircle,
                    label: estado,
                }
        }
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const calcularDias = (fechaInicio: string, fechaFin: string) => {
        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin)
        const diferencia = fin.getTime() - inicio.getTime()
        return Math.ceil(diferencia / (1000 * 3600 * 24))
    }

    const renderReserva = (reserva: ReservaDTO, esRecibida: boolean) => {
        const estadoConfig = getEstadoConfig(reserva.estado)
        const IconoEstado = estadoConfig.icon
        const dias = calcularDias(reserva.fecha_inicio, reserva.fecha_fin)

        return (
            <div
                key={reserva.id_reserva}
                className="bg-white rounded-2xl mt-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-negro/10"
            >
                {/* Header de la reserva */}
                <div className="bg-negro p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-principal rounded-lg">
                                <Home className="w-5 h-5 text-negro" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{esRecibida ? "Reserva Recibida" : "Mi Reserva"}</h3>
                                <p className="text-white/80 text-sm">ID: {reserva.id_reserva}</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${estadoConfig.bg}`}>
                            <IconoEstado className={`w-4 h-4 ${estadoConfig.color}`} />
                            <span className={`text-sm font-medium ${estadoConfig.color}`}>{estadoConfig.label}</span>
                        </div>
                    </div>
                </div>

                {/* Contenido de la reserva */}
                <div className="p-6">
                    {/* Fechas */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between bg-principal/20 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-negro" />
                                <div>
                                    <p className="text-sm text-negro/60">Check-in</p>
                                    <p className="font-bold text-negro">{formatearFecha(reserva.fecha_inicio)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-negro/60" />
                                <span className="text-sm font-medium text-negro bg-principal px-2 py-1 rounded-full">
                                    {dias} {dias === 1 ? "día" : "días"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-negro" />
                                <div>
                                    <p className="text-sm text-negro/60">Check-out</p>
                                    <p className="font-bold text-negro">{formatearFecha(reserva.fecha_fin)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-principal/20 p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-negro" />
                                <span className="text-xl font-bold text-negro">{reserva.numPersonas}</span>
                            </div>
                            <p className="text-sm text-negro/60">{reserva.numPersonas === 1 ? "Persona" : "Personas"}</p>
                        </div>
                        <div className="bg-principal/20 p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Ticket className="w-5 h-5 text-negro" />
                                <span className="text-xl font-bold text-negro">{reserva.costeTotalTickets}</span>
                            </div>
                            <p className="text-sm text-negro/60">Tickets</p>
                        </div>
                    </div>

                    {/* Usuarios */}
                    <div className="mb-6">
                        <h4 className="font-medium text-negro mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Huéspedes ({reserva.reservasUsuarios.length})
                        </h4>
                        <div className="space-y-2">
                            {reserva.reservasUsuarios.map((usuario) => (
                                <div
                                    key={usuario.id_usuario}
                                    className="flex items-center justify-between bg-principal/20 p-3 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-negro rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-medium text-negro">{usuario.nombre_usuario}</span>
                                    </div>
                                    <span className="text-xs bg-negro text-white px-2 py-1 rounded-full font-medium">
                                        {usuario.rol}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acciones */}
                    {esRecibida && (
                        <div className="flex gap-2">
                            <EstadoModal reservaID={reserva.id_reserva} />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const EmptyState = ({ tipo }: { tipo: "mis-reservas" | "recibidas" }) => (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center mx-auto mb-6">
                    {tipo === "mis-reservas" ? (
                        <Calendar className="w-12 h-12 text-principal" />
                    ) : (
                        <Home className="w-12 h-12 text-principal" />
                    )}
                </div>
                <h3 className="text-xl font-semibold text-negro mb-3">
                    {tipo === "mis-reservas" ? "No tienes reservas realizadas" : "No has recibido reservas"}
                </h3>
                <p className="text-negro/70">
                    {tipo === "mis-reservas"
                        ? "Cuando realices una reserva, aparecerá aquí"
                        : "Las reservas que recibas en tus hospedajes aparecerán aquí"}
                </p>
            </div>
        </div>
    )

    return (
        <main className="min-h-screen bg-principal p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-negro rounded-xl">
                            <Calendar className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Mis Reservas</h1>
                            <p className="text-negro/80 mt-1">Gestiona todas tus reservas de hospedaje</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/80 backdrop-blur-sm rounded-t-xl p-1 shadow-lg">
                    <button
                        onClick={() => setActiveTab("mis-reservas")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "mis-reservas" ? "bg-negro text-white shadow-md" : "text-negro hover:bg-white/50"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Mis Reservas ({misReservas.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("recibidas")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "recibidas" ? "bg-negro text-white shadow-md" : "text-negro hover:bg-white/50"
                            }`}
                    >
                        <Home className="w-4 h-4" />
                        Recibidas ({recibidas.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === "mis-reservas" ? (
                    misReservas.length === 0 ? (
                        <EmptyState tipo="mis-reservas" />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {misReservas.map((reserva) => renderReserva(reserva, false))}
                        </div>
                    )
                ) : recibidas.length === 0 ? (
                    <EmptyState tipo="recibidas" />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">{recibidas.map((reserva) => renderReserva(reserva, true))}</div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}
        </main>
    )
}

export default VerReservas;


