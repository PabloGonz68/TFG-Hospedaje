import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from 'sonner';
import { MapPin, Search, Ticket, Trash2, UserPlus, Users } from "lucide-react";


const CrearGrupoViaje = () => {

    const navigate = useNavigate();


    const [nombreGrupo, setNombreGrupo] = useState("");
    const [cantidadTicketsCreador, setCantidadTicketsCreador] = useState(0)
    const [emailBusqueda, setEmailBusqueda] = useState("");
    const [isSearching, setIsSearching] = useState(false)
    const [usuarioEncontrado, setUsuarioEncontrado] = useState<{
        id: number;
        nombre: string;
        ticketsAportados?: number;
    } | null>(null);

    const [miembros, setMiembros] = useState<{
        idUsuario: number;
        nombre: string;
        ticketsAportados: number;
    }[]>([]);



    const buscarUsuarioPorEmail = async () => {
        if (!emailBusqueda.trim()) {
            toast.error("Por favor ingresa un email")
            return
        }

        setIsSearching(true)
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/usuario/email/${emailBusqueda}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Usuario encontrado backend:", data);
                setUsuarioEncontrado({ id: data.id_usuario, nombre: data.nombre });

            }

        } catch (error) {
            console.error("Error al buscar usuario por email:", error);
        }
    };

    const agregarMiembro = (ticketsAportados: number) => {
        if (!usuarioEncontrado) return;

        //const miembroAgregado = miembros.some((miembro) => miembro.idUsuario === usuarioEncontrado?.id);
        let miembroAgregado = false;
        for (const miembro of miembros) {
            console.log("Miembro ID: " + miembro.idUsuario + " Usuario ID: " + usuarioEncontrado?.id);
            if (miembro.idUsuario === usuarioEncontrado?.id) {
                miembro.ticketsAportados = ticketsAportados;
                miembroAgregado = true;
                break;
            }
        }

        console.log(miembroAgregado);
        if (miembroAgregado) {
            toast.error("El usuario ya se encuentra en el grupo");
            return;
        }

        setMiembros((prevMiembros) => [...prevMiembros, { idUsuario: usuarioEncontrado!.id, nombre: usuarioEncontrado!.nombre, ticketsAportados: ticketsAportados }]);
        setUsuarioEncontrado(null);
        setEmailBusqueda("");
    }

    const eliminarMiembro = (idUsuario: number) => {
        setMiembros((prevMiembros) => prevMiembros.filter((miembro) => miembro.idUsuario !== idUsuario));
    }

    const handleCrearGrupo = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            const body = {
                nombre: nombreGrupo,
                cantidadTicketsCreador,
                miembros: miembros.map((miembro) => ({
                    idUsuario: miembro.idUsuario,
                    ticketsAportados: miembro.ticketsAportados
                }))

            };
            const response = await fetch("http://localhost:8080/grupo-viaje/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                toast.success("Grupo creado correctamente");
                navigate("/grupoViaje/mis-grupos");
            } else {
                const errorJson = await response.json();
                toast.error(errorJson.message || "Error al crear el grupo, intenta de nuevo");

            }
        } catch (error) {
            console.error("Error al crear grupo:", error);
        }
    }
    const { hospedajeId } = useParams();
    const totalTickets = cantidadTicketsCreador + miembros.reduce((sum, miembro) => sum + miembro.ticketsAportados, 0)

    return (
        <div className="min-h-screen bg-principal p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <Users className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Crear Grupo de Viaje</h1>
                            <p className="text-negro/80 mt-1">Organiza tu próxima aventura con amigos</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información del grupo */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-principal rounded-lg">
                                    <MapPin className="w-5 h-5 text-negro" />
                                </div>
                                <h2 className="text-xl font-bold text-negro">Información del Grupo</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-negro mb-2">
                                        Nombre del grupo <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={nombreGrupo}
                                        onChange={(e) => setNombreGrupo(e.target.value)}
                                        placeholder="Ej: Aventura en Barcelona 2024"
                                        className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-negro mb-2">Tus tickets aportados</label>
                                    <div className="relative">
                                        <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-5 h-5" />
                                        <input
                                            type="number"
                                            value={cantidadTicketsCreador}
                                            onChange={(e) => setCantidadTicketsCreador(Number(e.target.value))}
                                            min={0}
                                            className="w-full pl-12 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buscar miembros */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-principal rounded-lg">
                                    <UserPlus className="w-5 h-5 text-negro" />
                                </div>
                                <h2 className="text-xl font-bold text-negro">Añadir Miembros</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-negro mb-2">Buscar usuario por email</label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={emailBusqueda}
                                                onChange={(e) => setEmailBusqueda(e.target.value)}
                                                placeholder="usuario@ejemplo.com"
                                                className="w-full pl-12 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                                onKeyPress={(e) => e.key === "Enter" && buscarUsuarioPorEmail()}
                                            />
                                        </div>
                                        <button
                                            onClick={buscarUsuarioPorEmail}
                                            disabled={isSearching}
                                            className="px-6 py-3 bg-negro hover:bg-[#2d2d2b] disabled:bg-negro/50 text-white rounded-xl font-medium transition-colors duration-200"
                                        >
                                            {isSearching ? "Buscando..." : "Buscar"}
                                        </button>
                                    </div>
                                </div>

                                {/* Usuario encontrado */}
                                {usuarioEncontrado && (
                                    <div className="p-4 bg-principal/20 rounded-xl border border-principal/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-negro rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-negro">{usuarioEncontrado.nombre}</p>
                                                <p className="text-sm text-negro/60">Usuario encontrado</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-negro">Tickets que aportará</label>
                                            <div className="relative">
                                                <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-5 h-5" />
                                                <input
                                                    type="number"
                                                    min={1}
                                                    onChange={(e) =>
                                                        setUsuarioEncontrado({
                                                            ...usuarioEncontrado,
                                                            ticketsAportados: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full pl-12 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={() => agregarMiembro(usuarioEncontrado.ticketsAportados || 0)}
                                                className="w-full bg-negro hover:bg-[#2d2d2b] text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                                            >
                                                Añadir al grupo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Panel lateral */}
                    <div className="space-y-6">
                        {/* Resumen del grupo */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <h3 className="text-lg font-bold text-negro mb-4">Resumen del Grupo</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-principal/20 rounded-lg">
                                    <span className="text-sm text-negro/60">Total miembros</span>
                                    <span className="font-bold text-negro">{miembros.length + 1}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-principal/20 rounded-lg">
                                    <span className="text-sm text-negro/60">Total tickets</span>
                                    <span className="font-bold text-negro">{totalTickets}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lista de miembros */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <h3 className="text-lg font-bold text-negro mb-4">Miembros del Grupo</h3>

                            <div className="space-y-3">
                                {/* Creador */}
                                <div className="flex items-center justify-between p-3 bg-principal/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-negro rounded-full flex items-center justify-center">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-negro">Tú (Creador)</p>
                                            <p className="text-xs text-negro/60">{cantidadTicketsCreador} tickets</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Miembros añadidos */}
                                {miembros.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-negro/30 mx-auto mb-3" />
                                        <p className="text-negro/60 text-sm">Aún no hay miembros</p>
                                    </div>
                                ) : (
                                    miembros.map((miembro, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-negro">{miembro.nombre}</p>
                                                    <p className="text-xs text-negro/60">{miembro.ticketsAportados} tickets</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => eliminarMiembro(miembro.idUsuario)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                title="Eliminar miembro"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Botón crear grupo */}
                        <button
                            onClick={handleCrearGrupo}
                            disabled={!nombreGrupo.trim()}
                            className="w-full bg-negro hover:bg-[#2d2d2b] disabled:bg-negro/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            Crear Grupo de Viaje
                        </button>
                        {hospedajeId && <button
                            onClick={() => navigate(`/reserva/grupal/${hospedajeId}`)}

                            className="w-full bg-negro hover:bg-[#2d2d2b] disabled:bg-negro/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            ¿Ya tienes un grupo?
                        </button>}

                    </div>
                </div>
            </div>
        </div>

    )

}

export default CrearGrupoViaje;