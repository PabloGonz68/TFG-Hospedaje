import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner';
import { ConfirmToast } from "@/components/toasts/ConfirmToast";
import { PopoverPassword } from "@/components/popovers/popoverPassword";
import {
    User,
    Home,
    MapPin,
    Users,

    Camera,
    Edit,
    Trash2,
    Mail,
    Calendar,
    Settings,
    ExternalLink,
} from "lucide-react"

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
        fotoPerfil: "",
        fechaRegistro: ""
    });


    const [isEditing, setIsEditing] = useState(false)
    const [isUploading] = useState(false)
    const getZonaConfig = (zona: "CIUDAD" | "PUEBLO") => {
        switch (zona) {
            case "CIUDAD":
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-100",
                    label: "Ciudad",
                }
            case "PUEBLO":
                return {
                    color: "text-green-700",
                    bg: "bg-green-100",
                    label: "Pueblo",
                }
            default:
                return {
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    label: zona,
                }
        }
    }
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
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
                        email: userData.email,
                        fechaRegistro: userData.fechaRegistro
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

        e.preventDefault();

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

                // Crear el usuario actualizado aquí
                const updatedUserData = {
                    ...user,
                    fotoPerfil: imageUrl,
                };

                setUser(updatedUserData);

                toast.success("Imagen subida correctamente");

                // Ahora usar el objeto actualizado
                const userId = localStorage.getItem("userId");
                const response = await fetch(`http://localhost:8080/usuario/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(updatedUserData)
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

            } else {
                console.error("Error al subir imagen:", data);
                toast.error("No se pudo subir la imagen");
            }
        } catch (error) {
            console.error("Error al subir imagen o actualizar perfil:", error);
            toast.error("Error en la subida o actualización");
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

        try {
            const userId = localStorage.getItem("userId");
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
        <div className="min-h-screen bg-principal">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-negro rounded-xl">
                            <User className="w-6 h-6 text-principal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-negro">Mi Perfil</h1>
                            <p className="text-negro/80 mt-1">Gestiona tu información personal y hospedajes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información del perfil */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10 sticky top-6">
                            {/* Foto de perfil */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    {user.fotoPerfil ? (
                                        <img
                                            src={user.fotoPerfil || "/placeholder.svg"}
                                            alt={`${user.nombre} ${user.apellidos}`}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-principal cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => fileInputRef.current?.click()}
                                        />
                                    ) : (
                                        <div
                                            className="w-24 h-24 rounded-full border-4 border-principal bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Camera className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-principal rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-principal/80 transition-colors">
                                        {isUploading ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border-b border-negro"></div>
                                        ) : (
                                            <Camera className="w-3 h-3 text-negro" />
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        className="hidden"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-negro mt-3">
                                    {user.nombre} {user.apellidos}
                                </h2>
                                <p className="text-negro/60 text-sm">Anfitrión verificado</p>
                            </div>

                            {/* Estadísticas */}
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-principal/20 rounded-lg">
                                    <Home className="w-5 h-5 text-negro" />
                                    <div>
                                        <p className="font-bold text-negro">{hospedajes.length}</p>
                                        <p className="text-xs text-negro/60">Hospedajes</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-principal/20 rounded-lg">
                                    <Calendar className="w-5 h-5 text-negro" />
                                    <div>
                                        <p className="font-bold text-negro">{formatearFecha(user.fechaRegistro || "")}</p>
                                        <p className="text-xs text-negro/60">Miembro desde</p>
                                    </div>
                                </div>
                            </div>
                            {/* Acciones rápidas */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="w-full flex items-center gap-2 bg-negro hover:bg-[#2d2d2b] text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    {isEditing ? "Cancelar edición" : "Editar perfil"}
                                </button>


                                <PopoverPassword />

                                <button
                                    onClick={handleClickEliminar}
                                    className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar cuenta
                                </button>
                            </div>
                        </div>


                    </div>


                    {/* Contenido principal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Formulario de edición */}
                        {isEditing && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-principal rounded-lg">
                                        <Settings className="w-5 h-5 text-negro" />
                                    </div>
                                    <h2 className="text-xl font-bold text-negro">Editar Información Personal</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-negro mb-2">
                                                Nombre <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={user.nombre}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-negro mb-2">
                                                Apellidos <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="apellidos"
                                                value={user.apellidos}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-negro/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-negro focus:border-transparent"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-negro mb-2">Correo electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-negro/60 w-5 h-5" />
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full pl-12 pr-4 py-3 border border-negro/20 rounded-xl bg-gray-50 text-negro/60"
                                                />
                                            </div>
                                            <p className="text-xs text-negro/60 mt-1">El email no se puede modificar</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                                        >
                                            Guardar cambios
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 border border-negro/20 text-negro rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Mis hospedajes */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-negro/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-principal rounded-lg">
                                        <Home className="w-5 h-5 text-negro" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-negro">Mis Hospedajes ({hospedajes.length})</h2>
                                        <p className="text-negro/60 text-sm">Gestiona tus propiedades</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/hospedajes/crear")}
                                    className="bg-negro hover:bg-[#2d2d2b] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Añadir hospedaje
                                </button>
                            </div>

                            {hospedajes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 bg-negro rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Home className="w-12 h-12 text-principal" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-negro mb-3">No tienes hospedajes aún</h3>
                                    <p className="text-negro/70 mb-6">Crea tu primer hospedaje y comienza a recibir huéspedes</p>
                                    <button
                                        onClick={() => navigate("/hospedajes/crear")}
                                        className="bg-negro hover:bg-[#2d2d2b] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                                    >
                                        Crear mi primer hospedaje
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                    {hospedajes.map((hospedaje) => {
                                        const zonaConfig = getZonaConfig(hospedaje.tipoZona)

                                        return (
                                            <div
                                                key={hospedaje.id}
                                                className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-negro/10 group"
                                            >
                                                {/* Imagen */}
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={hospedaje.foto || "/placeholder.svg"}
                                                        alt={hospedaje.nombre}
                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-4 right-4">
                                                        <div
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${zonaConfig.bg} ${zonaConfig.color}`}
                                                        >
                                                            <MapPin className="w-3 h-3" />
                                                            {zonaConfig.label}
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-4 left-4">
                                                        <div
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${hospedaje.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {hospedaje.visible ? "Publicado" : "Privado"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contenido */}
                                                <div className="p-6">
                                                    {/* Header */}
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-bold text-negro mb-2 line-clamp-1">{hospedaje.nombre}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-negro/60 mb-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="line-clamp-1">
                                                                {hospedaje.direccion}, {hospedaje.ciudad}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-negro/60">{hospedaje.pais}</p>
                                                    </div>

                                                    {/* Capacidad */}
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="flex items-center gap-1 bg-principal/20 px-3 py-1 rounded-lg">
                                                            <Users className="w-4 h-4 text-negro" />
                                                            <span className="text-sm font-medium text-negro">
                                                                {hospedaje.capacidad} {hospedaje.capacidad === 1 ? "persona" : "personas"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Descripción */}
                                                    <p className="text-sm text-negro/70 mb-4 line-clamp-2">{hospedaje.descripcion}</p>

                                                    {/* Acciones */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/hospedajes/editar/${hospedaje.id}`)}
                                                            className="flex-1 bg-negro hover:bg-[#2d2d2b] text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                        `${hospedaje.direccion}, ${hospedaje.ciudad}, ${hospedaje.pais}`,
                                                                    )}`,
                                                                    "_blank",
                                                                )
                                                            }
                                                            className="p-2 bg-principal/20 hover:bg-principal/30 text-negro rounded-lg transition-colors duration-200"
                                                            title="Ver en Google Maps"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Perfil