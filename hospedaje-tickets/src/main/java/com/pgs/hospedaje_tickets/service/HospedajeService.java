package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeResponseDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Hospedaje;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorHospedaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    public HospedajeResponseDTO createHospedaje(HospedajeDTO dto) {
        validatorHospedaje.validateHospedaje(dto);

        Usuario anfitrion = usuarioRepository.findById(dto.getAnfitrionId()).orElseThrow(()
                -> new ResourceNotFoundException("El anfitrión no existe."));

        Hospedaje hospedaje = new Hospedaje();
        hospedaje.setAnfitrion(anfitrion);
        hospedaje.setNombre(dto.getNombre());
        hospedaje.setDireccion(dto.getDireccion());
        hospedaje.setCodigoPostal(dto.getCodigoPostal());
        hospedaje.setCiudad(dto.getCiudad());
        hospedaje.setPais(dto.getPais());
        hospedaje.setCapacidad(dto.getCapacidad());
        hospedaje.setTipoZona(Hospedaje.TipoZona.valueOf(dto.getTipoZona()));
        hospedaje.setDescripcion(dto.getDescripcion());
        hospedaje.setUbicacion(dto.getUbicacion());
        hospedaje.setVisible(dto.isVisible());
        hospedaje.setFechaCreacion(LocalDateTime.now());
        hospedajeRepository.save(hospedaje);

        HospedajeResponseDTO response = new HospedajeResponseDTO(
                hospedaje.getId_hospedaje(),
                hospedaje.getNombre(),
                hospedaje.getDireccion(),
                hospedaje.getCiudad(),
                hospedaje.getPais(),
                hospedaje.getCapacidad(),
                hospedaje.getTipoZona().name(),
                hospedaje.getDescripcion(),
                hospedaje.isVisible(),
                hospedaje.getUbicacion()
        );

        return response;

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
    //Filtros
    public List<HospedajeDTO> getHospedajesByAnfitrion(String email){
        List<Hospedaje> hospedajes = hospedajeRepository.findByAnfitrionEmail(email);
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByCiudad(String ciudad){
        List<Hospedaje> hospedajes = hospedajeRepository.findByCiudad(ciudad);
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByPais(String pais){
        List<Hospedaje> hospedajes = hospedajeRepository.findByPais(pais);
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByTipoZona(String tipoZona){
        List<Hospedaje> hospedajes = hospedajeRepository.findByTipoZona(Hospedaje.TipoZona.valueOf(tipoZona));
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByCapacidad(int capacidad){
        List<Hospedaje> hospedajes = hospedajeRepository.findByCapacidad(capacidad);
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }
    //

    public HospedajeDTO updateHospedaje(String id, HospedajeDTO dto) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de hospedaje es inválido.");
        }

        validatorHospedaje.validateHospedaje(dto);

        Hospedaje hospedaje = hospedajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Hospedaje no encontrado."));
        hospedaje.setNombre(dto.getNombre());
        hospedaje.setDireccion(dto.getDireccion());
        hospedaje.setCodigoPostal(dto.getCodigoPostal());
        hospedaje.setCiudad(dto.getCiudad());
        hospedaje.setPais(dto.getPais());
        hospedaje.setCapacidad(dto.getCapacidad());
        hospedaje.setTipoZona(Hospedaje.TipoZona.valueOf(dto.getTipoZona()));
        hospedaje.setDescripcion(dto.getDescripcion());
        hospedaje.setUbicacion(dto.getUbicacion());
        hospedaje.setVisible(dto.isVisible());
        hospedajeRepository.save(hospedaje);

        return mapper.toHospedajeDTO(hospedaje);

    }

    public void deleteHospedaje(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de hospedaje es inválido.");
        }
        Hospedaje hospedaje = hospedajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Hospedaje no encontrado."));
        hospedajeRepository.delete(hospedaje);
    }

}
