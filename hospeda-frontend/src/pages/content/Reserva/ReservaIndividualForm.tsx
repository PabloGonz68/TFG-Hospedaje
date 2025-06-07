import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReservaCalendar from "@/components/calendars/reservaCalendar";
import { toast } from "sonner";
import { AlertCircle, Calendar, Home, MapPin, Users } from "lucide-react";

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
const ReservaIndividualForm = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();



    // Puedes parsear a número si es necesario
    const idHospedajeNum = id ? parseInt(id) : 0;

    const [isLoading, setIsLoading] = useState(false);

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);

    const calcularDias = (): number => {
        if (!startDate || !endDate) return 0
        const diferencia = endDate.getTime() - startDate.getTime()
        return Math.ceil(diferencia / (1000 * 3600 * 24))
    }


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


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (!token || !id) {
            toast.error("No se pudo autenticar la solicitud.");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Debes seleccionar las fechas.");
            return;
        }

        const formatDateToLocal = (date: Date) => {
            return date.toLocaleDateString("sv-SE");
        };

        const fechaInicio = formatDateToLocal(startDate);
        const fechaFin = formatDateToLocal(endDate);


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

            toast.success("Reserva creada exitosamente");
            setTimeout(() => navigate("/reserva/mis-reservas"), 2000);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-principal p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <Calendar className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Reserva Individual</h1>
                            <p className="text-negro/80 mt-1">Reserva tu estancia en un hospedaje</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario principal */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="flex flex-col w-fit gap-4">
                            {hospedaje && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-principal rounded-lg">
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
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-principal rounded-lg">
                                        <Calendar className="w-5 h-5 text-negro" />
                                    </div>
                                    <h2 className="text-xl font-bold text-negro">Selecciona las fechas</h2>
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
                                    disabled={isLoading || !startDate || !endDate}
                                    className="w-full bg-negro hover:bg-[#2d2d2b] disabled:bg-negro/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                                >
                                    {isLoading ? "Creando reserva..." : "Crear Reserva Grupal"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Panel lateral - Resumen */}
                    <div className="space-y-6">
                        {/* Resumen de la reserva */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <h3 className="text-lg font-bold text-negro mb-4">Resumen de la Reserva</h3>

                            <div className="space-y-4">
                                {hospedaje && (
                                    <div className="flex items-center justify-between p-3 bg-principal/20 rounded-lg">
                                        <span className="text-sm text-negro/60">Hospedaje</span>
                                        <span className="font-medium text-negro text-right text-sm">{hospedaje.nombre}</span>
                                    </div>
                                )}
                                {startDate && endDate && (
                                    <div className="flex items-center justify-between p-3 bg-principal/20 rounded-lg">
                                        <span className="text-sm text-negro/60">Duración</span>
                                        <span className="font-bold text-negro">
                                            {calcularDias()} {calcularDias() === 1 ? "día" : "días"}
                                        </span>
                                    </div>
                                )}


                                <div className="flex items-center gap-2 mt-1 p-3  bg-principal/20 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-negro" />
                                    <span>
                                        <strong>Tickets necesarios:</strong> {calcularDias()}{" "}
                                        <br />(equivalentes en ciudad)
                                    </span>
                                </div>
                            </div>

                        </div>
                        {/* Información importante */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-900">Información importante</h4>
                            </div>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• La reserva se automáticamente y sin confirmación</li>
                                <li>• Se utilizarán los tickets aportados</li>
                                <li>• El anfitrión decidirá finalmente si se acepta o rechaza la reserva</li>
                                <li>• Los tickets serán descontados en el momento de la reserva</li>
                            </ul>
                        </div>
                    </div>


                </div>
            </div>
        </main >
    );
};

export default ReservaIndividualForm;
