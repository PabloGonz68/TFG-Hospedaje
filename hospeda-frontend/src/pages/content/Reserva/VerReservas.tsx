import { useEffect, useState } from "react";
import { EstadoModal } from "@/components/modals/estadoModal";

type ReservaDTO = {
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

    const colorEstado = (estado: string) => {
        switch (estado.toLocaleLowerCase()) {
            case "pendiente":
                return "text-orange-700";
            case "comfirmada":
                return "text-green-600";
            case "completada":
                return "text-blue-600";
            case "cancelada":
                return "text-red-600";
            default:
                return "text-gray-800";
        }
    }

    const renderReserva = (reserva: ReservaDTO) => (
        <div key={reserva.id_hospedaje} className="border p-4 rounded-lg shadow mb-4 flex flex-col">
            <p className="mt-1 text-sm">
                Del <b>{reserva.fecha_inicio}</b> al <b>{reserva.fecha_fin}</b>
            </p>

            <p className="text-sm">
                Estado: <span className={`font-medium ${colorEstado(reserva.estado)}`}>
                    {reserva.estado}
                </span>
            </p>
            <p className="text-sm">Personas: {reserva.numPersonas}</p>
            <p className="text-sm">Tickets usados: {reserva.costeTotalTickets}</p>
            <p className="text-sm mt-2 font-semibold">Usuarios:</p>
            <ul className="list-disc list-inside">
                {reserva.reservasUsuarios.map((usuario) => (
                    <li key={usuario.id_usuario}>
                        {usuario.nombre_usuario} ({usuario.rol})
                    </li>
                ))}
            </ul>

        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Mis reservas</h2>
            {misReservas.length === 0 ? <p>No tienes reservas realizadas.</p> : misReservas.map(renderReserva)}

            <h2 className="text-2xl font-bold mt-10 mb-6">Reservas recibidas</h2>
            {recibidas.length === 0 ? <p>No has recibido reservas.</p> : recibidas.map(renderReserva)}
            <EstadoModal />

            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default VerReservas;
