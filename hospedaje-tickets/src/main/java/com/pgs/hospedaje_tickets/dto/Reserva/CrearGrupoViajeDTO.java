package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.Data;

import java.util.List;

@Data
public class CrearGrupoViajeDTO {

    public Long idCreador;
    public List<MiembroGrupoDTO> miembros;

    @Data
    public static class MiembroGrupoDTO {
        public Long idUsuario;
        public int ticketsAportados;
    }
}
