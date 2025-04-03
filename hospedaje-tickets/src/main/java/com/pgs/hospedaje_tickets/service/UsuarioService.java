package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.UsuarioDTO;
import com.pgs.hospedaje_tickets.dto.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private Validator validator;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private Mapper mapper;


    public UsuarioRegisterDTO register(UsuarioRegisterDTO user) {
    validator.validateUserRegister(user);

    String rol = "USUARIO";

        if ("admin@dominio.com".equals(user.getEmail())) {
            rol = "admin";  // Asignar "admin" a un correo especial
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(user.getNombre());
        usuario.setApellidos(user.getApellidos());
        usuario.setEmail(user.getEmail());
        usuario.setPassword(user.getPassword());
        usuario.setRol(Usuario.Rol.valueOf(rol));
        usuarioRepository.save(usuario);
        return user;
    }

    public UsuarioDTO update(String id, UsuarioDTO user) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new RuntimeException("El id de usuario es inválido.");
        }

        validator.validateUser(user);

        Usuario existingUser = usuarioRepository.findById(idLong).orElse(null);
        if (existingUser == null) {
            throw new RuntimeException("El usuario no existe.");
        }

        existingUser.setNombre(user.getNombre());
        existingUser.setApellidos(user.getApellidos());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setFotoPerfil(user.getFotoPerfil());
        existingUser.setRol(Usuario.Rol.valueOf(user.getRol()));
        usuarioRepository.save(existingUser);

        return mapper.toUsuarioDTO(existingUser);
    }





}
