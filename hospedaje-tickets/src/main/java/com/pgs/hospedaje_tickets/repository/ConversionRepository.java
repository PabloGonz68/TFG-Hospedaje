package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Conversion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversionRepository  extends JpaRepository<Conversion, Long> {
}
