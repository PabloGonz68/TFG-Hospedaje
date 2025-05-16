package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Reserva;
import com.pgs.hospedaje_tickets.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("""
    SELECT r FROM Reserva r
    WHERE r.hospedaje.id = :idHospedaje
    AND r.fecha_inicio < :fecha_fin
    AND r.fecha_fin > :fecha_inicio
""")
    List<Reserva> findReservasEnRango(
            @Param("idHospedaje") Long idHospedaje,
            @Param("fecha_inicio") LocalDate fecha_inicio,
            @Param("fecha_fin") LocalDate fecha_fin
    );

    List<Reserva> findByHospedajeAnfitrion(Usuario anfitrion);

}

