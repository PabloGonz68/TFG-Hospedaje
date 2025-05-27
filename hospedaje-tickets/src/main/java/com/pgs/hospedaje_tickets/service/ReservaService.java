package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaIndividualDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.ReservaEstadoDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.*;
import com.pgs.hospedaje_tickets.repository.*;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    HospedajeRepository hospedajeRepository;

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
        //Validar que no se reserve su propio hospedaje
        Usuario propietarioHospedaje = hospedaje.getAnfitrion();
        if (propietarioHospedaje.getId_usuario().equals(usuarioAutenticado.getId_usuario())) {
            throw new BadRequestException("No puedes reservar tu propio hospedaje.");
        }
        //Validar que no este duplicada
        List<Reserva> reservasEnConflicto = reservaRepository.findReservasEnRango(hospedaje.getId_hospedaje(), dto.getFechaInicio(), dto.getFechaFin());
        if (!reservasEnConflicto.isEmpty()) {
            throw new BadRequestException("No se puede crear la reserva. Ya existe una reserva confirmada para este hospedaje en esas fechas.");
        }

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

        List<ReservaUsuario> reservasUsuarios = new ArrayList<>();
       // Relación usuario - reserva
        ReservaUsuario reservaUsuario = new ReservaUsuario();
        reservaUsuario.setReserva(reserva);
        reservaUsuario.setUsuario(usuarioAutenticado);
        reservaUsuario.setRol(ReservaUsuario.RolUsuario.ORGANIZADOR);


        reservasUsuarios.add(reservaUsuario);
        reservaUsuarioRepository.saveAll(reservasUsuarios);
        //reserva.setReservasUsuarios(reservasUsuarios);
        reserva.getReservasUsuarios().clear();
        reserva.getReservasUsuarios().addAll(reservasUsuarios);

        //Le damos los tickets al propietario
        recompensarPropietario(propietarioHospedaje, (int) costeTotal, tipoTicket);

        int numPersonas = reservasUsuarios.size();
        if (numPersonas>1) throw new BadRequestException("Hay más de un miembro, por lo que debes realizar una reserva grupal.");
        reserva.setNumPersonas(numPersonas);

        reserva = reservaRepository.save(reserva);
        return mapper.toReservaDTO(reserva);

    }

    public ReservaDTO createReservaConGrupo(CrearReservaConGrupoDTO dto) {
        //Busca el hospedaje
        Hospedaje hospedaje = hospedajeRepository.findById(dto.getIdHospedaje()).orElseThrow(() -> new RuntimeException("El hospedaje no existe."));
        //Validar que no este duplicada
        List<Reserva> reservasEnConflicto = reservaRepository.findReservasEnRango(hospedaje.getId_hospedaje(), dto.getFechaInicio(), dto.getFechaFin());
        if (!reservasEnConflicto.isEmpty()) {
            throw new BadRequestException("No se puede crear la reserva. Ya existe una reserva confirmada para este hospedaje en esas fechas.");
        }
        //Busca el grupo de viaje y sus miembros
        GrupoViaje grupoViaje = grupoViajeRepository.findById(dto.getIdGrupo()).orElseThrow(() -> new RuntimeException("El grupo de viaje no existe."));
        List<MiembroGrupo> miembros = miembroGrupoRepository.findByGrupoViaje(grupoViaje);

            Usuario propietarioHospedaje = hospedaje.getAnfitrion();
            boolean propietarioEnGrupo = miembros.stream().anyMatch(miembro -> miembro.getUsuario().getId_usuario().equals(propietarioHospedaje.getId_usuario()));
            if (propietarioEnGrupo) {
                throw new ForbiddenException("El propietario del hospedaje no puede ser parte del grupo de reserva.");
            }
        //Validas la reserva
        validatorReserva.validateReservaGrupo(dto);
        //Validamos si el usuario es el Organizador
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(() -> new RuntimeException("El usuario no existe."));
        boolean isCreador = grupoViaje.getCreador().getId_usuario().equals(usuarioAutenticado.getId_usuario());
        boolean isAdmin = usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN);

        System.out.println("Autenticado: " + usuarioAutenticado.getEmail());
        System.out.println("Creador grupo: " + grupoViaje.getCreador().getEmail());


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
        reserva.getReservasUsuarios().clear();
        reserva.getReservasUsuarios().addAll(reservasUsuarios);

        recompensarPropietario(propietarioHospedaje, costeTotal, tipoTicket);

        //int numPersonas = reservaUsuarioRepository.countByReserva(reserva);
        int numPersonas = reservasUsuarios.size();
        reserva.setNumPersonas(numPersonas);

        reservaRepository.save(reserva);
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

    public List<ReservaDTO> getReservasDelUsuario() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<Reserva> reservas = reservaUsuarioRepository.findReservasByUsuario(usuario);
        if (reservas.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron reservas");
        }
        return reservas.stream().map(mapper::toReservaDTO).collect(Collectors.toList());
    }

    public List<ReservaDTO> getReservasDelPropietario() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario propietario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        List<Reserva> reservas = reservaRepository.findByHospedajeAnfitrion(propietario);
        if (reservas.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron reservas");
        }
        return reservas.stream().map(mapper::toReservaDTO).collect(Collectors.toList());
    }


    public ReservaDTO actualizarEstadoReserva(String id, ReservaEstadoDTO nuevoEstado) {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new RuntimeException("El usuario no existe."));
        Long idReservaLong = StringToLong.StringToLong(id);
        if (idReservaLong == null) {
            throw new BadRequestException("El id de la reserva es incorrecto.");
        }
        Reserva reserva = reservaRepository.findById(idReservaLong).orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        System.out.println("El id del usuario autenticado es: " + usuarioAutenticado.getId_usuario());
        System.out.println("El id del anfitrion del hospedaje es: " + reserva.getHospedaje().getAnfitrion().getId_usuario());
        if (!usuarioAutenticado.getId_usuario().equals(reserva.getHospedaje().getAnfitrion().getId_usuario()) && !usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para actualizar el estado de la reserva.");
        }

        reserva.setEstado_reserva(nuevoEstado.getEstado());
        reservaRepository.save(reserva);
        return mapper.toReservaDTO(reserva);
    }

    public ReservaDTO cancelarReserva(String id) {

        Long idReservaLong = StringToLong.StringToLong(id);
        if (idReservaLong == null) {
            throw new BadRequestException("El id de la reserva es incorrecto.");
        }
        Reserva reserva = reservaRepository.findById(idReservaLong)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (reserva.getEstado_reserva() == Reserva.EstadoReserva.CANCELADA) {
            throw new BadRequestException("La reserva ya está cancelada.");
        }

        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new RuntimeException("El usuario no existe."));
        boolean isMiembro = reserva.getReservasUsuarios().stream().anyMatch(m -> m.getUsuario().getId_usuario().equals(usuarioAutenticado.getId_usuario()));

        boolean isAdmin = usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN);
        boolean isPropietario = usuarioAutenticado.getId_usuario().equals(reserva.getHospedaje().getAnfitrion().getId_usuario());
        if (isAdmin || isPropietario || isMiembro) {
            reserva.setEstado_reserva(Reserva.EstadoReserva.CANCELADA);
            reservaRepository.save(reserva);
            if (reserva.getEstado_reserva() != Reserva.EstadoReserva.CANCELADA) {
                throw new BadRequestException("No se pudo cancelar la reserva.");
            }
            return mapper.toReservaDTO(reserva);
        }else {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
    }
    //----------ADMIN----------
    public ReservaDTO getReservaById(String idReserva) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if(!usuario.getRol().equals(Usuario.Rol.ADMIN)) throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        Long idReservaLong = StringToLong.StringToLong(idReserva);
        if (idReservaLong == null) {
            throw new BadRequestException("El id de la reserva es incorrecto.");
        }
        Reserva reserva = reservaRepository.findById(idReservaLong)
                .orElseThrow(() -> new ResourceNotFoundException("La reserva no existe."));
        return mapper.toReservaDTO(reserva);
    }

    public List<ReservaDTO> getAllReservas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if(!usuario.getRol().equals(Usuario.Rol.ADMIN)) throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        List<Reserva> reservas = reservaRepository.findAll();
        return reservas.stream().map(mapper::toReservaDTO).collect(Collectors.toList());
    }

    public void deleteReserva(String idReserva) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if(!usuario.getRol().equals(Usuario.Rol.ADMIN)) throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        Long idReservaLong = StringToLong.StringToLong(idReserva);
        if (idReservaLong == null) {
            throw new BadRequestException("El id de la reserva es incorrecto.");
        }
        reservaRepository.deleteById(idReservaLong);
    }





}
