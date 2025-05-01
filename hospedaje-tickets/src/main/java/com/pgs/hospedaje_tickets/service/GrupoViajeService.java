package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearGrupoViajeDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.GrupoViajeDTO;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.GrupoViaje;
import com.pgs.hospedaje_tickets.model.MiembroGrupo;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.GrupoViajeRepository;
import com.pgs.hospedaje_tickets.repository.MiembroGrupoRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class GrupoViajeService {

    private final MiembroGrupoRepository miembroGrupo;
    private final UsuarioRepository usuarioRepository;
    private final GrupoViajeRepository grupoViajeRepository;
    private final Mapper mapper;

    @Transactional
    public GrupoViajeDTO crearGrupoViaje(CrearGrupoViajeDTO dto) {
        //Buscas al creador
        Usuario creador = usuarioRepository.findById(dto.idCreador).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));
        //Creas el grupo de viaje
        GrupoViaje grupo = new GrupoViaje();
        grupo.setCreador(creador);
        grupoViajeRepository.save(grupo);//y se guarda para generar su id, para que sepan los miembros que pertenecen al grupo

        //Se añaden los miembros al grupo
        List<MiembroGrupo> miembros = new ArrayList<>();
        for (CrearGrupoViajeDTO.MiembroGrupoDTO miembro : dto.getMiembros()) {
            Usuario usuario = usuarioRepository.findById(miembro.getIdUsuario()).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));

            MiembroGrupo miembroGrupo = new MiembroGrupo();
            miembroGrupo.setGrupoViaje(grupo);
            miembroGrupo.setUsuario(usuario);
            miembroGrupo.setTicketsAportados(miembro.getTicketsAportados());

            miembros.add(miembroGrupo);
        }
        //Asignan los miembros al grupo
        grupo.setMiembros(miembros);
        //Se guarda en la base de datos
        grupoViajeRepository.save(grupo);
        miembroGrupo.saveAll(miembros);

        return mapper.toGrupoViajeDTO(grupo);

    }



}
