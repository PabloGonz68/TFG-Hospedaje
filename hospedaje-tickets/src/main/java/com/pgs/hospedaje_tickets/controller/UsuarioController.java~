package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.*;
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

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUsers() {
        return new ResponseEntity<>(usuarioService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UsuarioUpdateDTO user) {
        UsuarioDTO updatedUser = usuarioService.updateProfile(id.toString(), user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody UsuarioPasswordUpdateDTO user) {
        usuarioService.changePassword(id.toString(), user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

   /* @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UsuarioDTO user) {
        UsuarioDTO updatedUser = usuarioService.update(id.toString(), user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }*/

}
