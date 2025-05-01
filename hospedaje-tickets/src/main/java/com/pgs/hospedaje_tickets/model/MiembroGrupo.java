package com.pgs.hospedaje_tickets.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MiembroGrupo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_grupo", nullable = false)
    private GrupoViaje grupoViaje;

     @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

     @Column(name = "tickets_aportados", nullable = false)
     private int ticketsAportados;
}
