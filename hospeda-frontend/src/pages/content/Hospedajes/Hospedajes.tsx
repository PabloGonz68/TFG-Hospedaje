import { ConfirmToast } from "@/components/toasts/ConfirmToast";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


interface Hospedaje {
    id: number;
    id_anfitrion: number;
    nombreAnfitrion: string;
    nombre: string;
    direccion: string;
    codigoPostal: string;
    ciudad: string;
    pais: string;
    capacidad: number;
    tipoZona: 'CIUDAD' | 'PUEBLO';
    descripcion: string;
    ubicacion: string;
    visible: boolean;
    foto: string;

}

const Hospedajes = () => {
    const navigate = useNavigate();

    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);
    const [filtroCiudad, setFiltroCiudad] = useState("");
    const [filtroPais, setFiltroPais] = useState("");
    const [filtroTipoZona, setFiltroTipoZona] = useState("");
    const [filtroCapacidad, setFiltroCapacidad] = useState<number | null>(null);

    const [usuarioId, setUsuarioId] = useState<number | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (id) {
            setUsuarioId(parseInt(id));
        }
    }, [])

    useEffect(() => {
        const aplicarFiltrosAuto = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                let url = `http://localhost:8080/hospedaje/filtrar?`;

                const params = new URLSearchParams();//Se utiliza para manejar los parámetros de una URL
                if (filtroCiudad) params.append("ciudad", filtroCiudad);
                if (filtroPais) params.append("pais", filtroPais);
                if (filtroTipoZona) params.append("tipoZona", filtroTipoZona);
                if (filtroCapacidad !== null && !isNaN(filtroCapacidad)) params.append("capacidad", filtroCapacidad.toString());

                url += params.toString();

                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Error al aplicar filtros");

                const data = await response.json();
                setHospedajes(data);
            } catch (error) {
                console.error("Error al aplicar filtros", error);
            }
        };

        // Llamamos la función cada vez que cambie algún filtro
        aplicarFiltrosAuto();
    }, [filtroCiudad, filtroPais, filtroTipoZona, filtroCapacidad]);


    useEffect(() => {
        const fetchHospedajes = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;
            try {
                const response = await fetch("http://localhost:8080/hospedaje/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Error al obtener los hospedajes");

                const data = await response.json();
                console.log("Hospedajes obtenidos:", data);
                setHospedajes(data);
            } catch (error) {
                console.error("Error al obtener los hospedajes", error);
            }
        }
        fetchHospedajes();
    }, []);

    const handleClickEditar = (id: number) => {
        navigate(`/hospedajes/editar/${id}`)
    }

    const eliminarHospedaje = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await fetch(`http://localhost:8080/hospedaje/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setHospedajes(hospedajes.filter((hospedaje) => hospedaje.id !== id));
            toast.success("Hospedaje eliminado");
        } catch (error) {
            console.error("Error al eliminar el hospedaje", error);
        }
    }

    const handleClickEliminar = (id: number) => {
        toast.custom((t) => (
            <ConfirmToast message="¿Desea eliminar el hospedaje?" onConfirm={() => eliminarHospedaje(id)} onCancel={() => toast.dismiss(t)} />
        ))
    }

    const zonaSelector = (zona: 'CIUDAD' | 'PUEBLO') => {
        switch (zona) {
            case 'CIUDAD':
                return 'text-blue-600';
            case 'PUEBLO':
                return 'text-green-600';
            default:
                return 'text-gray-800';
        }
    }



    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <input
                    type="text"
                    placeholder="Ciudad"
                    onChange={(e) => setFiltroCiudad(e.target.value)}
                    className="border rounded-md px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="País"
                    onChange={(e) => setFiltroPais(e.target.value)}
                    className="border rounded-md px-3 py-2"
                />
                <select
                    onChange={(e) => setFiltroTipoZona(e.target.value)}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">Zona</option>
                    <option value="CIUDAD">Ciudad</option>
                    <option value="PUEBLO">Pueblo</option>
                </select>
                <input
                    type="number"
                    placeholder="Capacidad mínima"
                    onChange={(e) => setFiltroCapacidad(Number(e.target.value))}
                    className="border rounded-md px-3 py-2"
                />

            </div>

            <h1 className="text-3xl font-bold mb-6 text-center">Hospedajes</h1>

            <div className="flex justify-center mb-4">
                <Link
                    to="/hospedajes/crear"
                    className="bg-principal text-white py-2 px-4 rounded-md hover:bg-principal-hover transition"
                >
                    Crea tu hospedaje
                </Link>
            </div>


            {
                hospedajes.length === 0 ? (
                    <div className="h-64 w-full flex items-center justify-center">
                        <h2 className="text-xl font-semibold">No hay hospedajes disponibles todavia...</h2>
                    </div>

                ) :
                    (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


                            {hospedajes.map((h) => (

                                <div key={h.id} className="bg-white  border border-gray-300 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
                                    <Link to={`/hospedaje/${h.id}`}>
                                        <img src={h.foto} className="w-full rounded-t-lg h-48 object-cover mb-4" alt="" />
                                        <h2 className="text-xl font-semibold mb-2">{h.nombre}</h2>
                                        <p className="text-gray-700"><span className="font-medium">Dirección:</span> {h.direccion}, {h.codigoPostal}</p>
                                        <p className="text-gray-700"><span className="font-medium">Ciudad:</span> {h.ciudad}, {h.pais}</p>
                                        <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} personas</p>
                                        <p className="text-gray-700"><span className="font-medium">Zona: <span className={zonaSelector(h.tipoZona)}>{h.tipoZona}</span></span></p>
                                        <p className="text-gray-600 mt-2">{h.descripcion}</p>
                                    </Link>
                                    <div className="flex justify-between flex-col">
                                        <a href={`/perfil/${h.id_anfitrion}`}

                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 ">
                                            <span className="text-gray-700 font-medium">Anfitrion:</span>  <span className="text-principal hover:underline font-semibold">{h.nombreAnfitrion}</span>
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${h.direccion}, ${h.ciudad}, ${h.pais}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-blue-600 hover:underline"
                                        >
                                            Ver en Google Maps
                                        </a>

                                    </div>
                                    {h.id_anfitrion === usuarioId && (
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => handleClickEditar(h.id)}
                                                className="bg-principal text-white py-2 px-4 rounded-md hover:bg-principal-hover transition"
                                            >
                                                Editar
                                            </button>
                                            <button onClick={() => handleClickEliminar(h.id)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition ml-2">Eliminar</button>
                                        </div>
                                    )}

                                </div>

                            ))}
                        </div>
                    )}
        </div>

    )
}

export default Hospedajes;