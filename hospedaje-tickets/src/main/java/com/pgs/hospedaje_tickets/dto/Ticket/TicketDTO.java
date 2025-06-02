package com.pgs.hospedaje_tickets.dto.Ticket;

import com.pgs.hospedaje_tickets.dto.User.UsuarioDTO;
import com.pgs.hospedaje_tickets.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TicketDTO {
    private Long id;
    private String tipoTicket; // "PUEBLO" o "CIUDAD"
    private UsuarioDTO propietario;
    private LocalDateTime fechaGeneracion;
}
