package com.pgs.hospedaje_tickets.dto.Hospedaje;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HospedajeDTO {
    private Long id;
    private Long id_anfitrion;
    private String nombreAnfitrion;
    private String nombre;
    private String direccion;
    private String codigoPostal;
    private String ciudad;
    private String pais;
    private int capacidad;
    private String tipoZona;
    private String descripcion;
    private String ubicacion;
    private boolean visible;
    private String foto;

}
