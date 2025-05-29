import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Hospedaje {
    id: number;
    id_anfitrion: number;
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

}

const Hospedajes = () => {
    const navigate = useNavigate();

    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (id) {
            setUsuarioId(parseInt(id));
        }
    }, [])

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



    return (
        <div className="container mx-auto p-4">
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

                                <div key={h.id} className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition">
                                    <Link to={`/hospedaje/${h.id}`}>
                                        <h2 className="text-xl font-semibold mb-2">{h.nombre}</h2>
                                        <p className="text-gray-700"><span className="font-medium">Dirección:</span> {h.direccion}, {h.codigoPostal}</p>
                                        <p className="text-gray-700"><span className="font-medium">Ciudad:</span> {h.ciudad}, {h.pais}</p>
                                        <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} personas</p>
                                        <p className="text-gray-700"><span className="font-medium">Zona:</span> {h.tipoZona}</p>
                                        <p className="text-gray-600 mt-2">{h.descripcion}</p>
                                    </Link>
                                    <a
                                        href={h.ubicacion}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 text-blue-600 hover:underline"
                                    >
                                        Ver en mapa
                                    </a>

                                    {h.id_anfitrion === usuarioId && (
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => handleClickEditar(h.id)}
                                                className="bg-principal text-white py-2 px-4 rounded-md hover:bg-principal-hover transition"
                                            >
                                                Editar
                                            </button>
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