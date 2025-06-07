import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionTicketType() {
    return (
        <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className="flex   justify-between items-center"><div className="flex items-center justify-center gap-2"><span className="text-2xl">🏙️</span>Tickets de Ciudad</div></AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Los tickets de ciudad permiten reservar hospedajes ubicados en ciudades. Son el tipo de ticket más demandado debido a la alta concentración de usuarios y la disponibilidad de servicios urbanos.
                    </p>
                    <p>
                        Para obtener un ticket de ciudad, los usuarios deben hospedar a otros en su hogar o realizar ciertas acciones que otorgan recompensas. Además, 2 tickets de pueblo pueden convertirse en 1 ticket de ciudad si es necesario.
                    </p>
                    <p>
                        Al hacer una reserva en una ciudad, cada persona del grupo debe aportar 1 ticket de ciudad. Los tickets se descuentan al momento de confirmar la reserva.
                    </p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger className="flex  justify-between items-center"><div className="flex items-center justify-center gap-2 no-underline"> <span className="text-2xl">🏘️</span>Tickets de Pueblo</div></AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                        Los tickets de pueblo permiten reservar hospedajes en zonas rurales o pueblos. Estos tickets fomentan el turismo en áreas menos visitadas y ayudan a descentralizar la demanda.
                    </p>
                    <p>
                        Hospedar en pueblos otorga una mayor recompensa de tickets en comparación con las ciudades. Además, hospedarse en varios pueblos diferentes puede desbloquear logros y premios adicionales.
                    </p>
                    <p>
                        1 ticket de ciudad puede convertirse en 2 tickets de pueblo. Cada persona en una reserva en un pueblo debe aportar 1 ticket de pueblo, y en ocasiones especiales (promociones o pueblos remotos) puede costar menos.
                    </p>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}
