package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CrearReservaConGrupo {
    private Long idGrupo;
    private Long idHospedaje;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
