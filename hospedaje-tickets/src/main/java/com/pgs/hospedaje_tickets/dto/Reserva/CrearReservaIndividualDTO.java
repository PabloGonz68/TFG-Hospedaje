package com.pgs.hospedaje_tickets.dto.Reserva;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CrearReservaIndividualDTO {
    private Long idHospedaje;
    private Long idOrganizador;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String estado = "PENDIENTE";

}
