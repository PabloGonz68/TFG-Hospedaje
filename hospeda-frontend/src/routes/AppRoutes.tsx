import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/content/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;