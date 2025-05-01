package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GrupoViajeDTO {

    private Long id;
    private Long idCreador;
    private LocalDateTime fechaCreacion;
    private List<MiembroGrupoDTO> miembros;

}
