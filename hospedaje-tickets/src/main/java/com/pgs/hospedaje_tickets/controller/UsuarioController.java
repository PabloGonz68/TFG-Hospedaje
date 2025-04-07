package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.UsuarioLoginDTO;
import com.pgs.hospedaje_tickets.dto.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.service.TokenService;
import com.pgs.hospedaje_tickets.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public String login(@RequestBody UsuarioLoginDTO user){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        return tokenService.generateToken(authentication);

    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioRegisterDTO> register (@RequestBody UsuarioRegisterDTO user){
    usuarioService.register(user);
    return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

}
