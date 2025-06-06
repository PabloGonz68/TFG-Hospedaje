import { useState } from "react";
import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Camera, Check, FileText, Home, MapPin, Upload, Users } from "lucide-react";

declare global {
    interface Window {
        google: any;
    }
}


const CrearHospedaje = () => {
    const ubicacionRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading] = useState(false)


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
        foto: "",
        nombre: "",
        direccion: "",
        codigoPostal: "",
        ciudad: "",
        pais: "",
        capacidad: 1,
        tipoZona: "CIUDAD", // O "PUEBLO"
        descripcion: "",
        ubicacion: "",
        visible: true,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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
                setFormData(prevHospedaje => ({
                    ...prevHospedaje,
                    foto: imageUrl,
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

        if (!formData.foto) {
            toast.error("Por favor, selecciona una imagen.");
            setError("Por favor, selecciona una imagen.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/hospedaje/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el hospedaje");
            }

            setSuccess(true);
            toast.success("Hospedaje creado");
            console.log("Hospedaje creado:", formData);
            navigate("/hospedajes");
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);

        }
    };

    return (
        <main className="min-h-screen bg-principal p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <Home className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Crear Hospedaje</h1>
                            <p className="text-negro/80 mt-1">Comparte tu espacio con viajeros de todo el mundo</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Información básica */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-principal rounded-lg">
                                <FileText className="w-5 h-5 text-negro" />
                            </div>
                            <h2 className="text-xl font-bold text-negro">Información Básica</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Nombre del hospedaje <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej: Casa acogedora en el centro"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Capacidad <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="capacidad"
                                        placeholder="Número de personas"
                                        value={formData.capacidad}
                                        onChange={handleChange}
                                        required
                                        min={1}
                                        className="w-full pl-12 pr-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Tipo de zona <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="tipoZona"
                                    value={formData.tipoZona}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                >
                                    <option value="CIUDAD">Ciudad</option>
                                    <option value="PUEBLO">Pueblo</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Descripción <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="descripcion"
                                    placeholder="Describe tu hospedaje, sus características especiales, servicios incluidos..."
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Ubicación */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-principal rounded-lg">
                                <MapPin className="w-5 h-5 text-negro" />
                            </div>
                            <h2 className="text-xl font-bold text-negro">Ubicación</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Dirección completa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Calle, número, etc."
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Ciudad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ciudad"
                                    placeholder="Ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Código Postal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="codigoPostal"
                                    placeholder="CP"
                                    value={formData.codigoPostal}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    País <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="pais"
                                    placeholder="País"
                                    value={formData.pais}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-negro mb-2">
                                    Ubicación en Google Maps <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="ubicacion"
                                    placeholder="Busca y selecciona tu ubicación"
                                    value={formData.ubicacion}
                                    ref={ubicacionRef}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-principal rounded-lg">
                                <Camera className="w-5 h-5 text-negro" />
                            </div>
                            <h2 className="text-xl font-bold text-negro">Imagen Principal</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-negro">
                                Foto del hospedaje <span className="text-red-500">*</span>
                            </label>

                            {formData.foto ? (
                                <div className="relative">
                                    <img
                                        src={formData.foto || "/placeholder.svg"}
                                        alt="Previsualización"
                                        className="w-full h-64 rounded-xl object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center"
                                    >
                                        <div className="text-white text-center">
                                            <Camera className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-sm font-medium">Cambiar imagen</p>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-64 border-2 border-dashed border-negro/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-negro/50 hover:bg-principal/5 transition-all duration-200"
                                >
                                    {isUploading ? (
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-negro mx-auto mb-2"></div>
                                            <p className="text-negro/60">Subiendo imagen...</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-12 h-12 text-negro/40 mx-auto mb-4" />
                                            <p className="text-negro font-medium mb-1">Haz clic para subir una imagen</p>
                                            <p className="text-negro/60 text-sm">PNG, JPG hasta 10MB</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>
                    {/* Configuración */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-principal rounded-lg">
                                <Check className="w-5 h-5 text-negro" />
                            </div>
                            <h2 className="text-xl font-bold text-negro">Configuración</h2>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-principal/10 rounded-xl">
                            <input
                                type="checkbox"
                                name="visible"
                                id="visible"
                                checked={formData.visible}
                                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                                className="w-5 h-5 text-negro bg-white border-negro/20 rounded focus:ring-negro focus:ring-2"
                            />
                            <label htmlFor="visible" className="text-negro font-medium">
                                Hacer visible el hospedaje inmediatamente
                            </label>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-negro hover:bg-[#2d2d2b] disabled:bg-negro/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {isUploading ? "Subiendo imagen..." : "Crear Hospedaje"}
                        </button>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <Check className="w-5 h-5 text-green-600" />
                                <p className="text-green-700 font-medium">Hospedaje creado con éxito</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CrearHospedaje;
