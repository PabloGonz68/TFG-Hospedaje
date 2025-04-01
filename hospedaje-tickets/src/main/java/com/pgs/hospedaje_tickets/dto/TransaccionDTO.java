package com.pgs.hospedaje_tickets.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TransaccionDTO {
    private String tipoTransaccion; // "RESERVA", "COMPRA", "RECOMPENSA", "CONVERSION"
    private Long usuarioId;
    private LocalDateTime fecha;
}
