import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { EstadoCombo } from "@/components/combobox/estadoCombo"
import { toast } from 'sonner';


export function EstadoModal({ reservaID }: { reservaID: number }) {

    const handleGuardarCambios = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/reservas/estado/${reservaID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: estadoSeleccionado })
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el estado");
            }
            toast.success("Estado actualizado exitosamente");
            window.location.reload();

        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el estado");
        }
        setOpen(false);
    }

    const [estadoSeleccionado, setEstadoSeleccionado] = useState("PENDIENTE");
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-negro  text-white hover:text-negro hover:bg-principal-hover hover:border-2 hover:border-negro flex items-center gap-2 w-full" variant="outline">Cambiar Estado</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Estado</DialogTitle>
                    <DialogDescription>
                        Cambie el estado de la reserva aquí. Haga clic en guardar cuando termine.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estado" className="text-right">
                            Estado
                        </Label>


                        <EstadoCombo onChange={(value: string) => setEstadoSeleccionado(value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleGuardarCambios}>Guardar cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
