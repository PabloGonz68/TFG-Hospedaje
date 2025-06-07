import ReservaCalendar from "@/components/calendars/reservaCalendar";
import { AlertCircle, Calendar, Check, Home, MapPin, Ticket, Users } from "lucide-react";
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
    miembros?: { id: number; nombre: string; ticketsAportados: number }[]
};

type Hospedaje = {
    id: number;
    id_anfitrion: number;
    nombre: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    pais: string;
    capacidad: number;
    tipoZona: "CIUDAD" | "PUEBLO";
    descripcion: string;
    ubicacion: string;
    visible: boolean;
    foto: string;
};

const ReservaGrupalForm = () => {
    const { hospedajeId } = useParams<{ hospedajeId: string }>();

    // Puedes parsear a número si es necesario
    const idHospedajeNum = hospedajeId ? parseInt(hospedajeId) : 0;

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [grupos, setGrupos] = useState<GrupoViajeDTO[]>([]);

    const [grupoSeleccionado, setGrupoSeleccionado] = useState<GrupoViajeDTO | null>(null)
    const handleGrupoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const grupoId = Number.parseInt(e.target.value)
        const grupo = grupos.find((g) => g.id === grupoId) || null
        setGrupoSeleccionado(grupo)
        setForm({ ...form, idGrupo: grupoId })
    }
    const [form, setForm] = useState<CrearReservaConGrupoDTO>({
        idGrupo: 0,
        idHospedaje: idHospedajeNum,
        fechaInicio: "",
        fechaFin: "",
    });
    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);

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

    useEffect(() => {
        const fetchHospedaje = async () => {
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/${idHospedajeNum}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Error al obtener el hospedaje");
                }
                const data = await response.json();
                setHospedaje(data);
            } catch (error: any) {
                console.error(error.message);
            }
        };
        fetchHospedaje();
    }, [idHospedajeNum, token]);

    /*const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }*/
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }

    const calcularTotalTickets = (): number => {
        if (!grupoSeleccionado?.miembros) return 0
        return grupoSeleccionado.miembros.reduce((total, miembro) => total + miembro.ticketsAportados, 0)
    }


    const calcularDias = (): number => {
        if (!startDate || !endDate) return 0
        const diferencia = endDate.getTime() - startDate.getTime()
        return Math.ceil(diferencia / (1000 * 3600 * 24))
    }

    const calcularTicketsNecesarios = (): number => {
        if (!grupoSeleccionado?.miembros || !hospedaje) return 0;
        const numMiembros = grupoSeleccionado.miembros.length;
        const dias = calcularDias();


        const totalPorPersona = numMiembros * dias;

        if (hospedaje.tipoZona === "CIUDAD") {

            return totalPorPersona;
        } else {

            return totalPorPersona * 0.5;
        }
    };


    return (
        <main className="min-h-screen bg-[#ffcd40] p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <Calendar className="w-6 h-6 text-[#ffcd40]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Reserva Grupal</h1>
                            <p className="text-negro/80 mt-1">Reserva con tu grupo de viaje</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario principal */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información del hospedaje */}
                            {hospedaje && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#ffcd40] rounded-lg">
                                            <Home className="w-5 h-5 text-negro" />
                                        </div>
                                        <h2 className="text-xl font-bold text-negro">Hospedaje Seleccionado</h2>
                                    </div>

                                    <div className="flex gap-4">
                                        <img
                                            src={hospedaje.foto || "/placeholder.svg"}
                                            alt={hospedaje.nombre}
                                            className="w-24 h-24 rounded-xl object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-negro mb-1">{hospedaje.nombre}</h3>
                                            <div className="flex items-center gap-2 text-sm text-negro/60 mb-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {hospedaje.direccion}, {hospedaje.ciudad}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-negro/60">
                                                <Users className="w-4 h-4" />
                                                <span>Capacidad: {hospedaje.capacidad} personas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Selección de grupo */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#ffcd40] rounded-lg">
                                        <Users className="w-5 h-5 text-[#1d1d1b]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[#1d1d1b]">Seleccionar Grupo</h2>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1d1d1b] mb-2">
                                        Grupo de viaje <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="idGrupo"
                                        onChange={handleGrupoChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#1d1d1b]/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1d1d1b] focus:border-transparent"
                                    >
                                        <option value="">Selecciona un grupo</option>
                                        {grupos.map((grupo) => (
                                            <option key={grupo.id} value={grupo.id}>
                                                {grupo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {grupoSeleccionado && (
                                    <div className="mt-4 p-4 bg-[#ffcd40]/20 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Check className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-[#1d1d1b]">Grupo seleccionado: {grupoSeleccionado.nombre}</span>
                                        </div>
                                        {grupoSeleccionado.miembros && (
                                            <p className="text-sm text-[#1d1d1b]/60">
                                                {grupoSeleccionado.miembros.length} miembros • {calcularTotalTickets()} tickets totales
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#ffcd40] rounded-lg">
                                        <Users className="w-5 h-5 text-[#1d1d1b]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[#1d1d1b]">Seleccionar Grupo</h2>
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
                            </div>
                            <div className="flex justify-center">
                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !form.idGrupo || !startDate || !endDate}
                                    className="w-full bg-[#1d1d1b] hover:bg-[#2d2d2b] disabled:bg-[#1d1d1b]/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                >
                                    {isLoading ? "Creando reserva..." : "Crear Reserva Grupal"}
                                </button>
                            </div>



                        </form>
                    </div>
                    {/* Panel lateral - Resumen */}
                    <div className="space-y-6">
                        {/* Resumen de la reserva */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#1d1d1b]/10">
                            <h3 className="text-lg font-bold text-[#1d1d1b] mb-4">Resumen de la Reserva</h3>

                            <div className="space-y-4">
                                {hospedaje && (
                                    <div className="flex items-center justify-between p-3 bg-[#ffcd40]/20 rounded-lg">
                                        <span className="text-sm text-[#1d1d1b]/60">Hospedaje</span>
                                        <span className="font-medium text-[#1d1d1b] text-right text-sm">{hospedaje.nombre}</span>
                                    </div>
                                )}

                                {grupoSeleccionado && (
                                    <div className="flex items-center justify-between p-3 bg-[#ffcd40]/20 rounded-lg">
                                        <span className="text-sm text-[#1d1d1b]/60">Grupo</span>
                                        <span className="font-medium text-[#1d1d1b]">{grupoSeleccionado.nombre}</span>
                                    </div>
                                )}

                                {grupoSeleccionado?.miembros && (
                                    <div className="flex items-center justify-between p-3 bg-[#ffcd40]/20 rounded-lg">
                                        <span className="text-sm text-[#1d1d1b]/60">Miembros</span>
                                        <span className="font-bold text-[#1d1d1b]">{grupoSeleccionado.miembros.length}</span>
                                    </div>
                                )}

                                {startDate && endDate && (
                                    <div className="flex items-center justify-between p-3 bg-[#ffcd40]/20 rounded-lg">
                                        <span className="text-sm text-[#1d1d1b]/60">Duración</span>
                                        <span className="font-bold text-[#1d1d1b]">
                                            {calcularDias()} {calcularDias() === 1 ? "día" : "días"}
                                        </span>
                                    </div>
                                )}

                                {grupoSeleccionado?.miembros && (
                                    <div className="mt-2 text-sm  text-[#1d1d1b] space-y-4">
                                        <div className="flex items-center gap-2 p-3  bg-[#ffcd40]/20 rounded-lg">
                                            <Ticket className="w-4 h-4 text-[#1d1d1b]" />
                                            <span>
                                                <strong>Tickets aportados:</strong> {calcularTotalTickets()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 p-3  bg-[#ffcd40]/20 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-[#1d1d1b]" />
                                            <span>
                                                <strong>Tickets necesarios:</strong> {calcularTicketsNecesarios()}{" "}
                                                <br />(equivalentes en ciudad)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información importante */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-900">Información importante</h4>
                            </div>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• La reserva se realizará para todo el grupo</li>
                                <li>• Se utilizarán los tickets del grupo automáticamente</li>
                                <li>• El anfitrión decidirá finalmente si se acepta o rechaza la reserva</li>
                                <li>• El creador del grupo será el responsable principal</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default ReservaGrupalForm;