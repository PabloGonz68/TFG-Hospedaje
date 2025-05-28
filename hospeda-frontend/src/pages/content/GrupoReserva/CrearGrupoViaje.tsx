import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CrearGrupoViaje = () => {

    const navigate = useNavigate();

    const [cantidadTicketsCreador, setcantidadTicketsCreador] = useState(0);
    const [emailBusqueda, setEmailBusqueda] = useState("");
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
            alert("El usuario ya se encuentra en el grupo");
            return;
        }

        setMiembros((prevMiembros) => [...prevMiembros, { idUsuario: usuarioEncontrado!.id, nombre: usuarioEncontrado!.nombre, ticketsAportados: ticketsAportados }]);
        setUsuarioEncontrado(null);
        setEmailBusqueda("");
    }

    const handleCrearGrupo = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
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
                alert("Grupo creado correctamente");
                navigate("/grupoViaje/mis-grupos");
            } else {
                const errorText = await response.text();
                alert(`Error al crear el grupo: ${errorText}`);
            }
        } catch (error) {
            console.error("Error al crear grupo:", error);
        }
    }

    return (
        <main className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Crear Grupo de Viaje</h1>

            {/* Tickets del creador */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Tus tickets aportados:</label>
                <input
                    type="number"
                    value={cantidadTicketsCreador}
                    onChange={(e) => setcantidadTicketsCreador(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                    min={0}
                />
            </div>

            {/* Buscar usuario */}
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Buscar usuario por email:</label>
                <input
                    type="text"
                    value={emailBusqueda}
                    onChange={(e) => setEmailBusqueda(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button
                    onClick={buscarUsuarioPorEmail}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>

            {/* Mostrar cuando  usuario encontrado */}
            {usuarioEncontrado && (
                <div className="mb-4 p-4 border rounded bg-gray-100">
                    <p><strong>Usuario:</strong> {usuarioEncontrado.nombre}</p>
                    <label className="block mt-2 font-semibold">Tickets que aportará:</label>
                    <input
                        type="number"
                        min={1}
                        onChange={(e) =>
                            setUsuarioEncontrado({
                                ...usuarioEncontrado!,
                                ticketsAportados: Number(e.target.value),
                            })
                        }
                        className="w-full border p-2 rounded"
                    />
                    <button
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() =>
                            agregarMiembro(usuarioEncontrado.ticketsAportados || 0)
                        }
                    >
                        Añadir al grupo
                    </button>
                </div>
            )}

            {/* Lista de miembros */}
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">Miembros añadidos:</h2>
                {miembros.length === 0 ? (
                    <p className="text-gray-600">Aún no hay miembros.</p>
                ) : (
                    <ul className="list-disc list-inside">
                        {miembros.map((m, idx) => (
                            <li key={idx}>
                                {m.nombre} — {m.ticketsAportados} tickets
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Crear grupo */}
            <button
                onClick={handleCrearGrupo}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded w-full"
            >
                Crear Grupo de Viaje
            </button>
        </main>

    )

}

export default CrearGrupoViaje;