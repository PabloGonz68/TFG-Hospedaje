package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.error.exceptions.BadRequestException;
import com.pgs.hospedaje_tickets.error.exceptions.ForbiddenException;
import com.pgs.hospedaje_tickets.error.exceptions.ResourceNotFoundException;
import com.pgs.hospedaje_tickets.model.Hospedaje;
import com.pgs.hospedaje_tickets.model.Usuario;
import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.StringToLong;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorHospedaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public HospedajeDTO createHospedaje(HospedajeDTO dto, Authentication auth) {
        validatorHospedaje.validateHospedaje(dto);

       if (auth==null || !auth.isAuthenticated()) {
            throw new BadRequestException("El usuario no está autenticado.");
        }

       String email = auth.getName();
        Usuario anfitrion = usuarioRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("El usuario no existe."));


        Hospedaje hospedaje = mapper.toHospedaje(dto, anfitrion);
        hospedaje.setFechaCreacion(LocalDateTime.now());
        hospedajeRepository.save(hospedaje);

        return mapper.toHospedajeDTO(hospedaje);

    }

    public HospedajeDTO getHospedaje(String id) {
        Long idLong = StringToLong.StringToLong(id);
        if (idLong == null || idLong <= 0) {
            throw new BadRequestException("El id de hospedaje es inválido.");
        }

        Hospedaje hospedaje = hospedajeRepository.findById(idLong).orElseThrow(() -> new ResourceNotFoundException("Hospedaje no encontrado."));

            Usuario anfitrion = hospedaje.getAnfitrion();
            String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
            boolean esAnfitrion = anfitrion.getEmail().equals(emailAutenticado);
            boolean esAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!hospedaje.isVisible() && !esAnfitrion && !esAdmin) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }

        return mapper.toHospedajeDTO(hospedaje);
    }

    public List<HospedajeDTO> getAllHospedajes(){
    List<Hospedaje> hospedajes = hospedajeRepository.findByVisible(true);
    if (hospedajes.isEmpty()){
        throw new ResourceNotFoundException("No se encontraron hospedajes");
    }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }
    public List<HospedajeDTO> getAllAdminHospedajes(){
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(emailAutenticado).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));
        if (!usuarioAutenticado.getRol().equals(Usuario.Rol.ADMIN)) {
            throw new ForbiddenException("No tienes permiso para acceder a esta información.");
        }
        List<Hospedaje> hospedajes = hospedajeRepository.findAll();
        if (hospedajes.isEmpty()){
            throw new ResourceNotFoundException("No se encontraron hospedajes");
        }
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }
    //Filtros
    public List<HospedajeDTO> getHospedajesByOtroAnfitrion(String email){
        List<Hospedaje> hospedajes = hospedajeRepository.findByAnfitrionEmailAndVisibleIsTrue(email);
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByAnfitrion(String email){
        List<Hospedaje> hospedajes = hospedajeRepository.findByAnfitrionEmail(email);
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> filtrarHospedajes(String ciudad, String pais, String tipoZona, Integer capacidad){
        List<Hospedaje> hospedajes = hospedajeRepository.findByVisible(true).stream()
                .filter(h -> ciudad == null || ciudad.isEmpty() || h.getCiudad().equalsIgnoreCase(ciudad))
                .filter(h -> pais == null || pais.isEmpty() || h.getPais().equalsIgnoreCase(pais))
                .filter(h -> tipoZona == null || tipoZona.isEmpty() || h.getTipoZona().name().equalsIgnoreCase(tipoZona))
                .filter(h -> capacidad == null || capacidad == 0 || h.getCapacidad() >= capacidad)
                .collect(Collectors.toList());
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

/*
    public List<HospedajeDTO> getHospedajesByCiudad(String ciudad){
        List<Hospedaje> hospedajes = hospedajeRepository.findByCiudadAndVisibleIsTrue(ciudad);
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByPais(String pais){
        List<Hospedaje> hospedajes = hospedajeRepository.findByPaisAndVisibleIsTrue(pais);
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByTipoZona(String tipoZona){
        List<Hospedaje> hospedajes = hospedajeRepository.findByTipoZonaAndVisibleIsTrue(Hospedaje.TipoZona.valueOf(tipoZona));
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

    public List<HospedajeDTO> getHospedajesByCapacidad(int capacidad){
        List<Hospedaje> hospedajes = hospedajeRepository.findByCapacidadLessThanEqualAndVisibleIsTrue(capacidad);
        return hospedajes.stream().map(mapper::toHospedajeDTO).collect(Collectors.toList());
    }

 */
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
