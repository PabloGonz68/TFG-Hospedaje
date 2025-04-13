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
public class OpinionHospedaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_opinion;

    @ManyToOne
    @JoinColumn(name = "id_reserva", nullable = false)
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_hospedaje", nullable = false)
    private Hospedaje hospedaje;

    @Column(nullable = false)
    private int calificacion;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }
}
