package com.pgs.hospedaje_tickets.controller;

import com.pgs.hospedaje_tickets.dto.Ticket.TicketDTO;
import com.pgs.hospedaje_tickets.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getAllUserTickets(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketsByPropietario(id));
    }
    @GetMapping("/")
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}/admin")
    public ResponseEntity<?> getTicket(@PathVariable String id) {
        return new ResponseEntity<>(ticketService.getTicket(id), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody TicketDTO ticketDTO) {
        return new ResponseEntity<>(ticketService.createTicket(ticketDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable String id, @RequestBody TicketDTO ticketDTO) {
        return new ResponseEntity<>(ticketService.updateTicket(id, ticketDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return new ResponseEntity<>("Ticket eliminado correctamente", HttpStatus.OK);
    }
}
