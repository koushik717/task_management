package com.enterprise.backend.controller;

import com.enterprise.backend.model.User;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        // Email update is complex due to auth, skipping for now or handling carefully
        // if (request.getEmail() != null) user.setEmail(request.getEmail());

        return ResponseEntity.ok(userRepository.save(user));
    }
}

@lombok.Data
class UpdateProfileRequest {
    private String name;
    private String email;
}
