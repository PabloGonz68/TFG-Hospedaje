package com.pgs.hospedaje_tickets.repository;

import com.pgs.hospedaje_tickets.model.GrupoViaje;
import com.pgs.hospedaje_tickets.model.MiembroGrupo;
import com.pgs.hospedaje_tickets.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiembroGrupoRepository extends JpaRepository<MiembroGrupo, Long> {
    List<MiembroGrupo> findByGrupoViaje(GrupoViaje grupo); // Busca los miembros de un grupo de viaje
    List<MiembroGrupo> findByUsuario(Usuario usuario); // Busca los grupos de viaje de un usuario

}
