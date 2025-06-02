import { useEffect, useState } from "react";
import { GrupoUpdateModal } from "@/components/modals/grupoUpdateModal";
import { toast } from "sonner";
import { ConfirmToast } from "@/components/toasts/ConfirmToast";

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

    return (
        <main className="flex flex-col gap-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Mis Grupos de Viaje</h1>
            <button className="bg-principal hover:bg-principal-hover text-white py-2 px-4 rounded" onClick={() => window.location.href = "/grupoViaje/"}>Crear nuevo grupo de viaje</button>

            {gruposViaje.length === 0 ? (
                <div className="h-64 w-full flex items-center justify-center">
                    <h2 className="text-xl font-semibold">No tienes grupos de viaje aún...</h2>
                </div>

            ) : (
                <ul className="space-y-4">
                    {gruposViaje.map((grupo) => (
                        <li key={grupo.id} className="flex items-start justify-between  border p-4 rounded shadow bg-white">
                            <div>
                                <h2 className="text-lg font-semibold">Grupo: {grupo.nombre} (ID: {grupo.id})</h2>
                                <p><strong>Creado por usuario:</strong> {grupo.idCreador}</p>

                                <h3 className="mt-2 font-semibold">Miembros:</h3>
                                <ul className="ml-4 list-disc">
                                    {grupo.miembros.length > 0 ? (
                                        grupo.miembros.map((miembro) => (
                                            <li key={miembro.id}>
                                                Usuario ID: {miembro.idUsuario} — Tickets: {miembro.ticketsAportados}🎫
                                            </li>
                                        ))
                                    ) : (
                                        <li>No hay miembros.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-4">
                                <GrupoUpdateModal grupo={grupo} onUpdated={() => fetchGruposViaje()} />
                                <button
                                    onClick={() => handleClickEliminar(grupo.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg mt-4">
                                    Eliminar
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </main>
    );

}

export default VerGruposViaje