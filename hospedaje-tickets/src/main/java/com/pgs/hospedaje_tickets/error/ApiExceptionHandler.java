package com.pgs.hospedaje_tickets.error;

import com.pgs.hospedaje_tickets.error.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorMessageForClient handleBadRequestException(HttpServletRequest request, BadRequestException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ErrorMessageForClient handleConflictException(HttpServletRequest request, ConflictException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorMessageForClient handleForbiddenException(HttpServletRequest request, ForbiddenException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(InternalServerErrorException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorMessageForClient handleInternalServerErrorException(HttpServletRequest request, InternalServerErrorException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorMessageForClient handleResourceNotFoundException(HttpServletRequest request, ResourceNotFoundException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorMessageForClient handleUnauthorizedException(HttpServletRequest request, UnauthorizedException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorMessageForClient handleValidationException(HttpServletRequest request, ValidationException ex) {
        return new ErrorMessageForClient(ex.getMessage(), request.getRequestURI());
    }
}
