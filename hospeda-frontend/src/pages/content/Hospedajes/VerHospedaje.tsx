import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../../../components/shared/map";

interface Hospedaje {
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

const VerHospedaje = () => {
    const { id } = useParams();
    console.log("ID recibido por useParams:", id);
    const token = localStorage.getItem("token");

    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchHospedaje = async () => {
            if (!token) return;
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });


                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al obtener el hospedaje");
                }

                const data = await response.json();
                setHospedaje(data); // guardar hospedaje en el estado
            } catch (err: any) {
                setError(err.message); // guardar error

            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchHospedaje();
        }
    }, [id, token]);
    if (loading) {
        return <div className="text-center mt-8 text-blue-600 font-semibold">Cargando hospedaje...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600 font-semibold">{error}</div>;
    }

    if (!hospedaje) {
        return <div className="text-center mt-8 text-gray-500">Hospedaje no encontrado</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-2xl mt-6">
            <h1 className="text-3xl font-bold mb-4">{hospedaje.nombre}</h1>
            <p className="text-gray-700"><span className="font-medium">Dirección:</span> {hospedaje.direccion}, {hospedaje.codigoPostal}</p>
            <p className="text-gray-700"><span className="font-medium">Ciudad:</span> {hospedaje.ciudad}, {hospedaje.pais}</p>
            <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {hospedaje.capacidad} personas</p>
            <p className="text-gray-700"><span className="font-medium">Zona:</span> {hospedaje.tipoZona}</p>
            <p className="text-gray-700 mt-4">{hospedaje.descripcion}</p>
            <Map direccion={hospedaje.ubicacion} />
            <a
                href={hospedaje.ubicacion}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:underline"
            >
                Ver en Google Maps
            </a>
        </div>
    );
};

export default VerHospedaje;