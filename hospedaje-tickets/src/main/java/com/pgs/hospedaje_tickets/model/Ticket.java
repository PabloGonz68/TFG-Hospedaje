package com.pgs.hospedaje_tickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_ticket;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario propietario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTicket tipoTicket;

    private enum TipoTicket {
        PUEBLO, CIUDAD
    }

    @Column(name = "fecha_generacion")
    private LocalDateTime fecha_generacion;

    @PrePersist
    protected void onCreate() {
        this.fecha_generacion = LocalDateTime.now();
    }
}
