import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"
import { toast } from 'sonner';
import { Users } from "lucide-react"
function Register() {
    const [formData, SetFormData] = useState({
        email: "",
        nombre: "",
        apellidos: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();


    //Coge los valores de los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    //Envia el formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();//Para que no se recargue la pagina
        try {
            const response = await axios.post("http://localhost:8080/usuario/register", formData);
            console.log("Registro exitoso", response.data);
            toast.success("Registro exitoso");
            /*if(confirm("¿Deseas iniciar sesión?")){
                navigate("/login");
            }*/
            navigate("/login");
        } catch (error: any) {
            if (error.response) {
                const mensajeError = error.response.data?.message;
                if (mensajeError) {
                    toast.warning(mensajeError);
                    console.error("Error en el registro", mensajeError);
                } else {
                    console.error("Error en el registro", error);
                    toast.error("Error al registrar el usuario");
                }
            }
        }
    }
    return (
        <main className=" flex bg-gradient-to-bl from-negro to-principal flex-col items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-negro  p-8 w-full max-w-md mx-auto border-2 shadow-[0_20px_50px_rgba(RGB(_255,_255,_255)_0.7)] border-gray-300 rounded-xl">
                    <div className="flex items-center gap-3 mb-6 border-b-2 border-principal pb-4">
                        <div className="p-2 bg-principal rounded-lg">
                            <Users className="w-5 h-5 text-negro" />
                        </div>
                        <h2 className="text-xl font-bold text-principal">Registro</h2>
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-2 border-b text-blanco bg-negro"
                    />
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="p-2 border-b text-blanco bg-negro"
                    />
                    <input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        className="p-2 border-b text-blanco bg-negro"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-2 border-b text-blanco bg-negro"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="p-2 border-b text-blanco bg-negro mb-4"
                    />
                    <button
                        type="submit"
                        className="bg-principal text-negro p-2 rounded hover:bg-principal-hover"
                    >
                        Registrarse
                    </button>
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-blanco">Ya tienes una cuenta?</span>
                        <a className="text-principal font-bold hover:underline hover:text-principal-hover" href="/login">Inicia sesión</a>
                    </div>
                </form>
            </motion.div>
        </main>
    );
}

export default Register;