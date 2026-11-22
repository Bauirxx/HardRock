package com.gym.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String recurso, Object id) {
        super(recurso + " com ID " + id + " não foi encontrado", HttpStatus.NOT_FOUND);
    }
}
