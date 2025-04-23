package com.pgs.hospedaje_tickets.utils.validators;

import com.pgs.hospedaje_tickets.dto.Hospedaje.HospedajeDTO;
import com.pgs.hospedaje_tickets.error.exceptions.ValidationException;
import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidatorHospedaje {

    @Autowired
    private HospedajeRepository hospedajeRepository;


    public void validateHospedaje(HospedajeDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isEmpty()) {
            throw new ValidationException("El nombre es obligatorio");
        }

        if (dto.getDireccion() == null || dto.getDireccion().isEmpty()) {
            throw new ValidationException("La direccion es obligatoria");
        }

        if (dto.getCodigoPostal() == null || dto.getCodigoPostal().isEmpty()) {
            throw new ValidationException("El codigo postal es obligatorio");
        }

        if (dto.getCiudad() == null || dto.getCiudad().isEmpty()) {
            throw new ValidationException("La ciudad es obligatoria");
        }

        if (dto.getPais() == null || dto.getPais().isEmpty()) {
            throw new ValidationException("El pais es obligatorio");
        }

        if (dto.getCapacidad() <= 0) {
            throw new ValidationException("La capacidad es obligatoria");
        }

        if (dto.getTipoZona() == null || dto.getTipoZona().isEmpty()) {
            throw new ValidationException("El tipo de zona es obligatorio");
        }

        if (dto.getDescripcion() == null || dto.getDescripcion().isEmpty()) {
            throw new ValidationException("La descripcion es obligatoria");
        }

        if (dto.getUbicacion() == null || dto.getUbicacion().isEmpty()) {
            throw new ValidationException("La ubicacion es obligatoria");
        }
    }

}
