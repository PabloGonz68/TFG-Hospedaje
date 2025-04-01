package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Hospedaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospedajeRepository extends JpaRepository<Hospedaje, Long> {

}
