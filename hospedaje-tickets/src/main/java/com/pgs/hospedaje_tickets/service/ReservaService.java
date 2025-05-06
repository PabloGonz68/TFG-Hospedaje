package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.model.*;
import com.pgs.hospedaje_tickets.repository.*;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    HospedajeRepository hospedajeRepository;

    @Autowired
    UsuarioReservaRepository usuarioReservaRepository;

    @Autowired
    GrupoViajeRepository grupoViajeRepository;

    @Autowired
    MiembroGrupoRepository miembroGrupoRepository;

    @Autowired
    Mapper mapper;

    @Autowired
    ValidatorReserva validatorReserva;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private ReservaUsuarioRepository reservaUsuarioRepository;

    public ReservaDTO createReservaConGrupo(CrearReservaConGrupoDTO dto) {
        //Busca el hospedaje
        Hospedaje hospedaje = hospedajeRepository.findById(dto.getIdHospedaje()).orElseThrow(() -> new RuntimeException("El hospedaje no existe."));
        //Busca el grupo de viaje y sus miembros
        GrupoViaje grupoViaje = grupoViajeRepository.findById(dto.getIdGrupo()).orElseThrow(() -> new RuntimeException("El grupo de viaje no existe."));
        List<MiembroGrupo> miembros = miembroGrupoRepository.findByGrupoViaje(grupoViaje);
        //Validas la reserva
        validatorReserva.validateReserva(dto);

        boolean isOrganizadorEnGrupo = miembros.stream().anyMatch(miembro -> miembro.getUsuario().getId_usuario().equals(dto.getIdOrganizador()));
        if (!isOrganizadorEnGrupo) {
            throw new BadRequestException("El organizador no pertenece al grupo de viaje.");
        }

        // Calcular el coste total de la reserva
        Ticket.TipoTicket tipoTicket = Ticket.TipoTicket.valueOf(hospedaje.getTipoZona().name());
        int costeTotal = miembros.size();
        System.out.println(costeTotal);

        int totalTicketsAportados = 0;
        for (MiembroGrupo miembro : miembros) {
            Usuario usuario = miembro.getUsuario();
            int ticketsAportadosPorMiembro = miembro.getTicketsAportados();

            List<Ticket> disponibles = ticketRepository.findByPropietario(usuario);
            double disponiblesEquivalentes = disponibles.stream().mapToDouble(ticket -> getValorTicket(ticket, tipoTicket)).sum();

            if (disponiblesEquivalentes < ticketsAportadosPorMiembro) {
                throw new BadRequestException("El usuario con email:" + usuario.getEmail() + ", no tiene suficientes tickets disponibles");
            }

            totalTicketsAportados += ticketsAportadosPorMiembro;
            //Consumimos los tickets
            List<Ticket> usados = new ArrayList<>();
            double aRestar = ticketsAportadosPorMiembro;
            for (Ticket ticket : disponibles) {
                double valorTicket = getValorTicket(ticket, tipoTicket);
                if (aRestar<=0) break;
                usados.add(ticket);
                aRestar-=valorTicket;
            }



            ticketRepository.deleteAll(usados);
        }
        System.out.println("Total tickets aportados: " + totalTicketsAportados);
        System.out.println("Coste total: " + costeTotal);
        if (totalTicketsAportados < costeTotal) {
            throw new BadRequestException("Los miembros del grupo no aportan suficientes tickets para la reserva");
        }
        /*
        long totalEquivalentes = 0;

        for(MiembroGrupo miembro : miembros) {
            Usuario usuario = miembro.getUsuario();
            int ticketsAportadosPorMiembro = miembro.getTicketsAportados();

            //Calcular cuantos tickets del tipo requerido tiene el usuario
            long cantidadTipoRequerido = ticketRepository.findByPropietarioAndTipoTicket(usuario, tipoTicket).size();
            long cantidadOtroTipo = ticketRepository.findByPropietarioAndTipoTicket(usuario,
                    tipoTicket == Ticket.TipoTicket.CIUDAD? Ticket.TipoTicket.PUEBLO: Ticket.TipoTicket.CIUDAD).size();

            long ticketsEquivalentes = cantidadTipoRequerido;
            if (tipoTicket == Ticket.TipoTicket.CIUDAD) {
                ticketsEquivalentes += cantidadOtroTipo / 2;
            } else {
                ticketsEquivalentes += cantidadOtroTipo * 2;
            }

            if(ticketsEquivalentes < ticketsAportadosPorMiembro) {
                throw new BadRequestException("El usuario " + usuario.getEmail() + " no tiene suficientes tickets disponibles");
            }
            //Sumo el total
            if(tipoTicket == Ticket.TipoTicket.CIUDAD) {
                totalEquivalentes +=  cantidadTipoRequerido + (cantidadOtroTipo / 2);
            } else {
                totalEquivalentes +=  cantidadTipoRequerido + (cantidadOtroTipo * 2);
            }
        }

        if (totalAportados < costeTotal) {
            throw new BadRequestException("Los miembros del grupo no aportan suficientes tickets para la reserva");
        }

        for (MiembroGrupo miembro : miembros) {
            Usuario usuario = miembro.getUsuario();
            double aRestar = miembro.getTicketsAportados();

            List<Ticket> ticketsUsuario = ticketRepository.findByPropietario(usuario);

            List<Ticket> ticketsUsados = new ArrayList<>();
            // 1º: Intentar usar tickets del tipo requerido
            for (Ticket ticket : ticketsUsuario) {
                if(aRestar <= 0.0001) break;
                if (ticket.getTipoTicket().equals(tipoTicket)) {
                    ticketsUsados.add(ticket);
                    aRestar--;
                }
            }

            // 2º: Si no alcanzan, usar tickets del otro tipo con conversión
            if (aRestar > 0.0001){
                for (Ticket ticket : ticketsUsuario) {
                    if(aRestar <= 0.0001) break;
                    if (ticket.getTipoTicket()!=tipoTicket){
                        if (tipoTicket == Ticket.TipoTicket.CIUDAD) {
                            // 2 PUEBLO = 1 CIUDAD → cada  uno de pueblo vale 0.5 de ciudad
                            ticketsUsados.add(ticket);
                            aRestar-=0.5;
                        } else if (tipoTicket == Ticket.TipoTicket.PUEBLO) {
                            // 1 CIUDAD = 2 PUEBLO → cada uno de ciudad vale 2 de pueblos
                            ticketsUsados.add(ticket);
                            aRestar-=2;
                        }else {
                            throw new ResourceNotFoundException("Tipo de ticket inválido.");
                        }
                    }

                }
            }
            ticketRepository.deleteAll(ticketsUsados);
        }
*/
        //Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setHospedaje(hospedaje);
        reserva.setFecha_inicio(dto.getFechaInicio());
        reserva.setFecha_fin(dto.getFechaFin());
        reserva.setEstado_reserva(Reserva.EstadoReserva.PENDIENTE);
        reservaRepository.save(reserva);

        //Crear relacion entre la reserva y los miembros del grupo
        List<ReservaUsuario> reservasUsuarios = new ArrayList<>();
        for (MiembroGrupo miembro : miembros) {
            ReservaUsuario reservaUsuario = new ReservaUsuario();
            reservaUsuario.setReserva(reserva);
            reservaUsuario.setUsuario(miembro.getUsuario());
            if (miembro.getUsuario().getId_usuario().equals(dto.getIdOrganizador())) {
                reservaUsuario.setRol(ReservaUsuario.RolUsuario.ORGANIZADOR);
            }else {
                reservaUsuario.setRol(ReservaUsuario.RolUsuario.PARTICIPANTE);
            }
            reservasUsuarios.add(reservaUsuario);

        }
        reservaUsuarioRepository.saveAll(reservasUsuarios);


        return mapper.toReservaDTO(reserva);
    }

    private double getValorTicket(Ticket ticket, Ticket.TipoTicket tipoRequerido) {
        if (ticket.getTipoTicket() == tipoRequerido) return 1.0;
        if (tipoRequerido == Ticket.TipoTicket.CIUDAD) return 0.5;
        if (tipoRequerido == Ticket.TipoTicket.PUEBLO) return 2.0;
        throw new IllegalArgumentException("Tipo de ticket inválido");
    }



}
