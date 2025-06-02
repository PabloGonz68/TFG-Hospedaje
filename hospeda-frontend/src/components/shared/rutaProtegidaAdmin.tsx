import { useAuth } from "@/context/AuthContext"
import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RutaProtegidaAdmin = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (!auth?.isAuthenticated || auth.user?.rol !== "ADMIN") {
            const interval = setInterval(() => {
                setCounter((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                navigate("/");
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [auth, navigate]);



    if (auth?.loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold">Cargando...</p>
            </div>
        );
    }

    if (!auth?.isAuthenticated || auth.user?.rol !== "ADMIN") {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                    No tienes permisos para acceder a esta pantalla
                </h1>
                <p className="text-lg text-gray-700">
                    Serás redirigido al inicio en <span className="font-semibold">{counter}</span> segundos...
                </p>
            </motion.div>
        );
    }




    return children;
}

export default RutaProtegidaAdmin