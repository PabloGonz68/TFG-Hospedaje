// components/sheet/SheetTicketsUsuario.tsx
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { TicketIcon } from "lucide-react"

interface Ticket {
    id_ticket: number;
    tipo: "CIUDAD" | "PUEBLO";
    fecha_generacion: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    idUsuario: string;
}

export const SheetTicketsUsuario = ({ open, onClose, idUsuario }: Props) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    console.log("idUsuario:", idUsuario);

    const fetchTickets = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8080/ticket/user/${idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 404) {
                setTickets([]);
                toast.warning("No hay tickets disponibles");
                return;
            }

            const data = await res.json();
            const ticketsAdaptados = data.map((t: any) => ({
                id_ticket: t.id,
                tipo: t.tipoTicket,
                fecha_generacion: t.fechaGeneracion
            }));
            setTickets(ticketsAdaptados);
            toast.success("Tickets cargados");
            console.log("Tickets cargados:", ticketsAdaptados);
        } catch (e) {
            toast.error("Error al cargar los tickets");
        }
    }


    const eliminarTicket = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8080/ticket/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.ok) {
                toast.success("Ticket eliminado");
                setTickets(prev => prev.filter(t => t.id_ticket !== id));
            }
        } catch (e) {
            toast.error("Error al eliminar ticket");
        }
    }

    const crearTicket = async (tipo: "CIUDAD" | "PUEBLO") => {
        try {
            const res = await fetch(`http://localhost:8080/ticket/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    tipoTicket: tipo,
                    propietario: {
                        id_usuario: Number(idUsuario)
                    }
                })
            });
            if (res.ok) {
                const nuevo = await res.json();
                toast.success("Ticket creado");
                setTickets(prev => [...prev, {
                    id_ticket: nuevo.id,
                    tipo: nuevo.tipoTicket,
                    fecha_generacion: nuevo.fechaGeneracion
                }]);
            } else {
                toast.error("Error al crear ticket");
            }
        } catch (e) {
            toast.error("Error al crear ticket");
        }
    }


    useEffect(() => {
        if (open) fetchTickets();
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <div className="flex items-center gap-2">


                        <div className="flex p-2 items-center bg-principal rounded-xl">
                            <TicketIcon className="w-6 h-6 text-negro" />
                        </div>
                        <SheetTitle>Tickets del usuario</SheetTitle>
                    </div>
                </SheetHeader>
                <div className="my-4 flex justify-center gap-2">
                    <Button className="bg-principal hover:bg-principal-hover text-negro hover:text-blanco" onClick={() => crearTicket("CIUDAD")}>Añadir ticket CIUDAD</Button>
                    <Button className="bg-secundario hover:bg-secundario-hover text-negro hover:text-blanco" onClick={() => crearTicket("PUEBLO")}>Añadir ticket PUEBLO</Button>
                </div>
                <Table className="p-10">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-blanco">
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No hay tickets disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map(ticket => (
                                <TableRow key={ticket.id_ticket}>
                                    <TableCell>{ticket.id_ticket}</TableCell>
                                    <TableCell>{ticket.tipo}</TableCell>
                                    <TableCell>{ticket.fecha_generacion?.split("T")[0] || "-"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            onClick={() => eliminarTicket(ticket.id_ticket)}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>

                </Table>
            </SheetContent>
        </Sheet>
    );
}
