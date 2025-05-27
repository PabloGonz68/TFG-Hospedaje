// src/components/hospedaje/ReservaModal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface ReservaModalProps {
    hospedajeId: string;
}

const ReservaModal: React.FC<ReservaModalProps> = ({ hospedajeId }) => {
    const navigate = useNavigate();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Reservar
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tipo de reserva</DialogTitle>
                    <DialogDescription>
                        Selecciona si deseas hacer una reserva individual o en grupo.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => navigate(`/reserva/individual/${hospedajeId}`)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        Individual
                    </button>
                    <button
                        onClick={() => navigate(`/reserva/grupo/${hospedajeId}`)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                    >
                        En grupo
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReservaModal;
