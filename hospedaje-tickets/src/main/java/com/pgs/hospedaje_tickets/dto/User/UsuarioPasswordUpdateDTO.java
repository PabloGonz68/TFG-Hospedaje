package com.pgs.hospedaje_tickets.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioPasswordUpdateDTO {
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}

