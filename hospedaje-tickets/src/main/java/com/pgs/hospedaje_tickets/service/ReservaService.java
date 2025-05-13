package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaIndividualDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.model.*;
import com.pgs.hospedaje_tickets.repository.*;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
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

    public ReservaDTO createReservaIndividual(CrearReservaIndividualDTO dto) {
        //Busca el usuario desde el token
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new RuntimeException("El usuario no existe."));
        //Busca el hospedaje
        Hospedaje hospedaje = hospedajeRepository.findById(dto.getIdHospedaje()).orElseThrow(() -> new RuntimeException("El hospedaje no existe."));

        //Validas la reserva
        validatorReserva.validateReservaIndividual(dto);
    //Obtenemos el tipo de ticket y calculamos el coste
        Ticket.TipoTicket tipoTicket = Ticket.TipoTicket.valueOf(hospedaje.getTipoZona().name());
        List<Ticket> ticketsUsuario = ticketRepository.findByPropietario(usuarioAutenticado);
        double ticketsEquivalentes = ticketsUsuario.stream().mapToDouble(ticket -> getValorTicket(ticket, tipoTicket)).sum();
        //Validamos que la reserva tenga al menos una noche
        long noches = ChronoUnit.DAYS.between(dto.getFechaInicio(), dto.getFechaFin());
        if (noches < 1) {
            throw new BadRequestException("La reserva debe tener al menos una noche.");
        }

        double costeTotal = noches * 1.0;

        if (ticketsEquivalentes < costeTotal) {
            double faltan = Math.ceil(costeTotal - ticketsEquivalentes);
            throw new BadRequestException(
                    "No tienes suficientes tickets para realizar esta reserva. Necesitas " +
                            costeTotal + " tickets, pero solo tienes " + ticketsEquivalentes +
                            ". Te faltan aproximadamente " + faltan + " tickets."
            );
        }


        List<Ticket> ticketsUsados = new ArrayList<>();
        double aRestar = costeTotal;
        for (Ticket ticket : ticketsUsuario) {
            if (aRestar <= 0) break;
            ticketsUsados.add(ticket);
            aRestar -= getValorTicket(ticket, tipoTicket);
        }

        //Ahora eliminamos los tickets usados
        ticketRepository.deleteAll(ticketsUsados);
        //Creamos la reserva
        Reserva reserva = new Reserva();
        reserva.setHospedaje(hospedaje);
        reserva.setFecha_inicio(dto.getFechaInicio());
        reserva.setFecha_fin(dto.getFechaFin());
        reserva.setEstado_reserva(Reserva.EstadoReserva.PENDIENTE);
        reserva.setCosteTotalTickets((int) costeTotal);
        reserva = reservaRepository.save(reserva);
       // Relación usuario - reserva
        ReservaUsuario reservaUsuario = new ReservaUsuario();
        reservaUsuario.setReserva(reserva);
        reservaUsuario.setUsuario(usuarioAutenticado);
        reservaUsuario.setRol(ReservaUsuario.RolUsuario.ORGANIZADOR);
        reservaUsuarioRepository.save(reservaUsuario);
        //Le damos los tickets al propietario
        Usuario propietarioHospedaje = hospedaje.getAnfitrion();
        recompensarPropietario(propietarioHospedaje, (int) costeTotal, tipoTicket);

        return mapper.toReservaDTO(reserva);

    }

    public ReservaDTO createReservaConGrupo(CrearReservaConGrupoDTO dto) {
        //Busca el hospedaje
        Hospedaje hospedaje = hospedajeRepository.findById(dto.getIdHospedaje()).orElseThrow(() -> new RuntimeException("El hospedaje no existe."));
        //Busca el grupo de viaje y sus miembros
        GrupoViaje grupoViaje = grupoViajeRepository.findById(dto.getIdGrupo()).orElseThrow(() -> new RuntimeException("El grupo de viaje no existe."));
        List<MiembroGrupo> miembros = miembroGrupoRepository.findByGrupoViaje(grupoViaje);
        //Validas la reserva
        validatorReserva.validateReservaGrupo(dto);
        //Validamos si el usuario es el Organizador
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new RuntimeException("El usuario no existe."));
        boolean isCreador = grupoViaje.getCreador().getId_usuario().equals(usuarioAutenticado.getId_usuario());
        boolean isAdmin = usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN);

        if (!isCreador && !isAdmin) {
            throw new ForbiddenException("Solo el creador del grupo o un administrador puede realizar la reserva.");
        }


        // Calcular el coste total de la reserva
        Ticket.TipoTicket tipoTicket = Ticket.TipoTicket.valueOf(hospedaje.getTipoZona().name());
        long noches = ChronoUnit.DAYS.between(dto.getFechaInicio(), dto.getFechaFin());
        if (noches < 1) {
            throw new BadRequestException("La reserva debe tener al menos una noche.");
        }
        int costeTotal = (int) noches * miembros.size();
        System.out.println("Coste total (tickets): " + costeTotal);

        int totalTicketsAportados = 0;
        List<MiembroGrupo> miembrosValidos = new ArrayList<>();
        for (MiembroGrupo miembro : miembros) {
            Usuario usuario = miembro.getUsuario();
            int ticketsAportadosPorMiembro = miembro.getTicketsAportados();

            List<Ticket> disponibles = ticketRepository.findByPropietario(usuario);
            double disponiblesEquivalentes = disponibles.stream().mapToDouble(ticket -> getValorTicket(ticket, tipoTicket)).sum();

            if (disponiblesEquivalentes < ticketsAportadosPorMiembro) {
                throw new BadRequestException("El usuario " + usuario.getNombre() + " no tiene suficientes tickets para aportar los " + ticketsAportadosPorMiembro + " requeridos."
                );
            }

            totalTicketsAportados += ticketsAportadosPorMiembro;
            miembrosValidos.add(miembro);
        }
        //Validamos
        if (totalTicketsAportados < costeTotal) {
            int faltan = costeTotal - totalTicketsAportados;
            throw new BadRequestException("Los miembros del grupo no aportan suficientes tickets. Se requieren " + costeTotal + " tickets, pero solo se han aportado " + totalTicketsAportados + ". Faltan " + faltan + " tickets.");
        }


        if (totalTicketsAportados != costeTotal) {
            throw new BadRequestException("La suma de los tickets aportados debe ser exactamente igual al coste de la reserva");
        }

        for (MiembroGrupo miembro : miembrosValidos) {
            Usuario usuario = miembro.getUsuario();
            int ticketsAportadosPorMiembro = miembro.getTicketsAportados();
            List<Ticket> disponibles = ticketRepository.findByPropietario(usuario);
            //Consumimos los tickets
            List<Ticket> usados = new ArrayList<>();
            double aRestar = ticketsAportadosPorMiembro;
            for (Ticket ticket : disponibles) {
                double valorTicket = getValorTicket(ticket, tipoTicket);
                if (aRestar <= 0) break;
                usados.add(ticket);
                aRestar -= valorTicket;
            }
            ticketRepository.deleteAll(usados);//Ejecutamos si paso todos los filtros
        }




        System.out.println("Total tickets aportados: " + totalTicketsAportados);
        System.out.println("Coste total: " + costeTotal);

        //Crear la reserva
        Reserva reserva = new Reserva();
        reserva.setHospedaje(hospedaje);
        reserva.setFecha_inicio(dto.getFechaInicio());
        reserva.setFecha_fin(dto.getFechaFin());
        reserva.setEstado_reserva(Reserva.EstadoReserva.PENDIENTE);
        reserva.setCosteTotalTickets(costeTotal);
        reservaRepository.save(reserva);

        //Crear relacion entre la reserva y los miembros del grupo
        List<ReservaUsuario> reservasUsuarios = new ArrayList<>();
        for (MiembroGrupo miembro : miembros) {
            ReservaUsuario reservaUsuario = new ReservaUsuario();
            reservaUsuario.setReserva(reserva);
            reservaUsuario.setUsuario(miembro.getUsuario());
            if (miembro.getUsuario().getId_usuario().equals(grupoViaje.getCreador().getId_usuario())) {
                reservaUsuario.setRol(ReservaUsuario.RolUsuario.ORGANIZADOR);
            }else {
                reservaUsuario.setRol(ReservaUsuario.RolUsuario.PARTICIPANTE);
            }
            reservasUsuarios.add(reservaUsuario);

        }
        reservaUsuarioRepository.saveAll(reservasUsuarios);

        Usuario propietarioHospedaje = hospedaje.getAnfitrion();
        recompensarPropietario(propietarioHospedaje, costeTotal, tipoTicket);


        return mapper.toReservaDTO(reserva);
    }

    private double getValorTicket(Ticket ticket, Ticket.TipoTicket tipoRequerido) {
        if (ticket.getTipoTicket() == tipoRequerido) return 1.0;
        if (tipoRequerido == Ticket.TipoTicket.CIUDAD) return 0.5;
        if (tipoRequerido == Ticket.TipoTicket.PUEBLO) return 2.0;
        throw new IllegalArgumentException("Tipo de ticket inválido");
    }

    private void recompensarPropietario(Usuario propietario, int cantidadTickets, Ticket.TipoTicket tipoTicket) {
        List<Ticket> ticketsARecompensar = new ArrayList<>();
        for (int i = 0; i < cantidadTickets; i++) {
            Ticket nuevoTicket = new Ticket();
            nuevoTicket.setPropietario(propietario);
            nuevoTicket.setTipoTicket(tipoTicket);
            ticketsARecompensar.add(nuevoTicket);
        }
        ticketRepository.saveAll(ticketsARecompensar);
    }



}
