package com.pgs.hospedaje_tickets.dto.Hospedaje;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HospedajeResponseDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String ciudad;
    private String pais;
    private int capacidad;
    private String tipoZona;
    private String descripcion;
    private boolean visible;
    private String ubicacion;

}
