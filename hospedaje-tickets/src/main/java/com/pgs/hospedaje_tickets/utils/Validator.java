package com.pgs.hospedaje_tickets.utils;

import com.pgs.hospedaje_tickets.dto.UsuarioDTO;
import com.pgs.hospedaje_tickets.dto.UsuarioPasswordUpdateDTO;
import com.pgs.hospedaje_tickets.dto.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.dto.UsuarioUpdateDTO;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Validator {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void validateUser(UsuarioDTO userDTO) {
        if (userDTO.getNombre() == null || userDTO.getNombre().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (userDTO.getApellidos() == null || userDTO.getApellidos().isEmpty()) {
            throw new RuntimeException("Los apellidos son obligatorios");
        }

        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            throw new RuntimeException("El email es obligatorio");
        }
    }

    public void validateUserRegister(UsuarioRegisterDTO userRegisterDTO) {
        if (userRegisterDTO.getNombre() == null || userRegisterDTO.getNombre().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (userRegisterDTO.getApellidos() == null || userRegisterDTO.getApellidos().isEmpty()) {
            throw new RuntimeException("Los apellidos son obligatorios");
        }

        if (userRegisterDTO.getEmail() == null || userRegisterDTO.getEmail().isEmpty()) {
            throw new RuntimeException("El email es obligatorio");
        }

        if (userRegisterDTO.getPassword() == null || userRegisterDTO.getPassword().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        if (usuarioRepository.findByEmail(userRegisterDTO.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        if (!userRegisterDTO.getEmail().matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
            throw new RuntimeException("El email no es valido");
        }


        String password = userRegisterDTO.getPassword();

        if (password.length() < 8) {
            throw new RuntimeException("La contraseña debe tener al menos 8 caracteres");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("La contraseña debe contener al menos una letra mayúscula");
        }

        if (!password.matches(".*\\d.*")) {
            throw new RuntimeException("La contraseña debe contener al menos un número");
        }

    }

    public void validateUserUpdate(UsuarioUpdateDTO userUpdateDTO) {

        if (userUpdateDTO.getNombre() == null || userUpdateDTO.getNombre().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (userUpdateDTO.getApellidos() == null || userUpdateDTO.getApellidos().isEmpty()) {
            throw new RuntimeException("Los apellidos son obligatorios");
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
            throw new RuntimeException("La nueva contraseña debe ser diferente a la actual.");
        }
    }


}

