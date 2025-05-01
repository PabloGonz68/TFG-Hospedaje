package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.GrupoViaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrupoViajeRepository extends JpaRepository<GrupoViaje, Long> {
}
