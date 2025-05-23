import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/content/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import Perfil from "@/pages/content/Perfil";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<MainLayout><Perfil /></MainLayout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;