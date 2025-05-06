package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReservaDTO {
    private Long id_hospedaje;
    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;
    private String estado;

}
