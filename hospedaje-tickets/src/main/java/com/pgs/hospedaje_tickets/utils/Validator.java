package com.pgs.hospedaje_tickets.utils;

import com.pgs.hospedaje_tickets.dto.UsuarioRegisterDTO;
import org.springframework.stereotype.Component;

@Component
public class Validator {

    public static void validateUserRegister(UsuarioRegisterDTO userRegisterDTO) {
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
}
