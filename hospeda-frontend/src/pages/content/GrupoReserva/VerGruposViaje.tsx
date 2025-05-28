import { useEffect, useState } from "react";

type MiembroDTO = {
    id: number;
    idUsuario: number;
    ticketsAportados: number;
}

type GrupoViajeDTO = {
    id: number;
    idCreador: number;
    fechaCreacion: string;
    miembros: MiembroDTO[];
}



const VerGruposViaje = () => {
    const token = localStorage.getItem("token");
    const [gruposViaje, setGruposViaje] = useState<GrupoViajeDTO[]>([]);

    useEffect(() => {
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
        fetchGruposViaje();
    }, [token]);


    return (
        <main className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Mis Grupos de Viaje</h1>

            {gruposViaje.length === 0 ? (
                <p className="text-gray-600">No tienes grupos de viaje aún.</p>
            ) : (
                <ul className="space-y-4">
                    {gruposViaje.map((grupo) => (
                        <li key={grupo.id} className="border p-4 rounded shadow bg-white">
                            <h2 className="text-lg font-semibold">Grupo ID: {grupo.id}</h2>
                            <p><strong>Creado por usuario:</strong> {grupo.idCreador}</p>

                            <h3 className="mt-2 font-semibold">Miembros:</h3>
                            <ul className="ml-4 list-disc">
                                {grupo.miembros.length > 0 ? (
                                    grupo.miembros.map((miembro) => (
                                        <li key={miembro.id}>
                                            Usuario ID: {miembro.idUsuario} — Tickets: {miembro.ticketsAportados}
                                        </li>
                                    ))
                                ) : (
                                    <li>No hay miembros.</li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );

}

export default VerGruposViaje