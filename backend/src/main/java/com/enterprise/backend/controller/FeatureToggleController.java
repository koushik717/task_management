package com.enterprise.backend.controller;

import com.enterprise.backend.service.FeatureToggleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/features")
@RequiredArgsConstructor
public class FeatureToggleController {

    private final FeatureToggleService featureToggleService;

    @GetMapping
    public ResponseEntity<Map<String, Boolean>> getFeatures() {
        return ResponseEntity.ok(featureToggleService.getAllFeatures());
    }
}
