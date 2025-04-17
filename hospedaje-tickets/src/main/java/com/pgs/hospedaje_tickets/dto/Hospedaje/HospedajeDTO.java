package com.pgs.hospedaje_tickets.dto.Hospedaje;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HospedajeDTO {
    private String nombre;
    private String direccion;
    private String codigoPostal;
    private String ciudad;
    private String pais;
    private int capacidad;
    private String tipoZona;
    private String descripcion;
    private String ubicacion;
    private Long anfitrionId;
    private boolean visible;

}
