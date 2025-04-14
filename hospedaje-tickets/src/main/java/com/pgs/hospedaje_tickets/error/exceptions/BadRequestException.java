package com.pgs.hospedaje_tickets.error.exceptions;

public class BadRequestException extends RuntimeException {
    private static final String DESCRIPTION = "Bad request (400)";

    public BadRequestException(String message) {
        super(DESCRIPTION + ": " + message);
    }
}
