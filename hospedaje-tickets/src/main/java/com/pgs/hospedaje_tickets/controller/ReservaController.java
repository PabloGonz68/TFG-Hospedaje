package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaIndividualDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaEstadoDTO;
import com.pgs.hospedaje_tickets.model.Reserva;
import com.pgs.hospedaje_tickets.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> createReservaGrupo(@RequestBody CrearReservaConGrupoDTO dto) {
        ReservaDTO reservaDTO = reservaService.createReservaConGrupo(dto);
        return new ResponseEntity<>(reservaDTO, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<?> getReservasUsuario() {
        return new ResponseEntity<>(reservaService.getReservasDelUsuario(), HttpStatus.OK);
    }

    @GetMapping("/propietario")
    public ResponseEntity<?> getReservasPropietario() {
        return new ResponseEntity<>(reservaService.getReservasDelPropietario(), HttpStatus.OK);
    }

    @PutMapping("/estado/{id}")
    public ResponseEntity<?> actualizarEstadoReserva(@PathVariable String id, @RequestBody ReservaEstadoDTO nuevoEstado) {
        ReservaDTO reservaDTO = reservaService.actualizarEstadoReserva(id, nuevoEstado);
        return new ResponseEntity<>(reservaDTO, HttpStatus.OK);
    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable String id) {
        reservaService.cancelarReserva(id);
        return new ResponseEntity<>("Reserva cancelada", HttpStatus.OK);
    }

    //----------ADMIN----------
    @GetMapping("/admin")
    public ResponseEntity<?> getAllReservas() {
        return new ResponseEntity<>(reservaService.getAllReservas(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReserva(@PathVariable String id) {
        return new ResponseEntity<>(reservaService.getReservaById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReserva(@PathVariable String id) {
        reservaService.deleteReserva(id);
        return new ResponseEntity<>("Reserva eliminada correctamente", HttpStatus.OK);
    }


}
