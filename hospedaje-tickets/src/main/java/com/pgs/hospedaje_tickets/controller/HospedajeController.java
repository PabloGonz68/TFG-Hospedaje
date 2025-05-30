package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.service.HospedajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospedaje")
public class HospedajeController {

    @Autowired
    private HospedajeService hospedajeService;

    @PostMapping("/create")
    public ResponseEntity<?> createHospedaje(@RequestBody HospedajeDTO dto, Authentication auth) {
        return new ResponseEntity<>(hospedajeService.createHospedaje(dto, auth), HttpStatus.CREATED);

    }

    @GetMapping("/")
    public ResponseEntity<?> getAllHospedajes() {
        return new ResponseEntity<>(hospedajeService.getAllHospedajes(), HttpStatus.OK);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllAdminHospedajes() {
        return new ResponseEntity<>(hospedajeService.getAllAdminHospedajes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHospedaje(@PathVariable String id) {
        return new ResponseEntity<>(hospedajeService.getHospedaje(id), HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getHospedajesByOtroAnfitrion(@PathVariable String email) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByOtroAnfitrion(email), HttpStatus.OK);
    }

    @GetMapping("/anfitrion/{email}")
    public ResponseEntity<?> getHospedajesByAnfitrion(@PathVariable String email) {
        return new ResponseEntity<>(hospedajeService.getHospedajesByAnfitrion(email), HttpStatus.OK);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<HospedajeDTO>> filtrarHospedajes(
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) String pais,
            @RequestParam(required = false) String tipoZona,
            @RequestParam(required = false) Integer capacidad
    ) {
        List<HospedajeDTO> resultados = hospedajeService.filtrarHospedajes(ciudad, pais, tipoZona, capacidad);
        return ResponseEntity.ok(resultados);
    }


/*    @GetMapping("/ciudad/{ciudad}")
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
    }*/

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
