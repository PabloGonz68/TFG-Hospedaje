import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
//import { supabase } from "@/supabaseClient";

const Perfil = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { logout, updateUser } = useAuth() ?? {};
    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        fotoPerfil: ""
    });

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

    const handleDelete = async () => {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar tu cuenta?");
        if (!confirmDelete) return;
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

    return (
        <>
            <main className="flex flex-col items-center justify-center h-screen py-4">


                <form onSubmit={handleSubmit} className="border border-gray-300 p-4 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

                    <article className="flex flex-col gap-4">
                        <section className="flex gap-10 items-center justify-center">


                            <div className="flex flex-col">
                                {user.fotoPerfil ? (
                                    <img
                                        src={user.fotoPerfil}
                                        alt="Previsualización"
                                        className="w-32 h-32 rounded-full mt-2 aspect-square object-cover cursor-pointer hover:opacity-80 transition"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                ) : (
                                    <div
                                        className="w-32 h-32 rounded-full mt-2 bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
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
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="name">Nombre</label>
                                    <input
                                        className="border border-gray-300"
                                        type="text"
                                        name="nombre"
                                        value={user.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="apellidos">Apellidos</label>
                                    <input
                                        className="border border-gray-300"
                                        type="text"
                                        name="apellidos"
                                        value={user.apellidos}
                                        onChange={handleChange}
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


                    <button type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Guardar cambios</button>

                    <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete} type="button">Eliminar cuenta</button>
                </form>
            </main>
        </>
    );
};

export default Perfil;
