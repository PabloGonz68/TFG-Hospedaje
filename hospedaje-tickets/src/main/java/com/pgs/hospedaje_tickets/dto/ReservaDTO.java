package com.pgs.hospedaje_tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReservaDTO {
    private Long hospedajeId;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String estadoReserva; // "PENDIENTE", "CONFIRMADA", etc.
}
