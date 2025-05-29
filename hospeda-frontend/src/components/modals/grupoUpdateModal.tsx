import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';
import { useState } from "react";


type MiembroDTO = {
    id: number;
    idUsuario: number;
    ticketsAportados: number;
}

type GrupoViajeDTO = {
    id: number;
    nombre: string;
    idCreador: number;
    fechaCreacion: string;
    miembros: MiembroDTO[];
}

type GrupoUpdateModalProps = {
    grupo: GrupoViajeDTO;
    onUpdated?: () => void;
}


export function GrupoUpdateModal({ grupo, onUpdated }: GrupoUpdateModalProps) {
    const [miembros, setMiembros] = useState<MiembroDTO[]>(grupo.miembros);
    const [nombreGrupo, setNombreGrupo] = useState(grupo.nombre);

    const [open, setOpen] = useState(false);

    const handleGuardar = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        if (!nombreGrupo.trim()) {
            toast.error("El nombre del grupo no puede estar vacío.");
            return;
        }


        const dto = {
            nombre: nombreGrupo,
            cantidadTicketsCreador: miembros.find(m => m.idUsuario === grupo.idCreador)?.ticketsAportados ?? 0,
            miembros: miembros.map(m => ({
                idUsuario: m.idUsuario,
                ticketsAportados: m.ticketsAportados
            }))
        };

        try {
            const res = await fetch(`http://localhost:8080/grupo-viaje/${grupo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dto),
            });

            if (!res.ok) throw new Error("Error al actualizar grupo");

            toast.success("Grupo actualizado");
            if (onUpdated) onUpdated();

        } catch (error: any) {
            toast.error("Error: " + error.message);
        }

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Editar grupo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar grupo</DialogTitle>
                    <DialogDescription>Modifica los tickets de los miembros.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="nombre">Nombre</Label>
                    <Input
                        id="nombre"
                        value={nombreGrupo}
                        onChange={(e) => setNombreGrupo(e.target.value)}
                        className="col-span-3"
                    />
                </div>

                <div className="grid gap-4 py-4">
                    {miembros.map((miembro, index) => (
                        <div key={miembro.id} className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Usuario {miembro.idUsuario}</Label>
                            <Input
                                type="number"
                                value={miembro.ticketsAportados}
                                onChange={(e) => {
                                    const nuevos = [...miembros];
                                    nuevos[index].ticketsAportados = parseInt(e.target.value);
                                    setMiembros(nuevos);
                                }}
                                className="col-span-3"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleGuardar}>Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

