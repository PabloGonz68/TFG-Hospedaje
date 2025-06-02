import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react"
import { toast } from 'sonner';


function Login() {
    const [formData, SetFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post("http://localhost:8080/usuario/login", formData, {
            });

            const token = response.data.token;
            const userId = response.data.id;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);


            const userDataResponse = await axios.get(`http://localhost:8080/usuario/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Datos usuario obtenidos en el LOGIN:", userDataResponse.data);

            const backendUser = userDataResponse.data;

            const id = userId;
            const nombre = backendUser.nombre;
            const apellidos = backendUser.apellidos;
            const email = backendUser.email;
            const fotoPerfil = backendUser.fotoPerfil;
            const rol = backendUser.rol;
            console.log("contenido de fotoPerfil al loguear(sera false porq no hay foto aun):", fotoPerfil);

            if (auth) {
                auth.login(token, { id_usuario: id, nombre, apellidos, email, fotoPerfil, rol });
                console.log("Usuario guardado en localStorage:", localStorage.getItem("user"));
            }
            toast.success("Login exitoso");
            console.log("Login exitoso", response.data);
            navigate("/");
        } catch (error: any) {
            if (error.response?.status === 401) {
                setError("Credenciales incorrectas");
            } else {
                setError("Error en el login");
            }
        }
    }
    return (
        <main className="flex flex-col  gap-5 items-center justify-center h-screen">

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <p className="text-red-500 font-bold">{error}</p>
                </div>
            )}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >


                <form className="flex flex-col max-w-md mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 gap-4 border-2 border-gray-300" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold mb-4">Login</h2>
                    <div className="flex flex-col gap-2">
                        <input
                            className="border-b-2 border-gray-300 mb-4"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            className="border-b-2 border-gray-300 mb-4"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Iniciar sesión</button>
                    <div className="flex gap-2">
                        <span>¿No tienes una cuenta?</span>
                        <a className="text-blue-500 font-bold hover:underline hover:text-blue-700" href="/register">Registrate</a>
                    </div>
                </form>
            </motion.div>
        </main>
    );
}

export default Login;