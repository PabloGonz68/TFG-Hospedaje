package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.ReservaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioReservaRepository extends JpaRepository<ReservaUsuario, Long> {
}
