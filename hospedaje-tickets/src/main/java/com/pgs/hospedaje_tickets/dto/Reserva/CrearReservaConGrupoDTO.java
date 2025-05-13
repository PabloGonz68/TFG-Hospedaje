package com.pgs.hospedaje_tickets.dto.Reserva;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CrearReservaConGrupoDTO {
    private Long idGrupo;
    private Long idHospedaje;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String estado = "PENDIENTE";
}
