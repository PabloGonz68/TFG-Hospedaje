package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Reserva;
import com.pgs.hospedaje_tickets.model.ReservaUsuario;
import com.pgs.hospedaje_tickets.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservaUsuarioRepository extends JpaRepository<ReservaUsuario, Long> {
    int countByReserva(Reserva reserva);

    // Reservas donde un usuario participa
    @Query ("SELECT ru.reserva FROM ReservaUsuario ru WHERE ru.usuario = :usuario")
    List<Reserva> findReservasByUsuario(@Param("usuario") Usuario usuario);



}