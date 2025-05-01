package com.pgs.hospedaje_tickets.service;

import com.pgs.hospedaje_tickets.repository.HospedajeRepository;
import com.pgs.hospedaje_tickets.repository.ReservaRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioRepository;
import com.pgs.hospedaje_tickets.repository.UsuarioReservaRepository;
import com.pgs.hospedaje_tickets.utils.Mapper;
import com.pgs.hospedaje_tickets.utils.validators.ValidatorReserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservaService {

    @Autowired
    ReservaRepository reservaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    HospedajeRepository hospedajeRepository;

    @Autowired
    UsuarioReservaRepository usuarioReservaRepository;

    @Autowired
    Mapper mapper;

    @Autowired
    ValidatorReserva validatorReserva;




}
