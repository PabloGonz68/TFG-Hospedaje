package com.pgs.hospedaje_tickets.utils.validators;

import com.pgs.hospedaje_tickets.dto.User.*;
import com.pgs.hospedaje_tickets.error.exceptions.ConflictException;
import com.pgs.hospedaje_tickets.error.exceptions.ValidationException;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidatorUser {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void validateUserAdmin(UsuarioAdminDTO userDTO) {
        if (userDTO.getNombre() == null || userDTO.getNombre().isEmpty()) {
            throw new ValidationException("El nombre es obligatorio");
        }

        if (userDTO.getApellidos() == null || userDTO.getApellidos().isEmpty()) {
            throw new ValidationException("Los apellidos son obligatorios");
        }

        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            throw new ValidationException("El email es obligatorio");
        }
    }

    public void validateUserRegister(UsuarioRegisterDTO userRegisterDTO) {
        if (userRegisterDTO.getNombre() == null || userRegisterDTO.getNombre().isEmpty()) {
            throw new ValidationException("El nombre es obligatorio");
        }

        if (userRegisterDTO.getApellidos() == null || userRegisterDTO.getApellidos().isEmpty()) {
            throw new ValidationException("Los apellidos son obligatorios");
        }

        if (userRegisterDTO.getEmail() == null || userRegisterDTO.getEmail().isEmpty()) {
            throw new ValidationException("El email es obligatorio");
        }

        if (userRegisterDTO.getPassword() == null || userRegisterDTO.getPassword().isEmpty()) {
            throw new ValidationException("La contraseña es obligatoria");
        }

        if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getConfirmPassword())) {
            throw new ValidationException("Las contraseñas no coinciden");
        }

        if (usuarioRepository.findByEmail(userRegisterDTO.getEmail()).isPresent()) {
            throw new ConflictException("El usuario ya existe");
        }

        if (!userRegisterDTO.getEmail().matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            throw new ValidationException("El email no es valido");
        }

        String password = userRegisterDTO.getPassword();

        if (password.length() < 8) {
            throw new ValidationException("La contraseña debe tener al menos 8 caracteres");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new ValidationException("La contraseña debe contener al menos una letra mayúscula");
        }

        if (!password.matches(".*\\d.*")) {
            throw new ValidationException("La contraseña debe contener al menos un número");
        }

    }

    public void validateUserUpdate(UsuarioUpdateDTO userUpdateDTO) {

        if (userUpdateDTO.getNombre() == null || userUpdateDTO.getNombre().isEmpty()) {
            throw new ValidationException("El nombre es obligatorio");
        }

        if (userUpdateDTO.getApellidos() == null || userUpdateDTO.getApellidos().isEmpty()) {
            throw new ValidationException("Los apellidos son obligatorios");
        }

    }

    public void validateUserPassword(UsuarioPasswordUpdateDTO user) {
        if (user.getCurrentPassword() == null || user.getNewPassword() == null) {
            throw new IllegalArgumentException("Las contraseñas no pueden ser nulas.");
        }

        if (user.getCurrentPassword().isBlank() || user.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("Las contraseñas no pueden estar vacias.");
        }

        if (user.getCurrentPassword().equals(user.getNewPassword())) {
            throw new ValidationException("La nueva contraseña debe ser diferente a la actual.");
        }
        if (!user.getNewPassword().equals(user.getConfirmPassword())) {
            throw new ValidationException("Las contraseñas no coinciden.");
        }
    }


}

