package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.GrupoViaje;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrupoViajeRepository extends JpaRepository<GrupoViaje, Long> {

    @EntityGraph(attributePaths = "miembros")  // Para cargar miembros junto con GrupoViaje
    Optional<GrupoViaje> findById(Long id);
}
