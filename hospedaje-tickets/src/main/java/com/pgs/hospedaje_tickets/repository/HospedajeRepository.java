package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Hospedaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospedajeRepository extends JpaRepository<Hospedaje, Long> {
List<Hospedaje> findByAnfitrionEmailAndVisibleIsTrue(String email);
List<Hospedaje> findByAnfitrionEmail(String email);
List<Hospedaje> findByCiudadAndVisibleIsTrue(String ciudad);
List<Hospedaje> findByPaisAndVisibleIsTrue(String pais);
List<Hospedaje> findByTipoZonaAndVisibleIsTrue(Hospedaje.TipoZona tipoZona);
    List<Hospedaje> findByCapacidadLessThanEqualAndVisibleIsTrue(int capacidad);
List<Hospedaje> findByVisible(boolean visible);

}
