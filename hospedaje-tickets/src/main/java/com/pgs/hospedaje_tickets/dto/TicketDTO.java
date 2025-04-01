package com.pgs.hospedaje_tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TicketDTO {
    private String tipoTicket; // "PUEBLO" o "CIUDAD"
    private Long propietarioId;
}
