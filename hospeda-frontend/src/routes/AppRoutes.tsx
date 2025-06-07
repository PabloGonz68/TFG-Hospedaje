import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/content/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import TopLayout from "@/layouts/TopLayout";
import Perfil from "@/pages/content/Perfil";
import Hospedajes from "@/pages/content/Hospedajes/Hospedajes";
import CrearHospedaje from "@/pages/content/Hospedajes/CrearHospedaje";
import VerHospedaje from "@/pages/content/Hospedajes/VerHospedaje";
import ReservaIndividualForm from "@/pages/content/Reserva/ReservaIndividualForm";
import VerReservas from "@/pages/content/Reserva/VerReservas";
import CrearGrupoViaje from "@/pages/content/GrupoReserva/CrearGrupoViaje";
import VerGruposViaje from "@/pages/content/GrupoReserva/VerGruposViaje";
import ReservaGrupalForm from "@/pages/content/Reserva/ReservaGrupalForm";
import EditHospedaje from "@/pages/content/Hospedajes/EditHospedaje";
import PerfilUser from "@/pages/content/User/PerfilUser";
import PanelControl from "@/pages/content/Admin/PanelControl";
import RutaProtegidaAdmin from "@/components/shared/rutaProtegidaAdmin";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                <Route path="/perfil" element={<TopLayout><Perfil /></TopLayout>} />
                <Route path="/perfil/:IdAnfitrion" element={<TopLayout><PerfilUser /></TopLayout>} />

                <Route path="/hospedajes" element={<TopLayout><Hospedajes /></TopLayout>}></Route>
                <Route path="/hospedajes/crear" element={<TopLayout><CrearHospedaje /></TopLayout>}></Route>
                <Route path="/hospedajes/editar/:id" element={<TopLayout><EditHospedaje /></TopLayout>}></Route>
                <Route path="/hospedaje/:id" element={<TopLayout><VerHospedaje /></TopLayout>} />

                <Route path="/reserva/individual/:id" element={<TopLayout><ReservaIndividualForm /></TopLayout>} />

                <Route path="/grupoViaje" element={<TopLayout><CrearGrupoViaje /></TopLayout>} />
                <Route path="/grupoViaje/:hospedajeId" element={<TopLayout>< CrearGrupoViaje /></TopLayout>} />
                <Route path="/grupoViaje/mis-grupos" element={<TopLayout>< VerGruposViaje /></TopLayout>} />

                <Route path="/reserva/grupal/:hospedajeId" element={<TopLayout><ReservaGrupalForm /></TopLayout>} />
                <Route path="/reserva/mis-reservas" element={<TopLayout><VerReservas /></TopLayout>} />

                <Route path="/admin" element={<TopLayout><RutaProtegidaAdmin><PanelControl /></RutaProtegidaAdmin></TopLayout>} />



                <Route path="*" element={<h1>404</h1>} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;