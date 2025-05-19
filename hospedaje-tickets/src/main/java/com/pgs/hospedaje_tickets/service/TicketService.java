package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Ticket.TicketDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Ticket;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.TicketRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ValidatorTicket validatorTicket;

    @Autowired
    private Mapper mapper;



    public List<TicketDTO> getTicketsByPropietario(String idPropietario) {
        Long idPropietarioLong = StringToLong.StringToLong(idPropietario);
        if (idPropietarioLong == null || idPropietarioLong <= 0) {
            throw new BadRequestException("El id de propietario es inválido.");
        }
        Usuario propietario = usuarioRepository.findById(idPropietarioLong).orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado."));

        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if(!usuarioAutenticado.getId_usuario().equals(propietario.getId_usuario()) && !usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)){
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
        List<Ticket> tickets = ticketRepository.findByPropietario(propietario);
        if (tickets.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron tickets.");
        }
        return tickets.stream().map(mapper::toTicketDTO).collect(Collectors.toList());
    }

    public TicketDTO createTicketRegister(TicketDTO ticketDTO, Usuario usuario) {
        validatorTicket.validateTicket(ticketDTO);

        Usuario usuarioAutenticado = usuarioRepository.findByEmail(usuario.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        Ticket ticket = mapper.toTicket(ticketDTO);
        ticket.setPropietario(usuarioAutenticado);
        return mapper.toTicketDTO(ticketRepository.save(ticket));
    }

    //------    ADMIN   -------//

    public TicketDTO createTicket(TicketDTO ticketDTO) {
        validatorTicket.validateTicket(ticketDTO);

        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        Ticket ticket = mapper.toTicket(ticketDTO);
        if (ticketDTO.getPropietario() != null && ticketDTO.getPropietario().getId_usuario() != null) {
            Usuario propietario = usuarioRepository.findById(ticketDTO.getPropietario().getId_usuario())
                    .orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado."));
            ticket.setPropietario(propietario);
        }
        //ticket.setPropietario(usuarioAutenticado);
        return mapper.toTicketDTO(ticketRepository.save(ticket));
    }

    public TicketDTO getTicket(String id) {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de ticket es inválido.");
        }
        Ticket ticket = ticketRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado."));
        return mapper.toTicketDTO(ticket);
    }



    public List<TicketDTO> getAllTickets() {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
        List<Ticket> tickets = ticketRepository.findAll();
        if (tickets.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron tickets.");
        }

        return tickets.stream().map(mapper::toTicketDTO).collect(Collectors.toList());
    }

    public TicketDTO updateTicket(String id, TicketDTO ticketDTO) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de ticket es inválido.");
        }
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
        Ticket ticket = ticketRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado."));
        ticket.setTipoTicket(Ticket.TipoTicket.valueOf(ticketDTO.getTipoTicket()));
        Usuario propietario = usuarioRepository.findById(ticketDTO.getPropietario().getId_usuario()).orElseThrow(() -> new ResourceNotFoundException("Propietario no encontrado."));
        ticket.setPropietario(propietario);
        return mapper.toTicketDTO(ticketRepository.save(ticket));
    }

    public void deleteTicket(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de ticket es inválido.");
        }
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        Ticket ticket = ticketRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado."));
        ticketRepository.delete(ticket);
    }


}
