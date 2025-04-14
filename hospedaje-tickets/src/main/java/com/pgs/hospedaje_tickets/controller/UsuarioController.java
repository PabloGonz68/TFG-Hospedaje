package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.User.*;
import com.pgs.hospedaje_tickets.service.TokenService;
import com.pgs.hospedaje_tickets.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    TokenService tokenService;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioLoginDTO user){
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
            String token = tokenService.generateToken(authentication);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas.");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register (@RequestBody UsuarioRegisterDTO user){
    usuarioService.register(user);
    return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        UsuarioDTO user = usuarioService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/admin/getAll")
    public ResponseEntity<?> getAllUsers() {
        return new ResponseEntity<>(usuarioService.getAllUsers(), HttpStatus.OK);
    }

    //Update para Cliente
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody UsuarioUpdateDTO user) {
        UsuarioDTO updatedUser = usuarioService.updateProfile(id, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    //Update para Admin
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody UsuarioAdminDTO user) {
        UsuarioDTO updatedUser = usuarioService.updateAdmin(id, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody UsuarioPasswordUpdateDTO user) {
        usuarioService.changePassword(id, user);
        return new ResponseEntity<>("Contraseña actualizada correctamente", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        usuarioService.delete(id);
        return new ResponseEntity<>("Usuario eliminado correctamente", HttpStatus.OK);
    }



}
