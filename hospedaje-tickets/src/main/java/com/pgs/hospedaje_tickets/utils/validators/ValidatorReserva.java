package com.pgs.hospedaje_tickets.utils.validators;

import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaConGrupoDTO;
import com.pgs.hospedaje_tickets.dto.Reserva.CrearReservaIndividualDTO;
import com.pgs.hospedaje_tickets.error.exceptions.ValidationException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class ValidatorReserva {

    public void validateReservaGrupo(CrearReservaConGrupoDTO dto){
        if (dto.getIdHospedaje() == null ||dto.getIdHospedaje() <=0){
            throw new ValidationException("La id del hospedaje es obligatoria");
        }

        if(dto.getFechaInicio() == null){
            throw new ValidationException("La fecha de inicio es obligatoria");
        }

        if (dto.getFechaFin() == null){
            throw new ValidationException("La fecha de fin es obligatoria");
        }

        if (dto.getFechaInicio().isEqual(dto.getFechaFin())){
            throw new ValidationException("La fecha de incio y la fecha de fin no pueden coincidir");
        }

        if (dto.getFechaFin().isBefore(dto.getFechaInicio())){
            throw new ValidationException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        if (dto.getFechaInicio().isBefore(LocalDate.now())){
            throw new ValidationException("La fecha de inicio debe ser posterior a la fecha actual");
        }

        if (dto.getEstado() == null || dto.getEstado().isEmpty()){
            throw new ValidationException("Debe tener un estado preestablecido obligatoriamente");
        }



    }


    public void validateReservaIndividual(CrearReservaIndividualDTO dto){
        if (dto.getIdHospedaje() == null ||dto.getIdHospedaje() <=0){
            throw new ValidationException("La id del hospedaje es obligatoria");
        }

        if(dto.getFechaInicio() == null){
            throw new ValidationException("La fecha de inicio es obligatoria");
        }

        if (dto.getFechaFin() == null){
            throw new ValidationException("La fecha de fin es obligatoria");
        }

        if (dto.getFechaInicio().isEqual(dto.getFechaFin())){
            throw new ValidationException("La fecha de incio y la fecha de fin no pueden coincidir");
        }

        if (dto.getFechaFin().isBefore(dto.getFechaInicio())){
            throw new ValidationException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        if (dto.getFechaInicio().isBefore(LocalDate.now())){
            throw new ValidationException("La fecha de inicio debe ser posterior a la fecha actual");
        }

        if (dto.getEstado() == null || dto.getEstado().isEmpty()){
            throw new ValidationException("Debe tener un estado preestablecido obligatoriamente");
        }



    }
}
