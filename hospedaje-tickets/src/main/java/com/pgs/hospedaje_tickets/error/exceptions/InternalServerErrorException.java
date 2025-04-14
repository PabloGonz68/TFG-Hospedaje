package com.pgs.hospedaje_tickets.error.exceptions;

public class InternalServerErrorException extends RuntimeException {
    private static final String DESCRIPCION = "Internal Server Error (500)";
    public InternalServerErrorException(String message) {
        super(DESCRIPCION + ": " + message);
    }
}
