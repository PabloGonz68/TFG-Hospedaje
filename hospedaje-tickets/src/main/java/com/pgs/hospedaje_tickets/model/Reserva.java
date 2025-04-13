package com.pgs.hospedaje_tickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_reserva;

    @ManyToOne
    @JoinColumn(name = "id_hospedaje", nullable = false)
    private Hospedaje hospedaje;

    @Column(nullable = false)
    private LocalDateTime fecha_inicio;

    @Column(nullable = false)
    private LocalDateTime fecha_fin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado_reserva;

    private enum EstadoReserva {
        PENDIENTE, CONFIRMADA, COMPLETADA, CANCELADA
    }

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservaUsuario> reservasUsuarios = new ArrayList<>();


}
