package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.Hospedaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospedajeRepository extends JpaRepository<Hospedaje, Long> {
List<Hospedaje> findByAnfitrionEmail(String email);
List<Hospedaje> findByCiudad(String ciudad);
List<Hospedaje> findByPais(String pais);
List<Hospedaje> findByTipoZona(Hospedaje.TipoZona tipoZona);
List<Hospedaje> findByCapacidad(int capacidad);

}
