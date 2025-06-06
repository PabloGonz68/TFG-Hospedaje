import { useEffect, useState } from "react";
import { GrupoUpdateModal } from "@/components/modals/grupoUpdateModal";
import { toast } from "sonner";
import { ConfirmToast } from "@/components/toasts/ConfirmToast";
import { MapPin, Plus, Users, Calendar, Ticket, Trash2 } from "lucide-react";

type MiembroDTO = {
    id: number;
    idUsuario: number;
    ticketsAportados: number;
}

type GrupoViajeDTO = {
    id: number;
    nombre: string;
    idCreador: number;
    fechaCreacion: string;
    miembros: MiembroDTO[];
}



const VerGruposViaje = () => {
    const token = localStorage.getItem("token");
    const [gruposViaje, setGruposViaje] = useState<GrupoViajeDTO[]>([]);
    const [usuarios, setUsuarios] = useState<Record<number, { nombre: string, apellidos: string }>>({});

    const fetchGruposViaje = async () => {
        if (!token) return;
        try {
            const response = await fetch("http://localhost:8080/grupo-viaje/mis-grupos", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Error al obtener los grupos de viaje");
            }
            const data = await response.json();
            console.log("Datos recibidos: " + JSON.stringify(data, null, 2));
            setGruposViaje(data);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchGruposViaje();
    }, [token]);

    const fetchUsuario = async (id: number) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8080/usuario/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Error al obtener el usuario");
                toast.error("Error al obtener el usuario");
            }
            const data = await response.json();
            setUsuarios(prev => ({ ...prev, [id]: { nombre: data.nombre, apellidos: data.apellidos } }));
            console.log("Datos recibidos: " + JSON.stringify(data, null, 2));
            return data;
        } catch (err: any) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        const idsUnicos = new Set<number>();
        gruposViaje.forEach(grupo => {
            idsUnicos.add(grupo.idCreador);
            grupo.miembros.forEach(miembro => idsUnicos.add(miembro.idUsuario));
        });

        idsUnicos.forEach(id => fetchUsuario(id));
    }, [gruposViaje]);


    const eliminarGrupoViaje = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await fetch(`http://localhost:8080/grupo-viaje/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setGruposViaje(gruposViaje.filter((grupo) => grupo.id !== id));
            toast.success("Grupo de viaje eliminado");
        } catch (error) {
            console.error("Error al eliminar el grupo de viaje", error);
            toast.error("Error al eliminar el grupo de viaje");
        }
    };

    const handleClickEliminar = (id: number) => {
        toast.custom((t) => (
            <ConfirmToast message="¿Desea eliminar el grupo de viaje?" onConfirm={() => eliminarGrupoViaje(id)} onCancel={() => toast.dismiss(t)} />
        ))
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const calcularTotalTickets = (miembros: any[]) => {
        return miembros.reduce((total, miembro) => total + miembro.ticketsAportados, 0)
    }

    return (
        <main className="flex flex-col gap-4 max-w-5xl mx-auto min-h-screen">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-negro rounded-xl">
                        <MapPin className="w-6 h-6 text-principal" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-negro">Mis Grupos de Viaje</h1>
                        <p className="text-negro/80 mt-1">Gestiona y organiza tus aventuras</p>
                    </div>
                </div>

                <button
                    className="inline-flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => (window.location.href = "/grupoViaje/")}
                >
                    <Plus className="w-5 h-5" />
                    Crear nuevo grupo
                </button>
            </div>

            {gruposViaje.length === 0 ? (
                <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-12 h-12 text-principal" />
                        </div>
                        <h2 className="text-2xl font-semibold text-negro mb-3">No tienes grupos de viaje aún</h2>
                        <p className="text-negro/70 mb-6">
                            Crea tu primer grupo y comienza a planificar aventuras increíbles con tus amigos
                        </p>
                        <button
                            className="inline-flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                            onClick={() => (window.location.href = "/grupoViaje/")}
                        >
                            <Plus className="w-5 h-5" />
                            Crear mi primer grupo
                        </button>
                    </div>
                </div>

            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {gruposViaje.map((grupo) => (
                        <div key={grupo.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-negro/10">

                            {/* Header de la card */}
                            <div className="bg-negro p-6 text-white">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold leading-tight">{grupo.nombre}</h3>
                                    <span className="text-xs bg-principal text-negro px-2 py-1 rounded-full font-medium">
                                        ID: {grupo.id}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <Calendar className="w-4 h-4" />
                                    <span>Creado el {formatearFecha(grupo.fechaCreacion)}</span>
                                </div>
                            </div>
                            {/* Contenido */}
                            <div className="p-6">
                                {/* Creador */}
                                <div className="mb-4">
                                    <p className="text-sm text-negro/60 mb-1">Creado por</p>
                                    <p className="font-medium text-negro">
                                        {usuarios[grupo.idCreador]
                                            ? `${usuarios[grupo.idCreador].nombre} ${usuarios[grupo.idCreador].apellidos}`
                                            : `Usuario ID: ${grupo.idCreador}`}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-principal/20 p-3 rounded-lg text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Users className="w-4 h-4 text-negro" />
                                            <span className="text-lg font-bold text-negro">{grupo.miembros.length}</span>
                                        </div>
                                        <p className="text-xs text-negro/60">Miembros</p>
                                    </div>
                                    <div className="bg-principal/20 p-3 rounded-lg text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Ticket className="w-4 h-4 text-negro" />
                                            <span className="text-lg font-bold text-negro">{calcularTotalTickets(grupo.miembros)}</span>
                                        </div>
                                        <p className="text-xs text-negro/60">Tickets</p>
                                    </div>
                                </div>

                                {/* Miembros */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-negro mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Miembros
                                    </h4>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {grupo.miembros.map((miembro) => (
                                            <div
                                                key={miembro.id}
                                                className="flex items-center justify-between bg-principal/20 p-2 rounded-lg"
                                            >
                                                <span className="text-sm text-negro font-medium">
                                                    {usuarios[miembro.idUsuario]
                                                        ? `${usuarios[miembro.idUsuario].nombre} ${usuarios[miembro.idUsuario].apellidos}`
                                                        : `Usuario ID: ${miembro.idUsuario}`}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs bg-negro text-white px-2 py-1 rounded-full font-medium">
                                                    <Ticket className="w-3 h-3" />
                                                    {miembro.ticketsAportados}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {/* Acciones */}
                                <div className="flex gap-2">
                                    <GrupoUpdateModal grupo={grupo} onUpdated={() => fetchGruposViaje()} />

                                    <button
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                                        title="Eliminar grupo"
                                        onClick={() => handleClickEliminar(grupo.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );

}

export default VerGruposViaje


