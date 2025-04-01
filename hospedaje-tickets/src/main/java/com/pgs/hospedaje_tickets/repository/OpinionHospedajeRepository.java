package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.OpinionHospedaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpinionHospedajeRepository  extends JpaRepository<OpinionHospedaje, Long> {
}
