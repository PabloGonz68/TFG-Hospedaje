package com.pgs.hospedaje_tickets.dto.Reserva;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReservaUsuarioDTO {
    private Long id_usuario;
    private String nombre_usuario;
    private String rol;
}
