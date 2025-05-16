package com.pgs.hospedaje_tickets.utils;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.GrupoViajeDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.MiembroGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaUsuarioDTO;
import com.pgs.hospedaje_tickets.dto.Ticket.TicketDTO;
import com.pgs.hospedaje_tickets.dto.User.UsuarioDTO;
import com.pgs.hospedaje_tickets.dto.User.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.model.*;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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

    public Hospedaje toHospedaje(HospedajeDTO hospedajeDTO){
        Hospedaje hospedaje = new Hospedaje();
        hospedaje.setNombre(hospedajeDTO.getNombre());
        hospedaje.setDireccion(hospedajeDTO.getDireccion());
        hospedaje.setCodigoPostal(hospedajeDTO.getCodigoPostal());
        hospedaje.setCiudad(hospedajeDTO.getCiudad());
        hospedaje.setPais(hospedajeDTO.getPais());
        hospedaje.setTipoZona(Hospedaje.TipoZona.valueOf(hospedajeDTO.getTipoZona()));
        hospedaje.setCapacidad(hospedajeDTO.getCapacidad());
        hospedaje.setDescripcion(hospedajeDTO.getDescripcion());
        hospedaje.setUbicacion(hospedajeDTO.getUbicacion());
        hospedaje.setVisible(hospedajeDTO.isVisible());
        return hospedaje;
    }

    public TicketDTO toTicketDTO(Ticket ticket){
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setTipoTicket(ticket.getTipoTicket().toString());
        ticketDTO.setPropietario(ticket.getPropietario());
        return ticketDTO;
    }

    public Ticket toTicket(TicketDTO ticketDTO){
        Ticket ticket = new Ticket();
        ticket.setTipoTicket(Ticket.TipoTicket.valueOf(ticketDTO.getTipoTicket()));
        return ticket;
    }
    public MiembroGrupoDTO toMiembroGrupoDTO(MiembroGrupo miembroGrupo) {
        MiembroGrupoDTO miembroGrupoDTO = new MiembroGrupoDTO();
        miembroGrupoDTO.setId(miembroGrupo.getId());
        miembroGrupoDTO.setIdUsuario(miembroGrupo.getUsuario().getId_usuario());
        miembroGrupoDTO.setTicketsAportados(miembroGrupo.getTicketsAportados());
        return miembroGrupoDTO;
    }

    public GrupoViajeDTO toGrupoViajeDTO(GrupoViaje grupoViaje) {
        GrupoViajeDTO grupoViajeDTO = new GrupoViajeDTO();
        grupoViajeDTO.setId(grupoViaje.getId());
        grupoViajeDTO.setIdCreador(grupoViaje.getCreador().getId_usuario());
        grupoViajeDTO.setMiembros(grupoViaje.getMiembros().stream()
                .map(this::toMiembroGrupoDTO)
                .collect(Collectors.toList()));
        grupoViajeDTO.setFechaCreacion(grupoViaje.getFechaCreacion());
        return grupoViajeDTO;
    }

    public ReservaDTO toReservaDTO(Reserva reserva) {
        ReservaDTO reservaDTO = new ReservaDTO();
        reservaDTO.setId_hospedaje(reserva.getHospedaje().getId_hospedaje());
        reservaDTO.setFecha_inicio(reserva.getFecha_inicio());
        reservaDTO.setFecha_fin(reserva.getFecha_fin());
        reservaDTO.setEstado(reserva.getEstado_reserva().toString());
        reservaDTO.setCosteTotalTickets(reserva.getCosteTotalTickets());
        reservaDTO.setNumPersonas(reserva.getNumPersonas());

        List<ReservaUsuarioDTO> usuariosDTO = reserva.getReservasUsuarios().stream().map(ru -> {
            ReservaUsuarioDTO ruDto = new ReservaUsuarioDTO();
            ruDto.setId_usuario(ru.getUsuario().getId_usuario());
            ruDto.setNombre_usuario(ru.getUsuario().getNombre());
            ruDto.setRol(ru.getRol().name());
            return ruDto;
        }).toList();

        reservaDTO.setReservasUsuarios(usuariosDTO);
        return reservaDTO;
    }









}
