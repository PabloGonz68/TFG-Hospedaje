import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react"
import { toast } from 'sonner';
import { Fingerprint } from "lucide-react";


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
        <main className=" flex bg-gradient-to-br from-negro to-principal flex-col items-center justify-center min-h-screen p-4">

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


                <form className="flex flex-col gap-3 bg-negro  p-8 w-full max-w-md mx-auto border-2 shadow-[0_20px_50px_rgba(RGB(_255,_255,_255)_0.7)] border-gray-300 rounded-xl" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3 mb-6 border-b-2 border-principal pb-4">
                        <div className="p-2 bg-principal rounded-lg">
                            <Fingerprint className="w-5 h-5 text-negro" />
                        </div>
                        <h2 className="text-xl font-bold text-principal">Iniciar sesión</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <input
                            className="p-2 border-b text-blanco bg-negro"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            className="p-2 border-b text-blanco bg-negro"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    <button className="bg-principal text-negro p-2 rounded hover:bg-principal-hover" type="submit">Iniciar sesión</button>
                    <div className="flex gap-2">
                        <span className="text-blanco">¿No tienes una cuenta?</span>
                        <a className="text-principal font-bold hover:underline hover:text-principal-hover" href="/register">Registrate</a>
                    </div>
                </form>
            </motion.div>
        </main>
    );
}

export default Login;