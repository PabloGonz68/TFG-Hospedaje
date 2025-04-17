package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Hospedaje;
import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorHospedaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospedajeService {

    @Autowired
    private ValidatorHospedaje validatorHospedaje;

    @Autowired
    private HospedajeRepository hospedajeRepository;

    @Autowired
    private StringToLong StringToLong;

    @Autowired
    private Mapper mapper;

    public HospedajeDTO createHospedaje(HospedajeDTO dto) {
        validatorHospedaje.validateHospedaje(dto);

        Hospedaje hospedaje = new Hospedaje();
        hospedaje.setNombre(dto.getNombre());
        hospedaje.setDireccion(dto.getDireccion());
        hospedaje.setCodigoPostal(dto.getCodigoPostal());
        hospedaje.setCiudad(dto.getCiudad());
        hospedaje.setPais(dto.getPais());
        hospedaje.setCapacidad(dto.getCapacidad());
        hospedaje.setTipoZona(Hospedaje.TipoZona.valueOf(dto.getTipoZona()));
        hospedaje.setDescripcion(dto.getDescripcion());
        hospedajeRepository.save(hospedaje);

        return dto;
    }

    public HospedajeDTO getHospedaje(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de hospedaje es inválido.");
        }

        Hospedaje hospedaje = hospedajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Hospedaje no encontrado."));
        return mapper.toHospedajeDTO(hospedaje);
    }

    public List<HospedajeDTO> getAllHospedajes(){
    List<Hospedaje> hospedajes = hospedajeRepository.findAll();
    if (hospedajes.isEmpty()){
        throw new ResourceNotFoundException("No se encontraron hospedajes");
    }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }
    



}
