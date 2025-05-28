package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearGrupoViajeDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.GrupoViajeDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ConflictException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.GrupoViaje;
import com.pgs.hospedaje_tickets.model.MiembroGrupo;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.GrupoViajeRepository;
import com.pgs.hospedaje_tickets.repository.MiembroGrupoRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class GrupoViajeService {

    private final MiembroGrupoRepository miembroGrupoRepository;
    private final UsuarioRepository usuarioRepository;
    private final GrupoViajeRepository grupoViajeRepository;
    private final Mapper mapper;

    @Transactional
    public GrupoViajeDTO crearGrupoViaje(CrearGrupoViajeDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        //Buscas al creador
        Usuario creador = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        //Creas el grupo de viaje
        GrupoViaje grupo = new GrupoViaje();
        //Añadimos los datos del creador
        grupo.setCreador(creador);
        grupo.setCantidadTicketsCreador(dto.getCantidadTicketsCreador());


        List<MiembroGrupo> miembros = new ArrayList<>();//Se hace una lista de miembros
        Set<Long> idsUsuarioAgregados = new HashSet<>();//Se hace un set para evitar duplicados
        //Se añade al creador
        MiembroGrupo miembroCreador = new MiembroGrupo();
        miembroCreador.setGrupoViaje(grupo);
        miembroCreador.setUsuario(creador);
        miembroCreador.setTicketsAportados(dto.getCantidadTicketsCreador());
        miembros.add(miembroCreador);
        idsUsuarioAgregados.add(creador.getId_usuario());


//Se añaden los miembros al grupo
        for (CrearGrupoViajeDTO.MiembroGrupoDTO miembro : dto.getMiembros()) {
            Long idUsuario = miembro.getIdUsuario();

            if (idsUsuarioAgregados.contains(idUsuario)) {
                throw new ConflictException("El usuario con ID " + idUsuario + " ya está incluido en el grupo.");
            }

            Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new ResourceNotFoundException("El usuario con ID " + idUsuario + " no existe."));

            MiembroGrupo miembroGrupo = new MiembroGrupo();
            miembroGrupo.setGrupoViaje(grupo);
            miembroGrupo.setUsuario(usuario);
            miembroGrupo.setTicketsAportados(miembro.getTicketsAportados());

            miembros.add(miembroGrupo);
            idsUsuarioAgregados.add(idUsuario);
        }
        //Asignan los miembros al grupo
        grupo.setMiembros(miembros);
        //Se guarda en la base de datos
        grupoViajeRepository.save(grupo);
        miembroGrupoRepository.saveAll(miembros);

        return mapper.toGrupoViajeDTO(grupo);

    }

    public GrupoViajeDTO getGrupoViaje(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de grupo de viaje es inválido.");
        }

        GrupoViaje grupo = grupoViajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("El grupo de viaje no existe."));

       /* String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        boolean isAdmin = usuario.getRol() == Usuario.Rol.ADMIN;
        boolean isMiembro = grupo.getMiembros().stream().anyMatch(m -> m.getUsuario().getId_usuario().equals(usuario.getId_usuario()));

        if (!isAdmin && !isMiembro) {
            throw new ForbiddenException("No tienes permiso para acceder a este grupo de viaje.");
        }*/

        return mapper.toGrupoViajeDTO(grupo);
    }


    public List<GrupoViajeDTO> getGruposViajeByMiembro(String email) {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!Objects.equals(email, emailAutenticado)) {
            throw new ForbiddenException("No puedes acceder a los grupos de viaje de otro usuario.");
        }
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        List<GrupoViaje> grupos = miembroGrupoRepository.findByUsuario(usuario).stream().map(MiembroGrupo::getGrupoViaje).collect(Collectors.toList());
        if (grupos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron grupos de viaje.");
        }
        return grupos.stream().map(mapper::toGrupoViajeDTO).collect(Collectors.toList());
    }

    public List<GrupoViajeDTO> getMisGruposViaje() {
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Email autenticado: " + emailAutenticado);
        Usuario usuario = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        System.out.println("Usuario ID: " + usuario.getId_usuario());
        List<MiembroGrupo> miembros = miembroGrupoRepository.findByUsuario(usuario);
        System.out.println("MiembroGrupos encontrados: " + miembros.size());

        List<GrupoViaje> grupos = miembroGrupoRepository.findByUsuario(usuario).stream().map(MiembroGrupo::getGrupoViaje).collect(Collectors.toList());
        if (grupos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron grupos de viaje.");
        }
        return grupos.stream().map(mapper::toGrupoViajeDTO).collect(Collectors.toList());
    }

    //Para Admin
    public List<GrupoViajeDTO> getGruposViaje() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        if (!usuario.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        List<GrupoViaje> grupos = grupoViajeRepository.findAll();
        if (grupos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron grupos de viaje.");
        }
        return grupos.stream().map(mapper::toGrupoViajeDTO).collect(Collectors.toList());
    }

    public GrupoViajeDTO updateGrupoViaje(String id, CrearGrupoViajeDTO dto) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de grupo de viaje es inválido.");
        }
        GrupoViaje grupo = grupoViajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("El grupo de viaje no existe."));
        grupo.setCantidadTicketsCreador(dto.getCantidadTicketsCreador());
        MiembroGrupo miembroCreador = grupo.getMiembros().stream().filter(m -> m.getUsuario().getId_usuario().equals(grupo.getCreador().getId_usuario())).findFirst().orElse(null);
        if (miembroCreador != null) {
            miembroCreador.setTicketsAportados(dto.getCantidadTicketsCreador());
        }



        //Busco los miembros que ya no estan en el grupo

        List<Long> idsNuevos = new ArrayList<>(
                dto.getMiembros().stream()
                        .map(CrearGrupoViajeDTO.MiembroGrupoDTO::getIdUsuario)
                        .toList()
        );
        idsNuevos.add(grupo.getCreador().getId_usuario());


        // Eliminar miembros que ya no están
        grupo.getMiembros().removeIf(miembro -> {
            boolean eliminar = !idsNuevos.contains(miembro.getUsuario().getId_usuario());
            if (eliminar) {
                miembroGrupoRepository.delete(miembro);
            }
            return eliminar;
        });

        // Actualizar miembros existentes o agregar nuevos
        for (CrearGrupoViajeDTO.MiembroGrupoDTO miembroDTO : dto.getMiembros()) {
            Usuario usuario = usuarioRepository.findById(miembroDTO.getIdUsuario())
                    .orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));

            MiembroGrupo existente = grupo.getMiembros().stream()
                    .filter(m -> m.getUsuario().getId_usuario().equals(usuario.getId_usuario()))
                    .findFirst()
                    .orElse(null);

            if (existente != null) {
                existente.setTicketsAportados(miembroDTO.getTicketsAportados()); // actualizar tickets
            } else {
                MiembroGrupo nuevo = new MiembroGrupo();
                nuevo.setGrupoViaje(grupo);
                nuevo.setUsuario(usuario);
                nuevo.setTicketsAportados(miembroDTO.getTicketsAportados());
                grupo.getMiembros().add(nuevo);
            }
        }


        grupoViajeRepository.save(grupo);
        return mapper.toGrupoViajeDTO(grupo);
    }

    public void deleteGrupoViaje(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de grupo de viaje es inválido.");
        }
        grupoViajeRepository.deleteById(idLong);
    }


    public boolean isAdminAndisMiembro(GrupoViaje grupo) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        boolean isAdmin = usuario.getRol() == Usuario.Rol.ADMIN;
        boolean isMiembro = grupo.getMiembros().stream().anyMatch(m -> m.getUsuario().getId_usuario().equals(usuario.getId_usuario()));

        return isAdmin && isMiembro;
    }


}
