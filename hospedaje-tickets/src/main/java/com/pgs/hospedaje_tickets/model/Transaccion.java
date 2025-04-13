package com.pgs.hospedaje_tickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_transacciones")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Transaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_transaccion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_conversion")
    private Conversion conversion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransaccion tipo_transaccion;

    private enum TipoTransaccion {
        RESERVA,
        COMPRA,
        RECOMPENSA,
        CONVERSION
    }

    @Column(name = "fecha_transaccion")
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }


}
