package com.pgs.hospedaje_tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ConversionDTO {
    private String tipoTicketEntrada; // "PUEBLO" o "CIUDAD"
    private String tipoTicketSalida;  // "PUEBLO" o "CIUDAD"
    private int cantidadEntrada;
    private int cantidadSalida;
}
