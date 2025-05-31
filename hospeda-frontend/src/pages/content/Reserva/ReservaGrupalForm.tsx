import ReservaCalendar from "@/components/calendars/reservaCalendar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type CrearReservaConGrupoDTO = {
    idGrupo: number;
    idHospedaje: number;
    fechaInicio: string;
    fechaFin: string;
};

type GrupoViajeDTO = {
    id: number;
    nombre: string;
};

const ReservaGrupalForm = () => {
    const { hospedajeId } = useParams<{ hospedajeId: string }>();

    // Puedes parsear a número si es necesario
    const idHospedajeNum = hospedajeId ? parseInt(hospedajeId) : 0;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [grupos, setGrupos] = useState<GrupoViajeDTO[]>([]);
    const [form, setForm] = useState<CrearReservaConGrupoDTO>({
        idGrupo: 0,
        idHospedaje: idHospedajeNum,
        fechaInicio: "",
        fechaFin: "",
    });

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);


    const formatDateToLocal = (date: Date | undefined): string => {
        return date ? date.toLocaleDateString("sv-SE") : "";
    };


    useEffect(() => {
        const fetchGrupos = async () => {
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
                setGrupos(data);
            } catch (err: any) {
                console.error(err.message);
            }
        };

        fetchGrupos();
    }, [token]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            fechaInicio: formatDateToLocal(startDate),
            fechaFin: formatDateToLocal(endDate),
        }));
    }, [startDate, endDate]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/reservas/con-grupo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            console.log("Token:", token);
            console.log("Form a enviar:", form);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error desconocido");
                console.log("E", errorData.message);
            }

            const data = await res.json();
            toast.success("Reserva creada con éxito 🎉");
            console.log("Reserva creada:", data);
            setTimeout(() => navigate("/reserva/mis-reservas"), 1500);
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Crear Reserva Grupal</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 rounded shadow">
                <div>
                    <label className="block mb-1 font-medium">Grupo de Viaje</label>
                    <select name="idGrupo" onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="">Selecciona un grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.id} value={grupo.id}>
                                Grupo: {grupo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-center flex-wrap gap-6">
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
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Crear Reserva
                    </button>
                </div>



            </form>
        </main>
    )
}

export default ReservaGrupalForm;