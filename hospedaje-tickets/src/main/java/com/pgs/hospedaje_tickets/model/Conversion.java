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
@Table(name = "conversiones")
public class Conversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_conversion;

    @ManyToOne
    @JoinColumn(name = "id_anfitrion", nullable = false)
    private Usuario id_anfitrion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoConversion tipo_conversion;

    private enum TipoConversion {
        pueblo_a_ciudad, ciudad_a_pueblo
    }

    @Column(name = "cantidad_tickets", nullable = false)
    private int cantidad;

    @Column(name = "fecha", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }


}
