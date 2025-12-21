package com.enterprise.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        LocalDateTime timestamp,
        int status,
        String message,
        String path,
        String requestId,
        Map<String, String> errors) {
    public ApiError(int status, String message, String path, String requestId) {
        this(LocalDateTime.now(), status, message, path, requestId, null);
    }
}
