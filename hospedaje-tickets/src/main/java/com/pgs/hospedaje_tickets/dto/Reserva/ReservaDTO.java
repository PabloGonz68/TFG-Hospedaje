package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReservaDTO {
    private Long id_hospedaje;
    private LocalDateTime fecha_inicio;
    private LocalDateTime fecha_fin;
    private String estado;

}
