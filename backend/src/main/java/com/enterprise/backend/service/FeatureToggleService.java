package com.enterprise.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FeatureToggleService {

    @Value("${app.features.soft-delete:false}")
    private boolean softDeleteEnabled;

    @Value("${app.features.analytics:false}")
    private boolean analyticsEnabled;

    @Value("${app.features.notifications:true}")
    private boolean notificationsEnabled;

    public boolean isEnabled(String featureName) {
        return switch (featureName) {
            case "soft-delete" -> softDeleteEnabled;
            case "analytics" -> analyticsEnabled;
            case "notifications" -> notificationsEnabled;
            default -> false;
        };
    }

    public Map<String, Boolean> getAllFeatures() {
        Map<String, Boolean> features = new HashMap<>();
        features.put("soft-delete", softDeleteEnabled);
        features.put("analytics", analyticsEnabled);
        features.put("notifications", notificationsEnabled);
        return features;
    }
}
