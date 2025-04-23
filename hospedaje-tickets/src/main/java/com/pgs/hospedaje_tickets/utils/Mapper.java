package com.pgs.hospedaje_tickets.utils;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.dto.User.UsuarioDTO;
import com.pgs.hospedaje_tickets.dto.User.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.model.Hospedaje;
import com.pgs.hospedaje_tickets.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    public UsuarioDTO toUsuarioDTO(Usuario usuario) {
        UsuarioDTO usuarioDTO = new UsuarioDTO();
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setApellidos(usuario.getApellidos());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setFotoPerfil(usuario.getFotoPerfil());
        usuarioDTO.setFechaRegistro(usuario.getFechaRegistro());
        usuarioDTO.setRol(usuario.getRol().toString());
        return usuarioDTO;
    }

    public Usuario toUsuario(UsuarioRegisterDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellidos(usuarioDTO.getApellidos());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setPassword(usuarioDTO.getPassword());
        usuario.setFotoPerfil(null);
        usuario.setRol(Usuario.Rol.USUARIO);
        return usuario;
    }

    public HospedajeDTO toHospedajeDTO(Hospedaje hospedaje){
        HospedajeDTO hospedajeDTO = new HospedajeDTO();
        hospedajeDTO.setNombre(hospedaje.getNombre());
        hospedajeDTO.setDireccion(hospedaje.getDireccion());
        hospedajeDTO.setCodigoPostal(hospedaje.getCodigoPostal());
        hospedajeDTO.setCiudad(hospedaje.getCiudad());
        hospedajeDTO.setPais(hospedaje.getPais());
        hospedajeDTO.setTipoZona(hospedaje.getTipoZona().toString());
        hospedajeDTO.setCapacidad(hospedaje.getCapacidad());
        hospedajeDTO.setDescripcion(hospedaje.getDescripcion());
        hospedajeDTO.setUbicacion(hospedaje.getUbicacion());
        hospedajeDTO.setVisible(hospedaje.isVisible());
        return hospedajeDTO;
    }







}
