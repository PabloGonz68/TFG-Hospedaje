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

interface TicketDialogProps {
    ticketsCiudad: number
    ticketsPueblo: number
}

export function TicketModal({ ticketsCiudad, ticketsPueblo }: TicketDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-400 text-white hover:bg-blue-500 flex items-center gap-2">
                    <TicketIcon className="h-4 w-4" />
                    Mis tickets
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mis tickets</DialogTitle>
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
                    <Button variant="outline">Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
