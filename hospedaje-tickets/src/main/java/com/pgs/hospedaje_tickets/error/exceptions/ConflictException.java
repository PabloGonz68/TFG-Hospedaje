package com.pgs.hospedaje_tickets.error.exceptions;

public class ConflictException extends RuntimeException {
  private static final String DESCRIPCION = "Conflict Duplicate (409)";
  public ConflictException(String message) {
    super(DESCRIPCION + ": " + message);
  }
}
