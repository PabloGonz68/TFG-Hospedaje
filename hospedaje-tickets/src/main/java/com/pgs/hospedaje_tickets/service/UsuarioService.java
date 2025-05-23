package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Ticket.TicketDTO;
import com.pgs.hospedaje_tickets.dto.User.*;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Ticket;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private ValidatorUser validatorUser;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private Mapper mapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private TicketService ticketService;


    //Login
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe."));

        List<GrantedAuthority> authorities = Arrays.stream(usuario.getRol().toString().split(","))
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.trim()))
                .collect(Collectors.toList());

        return User.builder()
                .username(usuario.getEmail()) // se usa como username
                .password(usuario.getPassword())
                .authorities(authorities)
                .build();
    }

    //Register
    public UsuarioRegisterDTO register(UsuarioRegisterDTO user) {
    validatorUser.validateUserRegister(user);

    String rol = "USUARIO";

        if ("pablo@gmail.com".equals(user.getEmail())) {
            rol = "ADMIN";  // Asignar "admin" a un correo especial
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(user.getNombre());
        usuario.setApellidos(user.getApellidos());
        usuario.setEmail(user.getEmail());
        usuario.setPassword(passwordEncoder.encode(user.getPassword()));
        usuario.setRol(Usuario.Rol.valueOf(rol));
        usuarioRepository.save(usuario);

        UsuarioDTO propietario = new UsuarioDTO();
        propietario.setId_usuario(usuario.getId_usuario());
        if (propietario.getId_usuario() == null || propietario.getId_usuario() <= 0) {
            throw new BadRequestException("El id de propietario es inválido.");
        }


        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTipoTicket(Ticket.TipoTicket.CIUDAD.toString());
        ticketDTO.setPropietario(propietario);
        ticketService.createTicketRegister(ticketDTO, usuario);

        return user;
    }

    public UsuarioDTO getUserById(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de usuario es inválido.");
        }
        Usuario usuario = usuarioRepository.findById(idLong)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        return mapper.toUsuarioDTO(usuario);
    }

    public Usuario getUserByEmail(String email) {
        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        if (user == null) {
            throw new ResourceNotFoundException("Usuario no encontrado.");
        }
        return user;
    }

    public List<UsuarioDTO> getAllUsers() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        if (usuarios.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron usuarios.");
        }
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
        return usuarios.stream().map(mapper::toUsuarioDTO).collect(Collectors.toList());
    }

    //Update
    public UsuarioDTO updateProfile(String id, UsuarioUpdateDTO user) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de usuario es inválido.");
        }

        validatorUser.validateUserUpdate(user);
        Usuario usuario = usuarioRepository.findById(idLong).orElseThrow(() ->
                new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setNombre(user.getNombre());
        usuario.setApellidos(user.getApellidos());
        usuario.setFotoPerfil(user.getFotoPerfil());

        usuarioRepository.save(usuario);
        return mapper.toUsuarioDTO(usuario);
    }

    //Change Password
    public void changePassword(String id, UsuarioPasswordUpdateDTO user) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de usuario es inválido.");
        }

        Usuario usuario = usuarioRepository.findById(idLong).orElseThrow(() ->
                new ResourceNotFoundException("Usuario no encontrado"));

        validatorUser.validateUserPassword(user);

        if (!passwordEncoder.matches(user.getCurrentPassword(), usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual es incorrecta.");
        }


       usuario.setPassword(passwordEncoder.encode(user.getNewPassword()));
       usuarioRepository.save(usuario);
    }


    public UsuarioDTO updateAdmin(String id, UsuarioAdminDTO user) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de usuario es inválido.");
        }
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        validatorUser.validateUserAdmin(user);

        Usuario existingUser = usuarioRepository.findById(idLong).orElse(null);
        if (existingUser == null) {
            throw new ResourceNotFoundException("El usuario no existe.");
        }

        existingUser.setNombre(user.getNombre());
        existingUser.setApellidos(user.getApellidos());
        existingUser.setEmail(user.getEmail());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        existingUser.setFotoPerfil(user.getFotoPerfil());
        existingUser.setRol(Usuario.Rol.valueOf(user.getRol()));
        usuarioRepository.save(existingUser);

        return mapper.toUsuarioDTO(existingUser);
    }

    public void delete(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de usuario es inválido.");
        }
        Usuario usuario = usuarioRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        usuarioRepository.deleteById(idLong);
    }





}
