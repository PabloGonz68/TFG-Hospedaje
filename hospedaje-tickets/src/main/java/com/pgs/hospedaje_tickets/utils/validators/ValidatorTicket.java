package com.pgs.hospedaje_tickets.utils.validators;

import com.pgs.hospedaje_tickets.dto.Ticket.TicketDTO;
import com.pgs.hospedaje_tickets.error.exceptions.ValidationException;
import org.springframework.stereotype.Component;

@Component
public class ValidatorTicket {

    public void validateTicket(TicketDTO ticketDTO) {
        if (ticketDTO.getTipoTicket() == null || ticketDTO.getTipoTicket().isEmpty()) {
            throw new ValidationException("El tipo de ticket es obligatorio");
        }
        if (ticketDTO.getPropietario() == null || ticketDTO.getPropietario().getId_usuario() <= 0) {
            throw new ValidationException("El propietario es obligatorio");
        }
    }
}
