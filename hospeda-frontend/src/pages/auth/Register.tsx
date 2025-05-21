import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, SetFormData] = useState({
        email:"",
        nombre:"",
        apellidos:"",
        password:"",
        confirmPassword:""
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
        try{
            const response = await axios.post("http://localhost:8080/usuario/register", formData);
            console.log("Registro exitoso", response.data);
            confirm("Registro exitoso");
            /*if(confirm("¿Deseas iniciar sesión?")){
                navigate("/login");
            }*/
            navigate("/");
        }catch(error: any){
            if(error.response){
                const mensajeError = error.response.data?.message;
                if(mensajeError){
                    alert(mensajeError);
                    console.error("Error en el registro", mensajeError);
                }else{
                    console.error("Error en el registro", error);
                    alert("Error al registrar el usuario");
                }
            }
        }
    }
     return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
      </form>
    </main>
    );
}

export default Register;