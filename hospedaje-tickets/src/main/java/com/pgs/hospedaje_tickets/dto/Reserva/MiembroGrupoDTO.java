package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.Data;

@Data
public class MiembroGrupoDTO {
    private Long id;
    private Long idUsuario;
    private int ticketsAportados;
}
