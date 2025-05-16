package com.pgs.hospedaje_tickets.dto.Reserva;

import com.pgs.hospedaje_tickets.model.Reserva;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaEstadoDTO {
    private Reserva.EstadoReserva estado;
}
