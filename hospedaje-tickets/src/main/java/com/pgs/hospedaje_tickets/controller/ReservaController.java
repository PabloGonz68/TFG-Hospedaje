package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaIndividualDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/individual")
    public ResponseEntity<?> createReserva(@RequestBody CrearReservaIndividualDTO dto) {
        ReservaDTO reservaDTO = reservaService.createReservaIndividual(dto);
        return new ResponseEntity<>(reservaDTO, HttpStatus.CREATED);
    }

    @PostMapping("/con-grupo")
    public ResponseEntity<?> createReserva(@RequestBody CrearReservaConGrupoDTO dto) {
        ReservaDTO reservaDTO = reservaService.createReservaConGrupo(dto);
        return new ResponseEntity<>(reservaDTO, HttpStatus.CREATED);
    }
}
