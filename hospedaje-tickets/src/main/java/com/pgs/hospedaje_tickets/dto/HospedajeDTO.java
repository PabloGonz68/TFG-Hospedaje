package com.pgs.hospedaje_tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HospedajeDTO {
    private String nombre;
    private String descripcion;
    private String ubicacion;
    private Long anfitrionId;
}
