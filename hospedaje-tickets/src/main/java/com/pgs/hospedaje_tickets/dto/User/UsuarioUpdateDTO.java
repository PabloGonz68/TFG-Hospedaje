package com.pgs.hospedaje_tickets.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioUpdateDTO {

        private String nombre;
        private String apellidos;
        private String fotoPerfil;
}

