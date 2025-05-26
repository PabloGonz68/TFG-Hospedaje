import { useState } from "react";
import { useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

declare global {
    interface Window {
        google: any;
    }
}


const CrearHospedaje = () => {
    const ubicacionRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!window.google || !ubicacionRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(ubicacionRef.current, {
            types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                setFormData((prev) => ({
                    ...prev,
                    ubicacion: place.formatted_address,
                }));
            }
        });
    }, []);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        pais: "",
        capacidad: 1,
        tipoZona: "CIUDAD", // O "PUEBLO"
        descripcion: "",
        ubicacion: "",
        visible: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("http://localhost:8080/hospedaje/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Muy importante
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el hospedaje");
            }

            setSuccess(true);
            navigate("/hospedajes"); // Redirige si quieres
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Crear Hospedaje</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <input
                    type="text"
                    name="codigoPostal"
                    placeholder="Código Postal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <input
                    type="text"
                    name="pais"
                    placeholder="País"
                    value={formData.pais}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <input
                    type="number"
                    name="capacidad"
                    placeholder="Capacidad"
                    value={formData.capacidad}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    min={1}
                />

                <select
                    name="tipoZona"
                    value={formData.tipoZona}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="CIUDAD">Ciudad</option>
                    <option value="PUEBLO">Pueblo</option>
                </select>

                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                />

                <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ubicación (busca y selecciona)"
                    value={formData.ubicacion}
                    ref={ubicacionRef}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />


                <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="mr-2"
                />
                <label htmlFor="visible">Visible</label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Crear Hospedaje
                </button>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">Hospedaje creado con éxito.</p>}
            </form>
        </div>
    );
};

export default CrearHospedaje;
