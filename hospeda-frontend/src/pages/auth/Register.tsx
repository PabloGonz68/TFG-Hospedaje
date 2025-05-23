import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react"

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
            confirm("Registro exitoso");
            /*if(confirm("¿Deseas iniciar sesión?")){
                navigate("/login");
            }*/
            navigate("/login");
        } catch (error: any) {
            if (error.response) {
                const mensajeError = error.response.data?.message;
                if (mensajeError) {
                    alert(mensajeError);
                    console.error("Error en el registro", mensajeError);
                } else {
                    console.error("Error en el registro", error);
                    alert("Error al registrar el usuario");
                }
            }
        }
    }
    return (
        <main className=" flex flex-col items-center justify-center min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-3  p-4 w-full max-w-md mx-auto border-2 border-gray-300 rounded">
                    <h2 className="text-xl font-bold mb-4">Registro</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Registrarse
                    </button>
                    <div className="flex justify-center items-center gap-2">
                        <span>Ya tienes una cuenta?</span>
                        <a className="text-blue-500 font-bold hover:underline hover:text-blue-700" href="/login">Inicia sesión</a>
                    </div>
                </form>
            </motion.div>
        </main>
    );
}

export default Register;