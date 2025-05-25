
import { useEffect, useState } from "react";

const Perfil = () => {
    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
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
                        fotoPerfil: userData.fotoPerfil
                    });

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        const reader = new FileReader();


        reader.onload = () => {
            const base64String = reader.result as string;
            console.log(base64String);
            setUser(prevUser => ({
                ...prevUser,
                fotoPerfil: base64String
            }))
        }
        reader.readAsDataURL(file);
    }

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
                const text = await response.json();
                alert("Perfil actualizado exitosamente " + text);
            } else {
                const errorText = await response.json();
                console.error("Error del servidor:", errorText);
                alert("Error al actualizar el perfil");
            }

        } catch (error) {
            console.error(
                "Error al actualizar el usuario:",
            )
            alert("Error al actualizar el usuario" + error);
        }
    }

    return (
        <>
            <main className="flex flex-col items-center justify-center h-screen py-4">


                <form onSubmit={handleSubmit} className="border border-gray-300 p-4">
                    <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
                    <div>
                        <label htmlFor="name">Nombre</label>
                        <input
                            className="border border-gray-300"
                            type="text"
                            name="nombre"
                            value={user.nombre}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="apellidos">Apellidos</label>
                        <input
                            className="border border-gray-300"
                            type="text"
                            name="apellidos"
                            value={user.apellidos}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="fotoPerfil">URL de la imagen de perfil</label>
                        <input
                            className="border border-gray-300 p-2"
                            type="file"
                            name="fotoPerfil"
                            onChange={handleFileChange}
                        />
                    </div>
                    {user.fotoPerfil && (
                        <img
                            src={user.fotoPerfil}
                            alt="Previsualización"
                            className="w-32 h-32 rounded-full mt-2"
                        />
                    )}
                    <button type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Guardar cambios</button>
                </form>
            </main>
        </>
    );
};

export default Perfil;
