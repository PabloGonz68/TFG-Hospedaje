package com.pgs.hospedaje_tickets.repository;


import com.pgs.hospedaje_tickets.model.Ticket;
import com.pgs.hospedaje_tickets.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByPropietario(Usuario propietario);
    List<Ticket> findByPropietarioAndTipoTicket(Usuario propietario, Ticket.TipoTicket tipoTicket);
}
