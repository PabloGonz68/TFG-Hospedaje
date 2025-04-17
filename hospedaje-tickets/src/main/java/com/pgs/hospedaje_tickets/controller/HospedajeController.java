package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.service.HospedajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hospedaje")
public class HospedajeController {

    @Autowired
    private HospedajeService hospedajeService;

    @PostMapping("/create")
    public ResponseEntity<?> createHospedaje(@RequestBody HospedajeDTO dto) {
        return new ResponseEntity<>(hospedajeService.createHospedaje(dto), HttpStatus.CREATED);

    }

    @GetMapping("/")
    public ResponseEntity<?> getAllHospedajes() {
        return new ResponseEntity<>(hospedajeService.getAllHospedajes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHospedaje(@PathVariable String id) {
        return new ResponseEntity<>(hospedajeService.getHospedaje(id), HttpStatus.OK);
    }

    @GetMapping("/anfitrion/{email}")
    public ResponseEntity<?> getHospedajesByAnfitrion(@PathVariable String email) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByAnfitrion(email), HttpStatus.OK);
    }

    @GetMapping("/ciudad/{ciudad}")
    public ResponseEntity<?> getHospedajesByCiudad(@PathVariable String ciudad) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByCiudad(ciudad), HttpStatus.OK);
    }

    @GetMapping("/pais/{pais}")
    public ResponseEntity<?> getHospedajesByPais(@PathVariable String pais) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByPais(pais), HttpStatus.OK);
    }

    @GetMapping("/tipoZona/{tipoZona}")
    public ResponseEntity<?> getHospedajesByTipoZona(@PathVariable String tipoZona) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByTipoZona(tipoZona), HttpStatus.OK);
    }

    @GetMapping("/capacidad/{capacidad}")
    public ResponseEntity<?> getHospedajesByCapacidad(@PathVariable int capacidad) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByCapacidad(capacidad), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHospedaje(@PathVariable String id, @RequestBody HospedajeDTO dto) {
        return new ResponseEntity<>(hospedajeService.updateHospedaje(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHospedaje(@PathVariable String id) {
        hospedajeService.deleteHospedaje(id);
        return new ResponseEntity<>("Hospedaje eliminado correctamente", HttpStatus.OK);
    }
}
