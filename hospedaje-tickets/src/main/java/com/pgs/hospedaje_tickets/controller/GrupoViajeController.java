package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearGrupoViajeDTO;
import com.pgs.hospedaje_tickets.service.GrupoViajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/grupo-viaje")
public class GrupoViajeController {

    @Autowired
    private GrupoViajeService grupoViajeService;

    @PostMapping("/create")
    public ResponseEntity<?> createGrupoViaje(@RequestBody CrearGrupoViajeDTO dto) {
        return new ResponseEntity<>(grupoViajeService.crearGrupoViaje(dto), HttpStatus.CREATED);

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGrupoViaje(@PathVariable String id) {
        return new ResponseEntity<>(grupoViajeService.getGrupoViaje(id), HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getGruposViaje() {
        return new ResponseEntity<>(grupoViajeService.getGruposViaje(), HttpStatus.OK);
    }

    @GetMapping("/miembro/{email}")
    public ResponseEntity<?> getGruposViajeByMiembro(@PathVariable String email) {
        return new ResponseEntity<>(grupoViajeService.getGruposViajeByMiembro(email), HttpStatus.OK);
    }

    @GetMapping("/mis-grupos")
    public ResponseEntity<?> getMisGruposViaje() {
        return new ResponseEntity<>(grupoViajeService.getMisGruposViaje(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGrupoViaje(@PathVariable String id, @RequestBody CrearGrupoViajeDTO dto) {
        return new ResponseEntity<>(grupoViajeService.updateGrupoViaje(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGrupoViaje(@PathVariable String id) {
        grupoViajeService.deleteGrupoViaje(id);
        return new ResponseEntity<>("Grupo viaje eliminado correctamente", HttpStatus.OK);
    }


}
