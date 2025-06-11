package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.dto.User.UsuarioRegisterDTO;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ValidatorUser validatorUser;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void register_usuarioInvalido_lanzaExcepcion() {
        UsuarioRegisterDTO dto = new UsuarioRegisterDTO();
        dto.setEmail("invalido@example.com");

        doThrow(new IllegalArgumentException("Email inválido"))
                .when(validatorUser).validateUserRegister(dto);

        Exception e = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.register(dto);
        });

        assertEquals("Email inválido", e.getMessage());
    }
}
