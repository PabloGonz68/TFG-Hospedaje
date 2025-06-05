// components/dialogs/TicketDialog.tsx

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
import { TicketIcon } from "lucide-react"
import { useState } from "react"

interface TicketDialogProps {
    ticketsCiudad: number
    ticketsPueblo: number
}

export function TicketModal({ ticketsCiudad, ticketsPueblo }: TicketDialogProps) {
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-negro text-white hover:bg-principal-hover flex items-center gap-2">
                    <TicketIcon className="h-4 w-4" />
                    Mis tickets
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-principal">Mis tickets</DialogTitle>
                    <DialogDescription>
                        Aquí puedes ver los tickets que tienes disponibles actualmente.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-center text-lg">
                    <div className="bg-blue-100 p-4 rounded-xl shadow">
                        🎫 <strong>Tickets Ciudad:</strong> {ticketsCiudad}
                    </div>
                    <div className="bg-green-100 p-4 rounded-xl shadow">
                        🏡 <strong>Tickets Pueblo:</strong> {ticketsPueblo}
                    </div>
                </div>
                <DialogFooter>
                    <Button className="bg-principal hover:bg-principal-hover " onClick={handleClose} variant="outline">Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
