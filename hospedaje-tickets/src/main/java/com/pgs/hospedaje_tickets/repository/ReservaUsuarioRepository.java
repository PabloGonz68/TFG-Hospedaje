package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.ReservaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaUsuarioRepository extends JpaRepository<ReservaUsuario, Long> {
}