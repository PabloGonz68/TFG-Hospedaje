package com.pgs.hospedaje_tickets.error.exceptions;

public class UnauthorizedException extends RuntimeException {
    private static final String DESCRIPCION = "Unauthorized (401)";
    public UnauthorizedException(String message) {
        super(DESCRIPCION + ": " + message);
    }
}
