import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../../../components/shared/map";
import ReservaModal from "@/components/modals/reservaModal";
import { toast } from 'sonner';


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
    foto: string;
}

const VerHospedaje = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const idNum = id ? parseInt(id) : null;
    console.log("ID recibido por useParams:", id);
    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("userId");
    const usuarioIdNum = usuarioId ? parseInt(usuarioId) : null;

    const [hospedaje, setHospedaje] = useState<Hospedaje | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    const handleClickEditar = (id: number) => {
        navigate(`/hospedajes/editar/${id}`)
    }
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
                toast.error(err.message || "Error desconocido al cargar el hospedaje");
                setError(err.message);


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
        <div className="flex flex-col gap-4 max-w-3xl mx-auto p-6 bg-white shadow rounded-2xl mt-6">
            <h1 className="text-3xl font-bold mb-4">{hospedaje.nombre}</h1>
            <img src={hospedaje.foto} alt="Hospedaje" />
            <div className="flex gap-4 justify-center items-center">
                <p className="text-gray-700"><span className="font-medium">Dirección:</span> {hospedaje.direccion}, {hospedaje.codigoPostal}</p>
                <p className="text-gray-700"><span className="font-medium">Ciudad:</span> {hospedaje.ciudad}, {hospedaje.pais}</p>
            </div>
            <div className="flex gap-4 justify-center items-center">
                <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {hospedaje.capacidad} personas</p>
                <p className="text-gray-700"><span className="font-medium">Zona:</span> {hospedaje.tipoZona}</p>
            </div>
            <div>
                <label htmlFor="descripcion">Descripción:</label>
                <div className="bg-gray-100  p-4 rounded-lg">
                    <p className="text-gray-700">{hospedaje.descripcion}</p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex flex-col gap-4">
                    <label htmlFor="ubicacion">Ubicación:</label>
                    <Map direccion={hospedaje.ubicacion} />
                </div>

            </div>


            {idNum !== null && hospedaje.id_anfitrion === usuarioIdNum ? (
                <div className="flex  mt-4">
                    <button
                        onClick={() => handleClickEditar(idNum)}
                        className="bg-principal text-white py-2 px-4 rounded-md hover:bg-principal-hover transition"
                    >
                        Editar
                    </button>
                </div>
            ) : (
                id && <ReservaModal hospedajeId={id} />
            )}
        </div>
    );
};

export default VerHospedaje;