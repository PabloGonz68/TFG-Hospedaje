package com.pgs.hospedaje_tickets.error.exceptions;

public class ForbiddenException extends RuntimeException {
    private static final String DESCRIPTION = "Forbidden (403)";
    public ForbiddenException(String message) {
        super(DESCRIPTION + ": " + message);
    }
}
