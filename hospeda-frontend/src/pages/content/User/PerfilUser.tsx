import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
const PerfilUser = () => {
    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        fotoPerfil: ""
    });
    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);

    const { IdAnfitrion } = useParams();
    const idNum = IdAnfitrion ? parseInt(IdAnfitrion) : null;





    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!idNum || !token) return console.log("Error al obtener los datos del usuario");

            try {
                const response = await fetch(`http://localhost:8080/usuario/${idNum}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser({
                        nombre: userData.nombre,
                        apellidos: userData.apellidos,
                        fotoPerfil: userData.fotoPerfil,
                        email: userData.email
                    });
                    console.log("Datos del usuario:", userData);


                } else {
                    console.error("Error al obtener los datos del usuario");
                }
            } catch (error) {
                console.error("Error de red al obtener el usuario", error);
            }
        }

        fetchUserData();
    }, [idNum]);

    useEffect(() => {
        const fetchHospedajes = async () => {
            const token = localStorage.getItem("token");
            console.log("El email es:", user.email);

            if (!token || !user.email) return;
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/email/${user.email}`, {
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
    }, [user.email]);

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
        <>
            <main className="flex max-w-screen overflow-hidden">
                {/* Form fijo a la izquierda */}
                <form className="border border-gray-300 rounded-tr-lg p-4 px-8 w-80 fixed left-0 top-28 bottom-0 overflow-auto bg-white">
                    <h2 className="text-2xl font-bold mb-4">Perfil</h2>

                    <article className="flex flex-col gap-4">
                        <section className="flex flex-col gap-10 items-center justify-center">
                            <div className="flex flex-col">
                                {user.fotoPerfil ? (
                                    <img
                                        src={user.fotoPerfil}
                                        alt="Previsualización"
                                        className="w-32 h-32 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full mt-2 bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user?.nombre || 'Usuario'
                                            )}&background=random`}
                                            className="w-32 h-32 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition"
                                            alt=""
                                        />
                                    </div>
                                )}

                                <input className="hidden" type="file" name="fotoPerfil" disabled />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name">Nombre</label>
                                    <input
                                        className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                        type="text"
                                        name="nombre"
                                        value={user.nombre}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="apellidos">Apellidos</label>
                                    <input
                                        className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                        type="text"
                                        name="apellidos"
                                        value={user.apellidos}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                        value={user.email}
                                        disabled
                                    />
                                </div>
                            </div>
                        </section>
                    </article>
                </form>

                {/* Sección de hospedajes a la derecha con scroll horizontal */}
                <section className="ml-80 flex-1 overflow-y-auto py-6 px-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Hospedajes de {user?.nombre}</h1>
                    {hospedajes.length === 0 ? (
                        <div className="h-64 w-full flex items-center justify-center">
                            <h2 className="text-xl font-semibold">No hay hospedajes disponibles todavia...</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-6">
                            {hospedajes.map((h) => (
                                <Link
                                    to={`/hospedaje/${h.id}`}
                                    key={h.id}
                                    className="bg-white shadow-md rounded-2xl p-5 border border-gray-300 w-full hover:shadow-lg transition flex-shrink-0 block"
                                >
                                    <section className="flex sm:flex-col lg:flex-row gap-4">
                                        <div className="lg:w-1/3 h-full">
                                            <img
                                                src={h.foto}
                                                className="w-full rounded-lg h-74 aspect-square object-cover mb-4"
                                                alt={h.nombre}
                                            />
                                        </div>
                                        <div className="lg:w-2/3">
                                            <h2 className="text-lg md:text-xl  font-semibold mb-2">{h.nombre}</h2>
                                            <p className="text-gray-700 text-xs md:text-md">
                                                <span className="font-medium">Dirección:</span> {h.direccion}, {h.codigoPostal}
                                            </p>
                                            <p className="text-gray-700 text-xs md:text-md">
                                                <span className="font-medium">Ciudad:</span> {h.ciudad}, {h.pais}
                                            </p>
                                            {h.capacidad > 1 ? (
                                                <p className="text-gray-700 text-xs md:text-md">
                                                    <span className="font-medium">Capacidad:</span> {h.capacidad} personas
                                                </p>
                                            ) : (
                                                <p className="text-gray-700 text-xs md:text-md">
                                                    <span className="font-medium">Capacidad:</span> {h.capacidad} persona
                                                </p>
                                            )}
                                            <p className="text-gray-700 text-xs md:text-md">
                                                <span className="font-medium">
                                                    Zona: <span className={zonaSelector(h.tipoZona)}>{h.tipoZona}</span>
                                                </span>
                                            </p>
                                            <p className="text-gray-600 mt-2 truncate w-full">{h.descripcion}</p>

                                            <div className="flex flex-col z-20 mt-3">
                                                {/* Botón perfil anfitrión */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation(); // evita que dispare el Link padre
                                                        window.location.href = `/perfil/${h.id_anfitrion}`;
                                                    }}
                                                    className="text-gray-700 sm:text-sm font-medium hover:underline text-left"
                                                    type="button"
                                                >
                                                    Anfitrión:{' '}
                                                    <span className="text-principal font-semibold">{h.nombreAnfitrion}</span>
                                                </button>

                                                {/* Botón Google Maps */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        window.open(
                                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                `${h.direccion}, ${h.ciudad}, ${h.pais}`
                                                            )}`,
                                                            '_blank',
                                                            'noopener noreferrer'
                                                        );
                                                    }}
                                                    className="text-blue-600 hover:underline mt-3 text-left"
                                                    type="button"
                                                >
                                                    Ver en Google Maps
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                </Link>
                            ))}
                        </div>
                    )}

                </section>
            </main>

        </>
    )
}

export default PerfilUser