import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReservaCalendar from "@/components/calendars/reservaCalendar";

const ReservaIndividualForm = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token || !id) {
            setError("No se pudo autenticar la solicitud.");
            return;
        }

        if (!startDate || !endDate) {
            setError("Debes seleccionar las fechas.");
            return;
        }

        const fechaInicio = startDate.toISOString().split("T")[0]; // yyyy-mm-dd
        const fechaFin = endDate.toISOString().split("T")[0];

        try {
            const response = await fetch("http://localhost:8080/reservas/individual", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                method: "POST",
                body: JSON.stringify({
                    idHospedaje: id,
                    fechaInicio,
                    fechaFin,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear la reserva");
            }

            setSuccess("Reserva creada exitosamente");
            setTimeout(() => navigate("/reserva/mis-reservas"), 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <section className="w-full flex flex-col justify-center items-center">


            <div className="flex flex-col justify-center items-center w-fit p-6 gap-4 bg-white shadow rounded-xl mt-10">
                <h2 className="text-2xl font-semibold mb-4">Reserva individual</h2>
                <form onSubmit={handleSubmit} className="flex flex-col w-fit gap-4">
                    <div className="flex flex-wrap gap-6">
                        <ReservaCalendar
                            label="Fecha de inicio"
                            selected={startDate}
                            onSelect={setStartDate}
                        />
                        <ReservaCalendar
                            label="Fecha de fin"
                            selected={endDate}
                            onSelect={setEndDate}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-principal text-white px-4 py-2 rounded hover:bg-principal-hover transition w-fit"
                        >
                            Reservar
                        </button>
                    </div>



                    {error && <p className="text-red-600 mt-2">{error}</p>}
                    {success && <p className="text-green-600 mt-2">{success}</p>}
                </form>
            </div>
        </section>
    );
};

export default ReservaIndividualForm;
