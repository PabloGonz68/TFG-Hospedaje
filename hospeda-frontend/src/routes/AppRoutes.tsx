import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/content/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;