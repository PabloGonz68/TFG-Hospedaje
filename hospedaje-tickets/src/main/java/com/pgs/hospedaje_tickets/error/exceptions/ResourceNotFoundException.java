package com.pgs.hospedaje_tickets.error.exceptions;

public class ResourceNotFoundException extends RuntimeException {
  private static final String DESCRIPCION = "Resource not found (404)";
    public ResourceNotFoundException(String message) {
        super(DESCRIPCION + ": " + message);
    }
}
