package com.pgs.hospedaje_tickets.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioDTO {
    private String nombre;
    private String apellidos;
    private String email;
    private String fotoPerfil;
    private LocalDateTime fechaRegistro;
    private String rol;
}

