package com.pgs.hospedaje_tickets.error.exceptions;

public class ValidationException extends RuntimeException {
  private static final String DESCRIPCION = "Validation Error (400)";
  public ValidationException(String message) {
    super(DESCRIPCION + ": " + message);
  }
}
