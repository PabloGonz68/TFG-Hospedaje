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
            <main className="flex flex-col gap-10 items-center justify-start h-screen py-4">


                <form className="border border-gray-300 p-4 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

                    <article className="flex flex-col gap-4">
                        <section className="flex gap-10 items-center justify-center">


                            <div className="flex flex-col">
                                {user.fotoPerfil ? (
                                    <img
                                        src={user.fotoPerfil}
                                        alt="Previsualización"
                                        className="w-32 h-32 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition"

                                    />
                                ) : (
                                    <div
                                        className="w-32 h-32 rounded-full mt-2 bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"

                                    >
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=random`} className="w-32 h-32 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition}" alt="" />
                                    </div>
                                )}

                                <input

                                    className="hidden"
                                    type="file"
                                    name="fotoPerfil"
                                    disabled
                                />



                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name">Nombre</label>
                                    <input
                                        className="border border-gray-300"
                                        type="text"
                                        name="nombre"
                                        value={user.nombre}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="apellidos">Apellidos</label>
                                    <input
                                        className="border border-gray-300"
                                        type="text"
                                        name="apellidos"
                                        value={user.apellidos}
                                        disabled
                                    />
                                </div>
                            </div>
                        </section>




                        <div className="flex flex-col">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                value={user.email}
                                disabled
                            />
                        </div>

                    </article>
                </form>
                <section>
                    <h1 className="text-3xl font-bold mb-6 text-center">Hospedajes de {user?.nombre}</h1>
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
                                                {h.capacidad > 1 ? (
                                                    <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} personas</p>
                                                ) : (
                                                    <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} persona</p>
                                                )}

                                                <p className="text-gray-700"><span className="font-medium">Zona: <span className={zonaSelector(h.tipoZona)}>{h.tipoZona}</span></span></p>
                                                <p className="text-gray-600 mt-2">{h.descripcion}</p>
                                            </Link>
                                            <div className="flex justify-between flex-col">
                                                <a href={`/perfil/${h.id_anfitrion}`}
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




                                        </div>

                                    ))}
                                </div>
                            )}
                </section>
            </main>
        </>
    )
}

export default PerfilUser