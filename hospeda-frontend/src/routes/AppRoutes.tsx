import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/content/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import Perfil from "@/pages/content/Perfil";
import Hospedajes from "@/pages/content/Hospedajes/Hospedajes";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<MainLayout><Perfil /></MainLayout>} />
                <Route path="/hospedajes" element={<MainLayout><Hospedajes /></MainLayout>}></Route>
                <Route path="*" element={<h1>404</h1>} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;