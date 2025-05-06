package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearGrupoViajeDTO;
import com.pgs.hospedaje_tickets.service.GrupoViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/grupoViaje")
public class GrupoViajeController {

    @Autowired
    private GrupoViajeService grupoViajeService;

    @PostMapping("/create")
    public ResponseEntity<?> createGrupoViaje(@RequestBody CrearGrupoViajeDTO dto) {
        return new ResponseEntity<>(grupoViajeService.crearGrupoViaje(dto), HttpStatus.CREATED);

    }
}
