package com.pgs.hospedaje_tickets.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioRegisterDTO {
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
    private String confirmPassword;
}
