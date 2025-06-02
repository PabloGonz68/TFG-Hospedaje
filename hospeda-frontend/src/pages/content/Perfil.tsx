import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import { ConfirmToast } from "@/components/toasts/ConfirmToast";

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
const Perfil = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [hospedajes, setHospedajes] = useState<Hospedaje[]>([]);
    const { logout, updateUser } = useAuth() ?? {};
    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        fotoPerfil: ""
    });
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

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");

            if (!userId || !token) return;

            try {
                const response = await fetch(`http://localhost:8080/usuario/${userId}`, {
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
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    //const CLIENT_ID = import.meta.env.VITE_IMGUR_CLIENT_ID || "11b34638560014b" || "08795c3cac52f5af1852cc62aba777cf88c87b13";


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=a9a442802d1867768e4e3eed39e50987`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                const imageUrl = data.data.url;
                setUser(prevUser => ({
                    ...prevUser,
                    fotoPerfil: imageUrl,
                }));
                toast.success("Imagen subida correctamente");
            } else {
                console.error("Error al subir imagen:", data);
                toast.error("No se pudo subir la imagen");
            }
        } catch (error) {
            console.error("Error en la subida:", error);
            toast.error("Error al subir imagen");
        }
    };


    /* const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;
 
         const userId = localStorage.getItem("userId");
         const fileExt = file.name.split('.').pop();
         const fileName = `perfil_${userId}_${Date.now()}.${fileExt}`;
         const filePath = `${fileName}`;
 
         // Subir archivo al bucket
         const { error: uploadError } = await supabase.storage
             .from("imagenes-perfil")
             .upload(filePath, file, {
                 cacheControl: "3600",
                 upsert: true,
             });
 
         if (uploadError) {
             console.error("Error al subir imagen:", uploadError);
             toast.error("Error al subir imagen a Supabase");
             return;
         }
 
         // Obtener URL pública
         const { data: publicUrlData } = supabase
             .storage
             .from("imagenes-perfil")
             .getPublicUrl(filePath);
 
         if (publicUrlData?.publicUrl) {
             setUser((prevUser) => ({
                 ...prevUser,
                 fotoPerfil: publicUrlData.publicUrl,
             }));
             toast.success("Imagen subida correctamente");
         }
     };*/


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`http://localhost:8080/usuario/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                console.log("Perfil actualizado:", updatedUser);
                updateUser?.(updatedUser);
                toast.success("Perfil actualizado exitosamente");
            } else {
                const errorText = await response.json();
                console.error("Error del servidor:", errorText);
                toast.error("Error al actualizar el perfil");
            }

        } catch (error) {
            console.error(
                "Error al actualizar el usuario:",
            )
            toast.error("Error al actualizar el usuario" + error);
        }
    }


    const eliminarUser = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(`http://localhost:8080/usuario/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                const text = await response.text();
                toast.info(text);
                logout?.();
                navigate("/");

            } else {
                const errorText = await response.json();
                console.error("Error del servidor:", errorText);
                toast.warning("Error al eliminar el usuario");
            }
        } catch (error) {
            console.error(
                "Error al eliminar el usuario:",
            )
            toast.error("Error al eliminar el usuario" + error);
        }
    }

    const handleClickEliminar = () => {
        toast.custom((t) => (
            <ConfirmToast message="¿Desea eliminar el usuario?" onConfirm={() => eliminarUser()} onCancel={() => toast.dismiss(t)} />
        ))
    }

    useEffect(() => {
        const fetchHospedajes = async () => {
            const token = localStorage.getItem("token");
            console.log("El email es:", user.email);

            if (!token || !user.email) return;
            try {
                const response = await fetch(`http://localhost:8080/hospedaje/anfitrion/${user.email}`, {
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


    return (
        <>
            <main className="flex flex-col gap-10 py-4">

                <section className="flex justify-center mt-30">
                    <form onSubmit={handleSubmit} className="flex gap-10 justify-center items-center">
                        <article className="flex flex-col gap-4 border border-gray-300 p-4 px-8 w-4xl">
                            <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
                            <section className="flex gap-10 items-center">


                                <div className="flex flex-col">
                                    {user.fotoPerfil ? (
                                        <img
                                            src={user.fotoPerfil}
                                            alt="Previsualización"
                                            className="w-48 h-48 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition"
                                            onClick={() => fileInputRef.current?.click()}
                                        />
                                    ) : (
                                        <div
                                            className="w-48 h-48 rounded-full mt-2 bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <span className="text-4xl">+</span>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        className="hidden"
                                        type="file"
                                        name="fotoPerfil"
                                        onChange={handleFileChange}
                                    />



                                </div>
                                <div className="flex flex-col gap-4 w-1/2">
                                    <div className="flex flex-col">
                                        <label htmlFor="name">Nombre</label>
                                        <input
                                            className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                            type="text"
                                            name="nombre"
                                            value={user.nombre}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="apellidos">Apellidos</label>
                                        <input
                                            className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-800"
                                            type="text"
                                            name="apellidos"
                                            value={user.apellidos}
                                            onChange={handleChange}
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
                                <article className="flex flex-col">
                                    <button type="submit"
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full"
                                    >
                                        Actualizar</button>

                                    <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full" onClick={handleClickEliminar} type="button">Eliminar cuenta</button>
                                </article>

                            </section>

                        </article>



                    </form>
                </section>
                <section className="flex justify-center">
                    <div className="flex flex-col px-5">


                        <h1 className="text-3xl font-bold mb-6 text-center">Mis Hospedajes: <span className="text-principal">{hospedajes.length}</span></h1>
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
                                                    {h.capacidad > 1 ? (
                                                        <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} personas</p>
                                                    ) : (
                                                        <p className="text-gray-700"><span className="font-medium">Capacidad:</span> {h.capacidad} persona</p>
                                                    )}

                                                    <p className="text-gray-700"><span className="font-medium">Zona: <span className={zonaSelector(h.tipoZona)}>{h.tipoZona}</span></span></p>
                                                    <p className="text-gray-600 truncate w-full mt-2">{h.descripcion}</p>
                                                    <p className="text-gray-600 mt-2"> {h.visible ? <span className="text-green-600 font-semibold">Publicado</span> : <span className="text-red-600 font-semibold">Privado</span>}</p><span></span>
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
                    </div>
                </section>
            </main>
        </>
    );
};

export default Perfil;
