package com.community.demo.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.community.demo.entity.User;
import com.community.demo.repository.UserRepository;
import com.community.demo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @Autowired
    private UserRepository userRepository;

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Registration successful",
                    "email", registeredUser.getEmail()
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // User Login (Database Authentication Only)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> user = userService.authenticate(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            );
            
            if (user.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "user", Map.of(
                        "email", user.get().getEmail(),
                        "name", user.get().getUsername()
                    )
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Login failed"));
        }
    }

    // Authentication Check
    @PostMapping("/validate")
    public ResponseEntity<?> validateCredentials(@RequestBody LoginRequest loginRequest) {
        try {
            boolean isValid = userService.validateUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            );
            
            return ResponseEntity.ok(Map.of(
                "isValid", isValid,
                "message", isValid ? "Valid credentials" : "Invalid credentials"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Validation failed"));
        }
    }

 // Get user profile by email
    @GetMapping("/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Update user profile by email
    @PatchMapping("update/{email}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable String email,
            @RequestBody Map<String, Object> updates) {
        try {
            User updatedUser = userService.updateUserByEmail(email, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    // Upload avatar
    @PostMapping("/{userId}/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable String userId,
            @RequestParam("image") MultipartFile file) {
        try {
            User user = userService.uploadAvatar(userId, file);
            return ResponseEntity.ok(user);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }



    // DTO for Login Request
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // DTO for Password Change Request
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        // Getters and setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
    
    @PostMapping("/by-email/increment-points")
    public ResponseEntity<User> incrementPointsByEmail(@RequestParam String email, @RequestParam int amount) {
        return userRepository.findByEmail(email)
            .map(user -> {
                user.setPoints(user.getPoints() + amount);
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Increment followers by email
    @PostMapping("/by-email/increment-followers")
    public ResponseEntity<User> incrementFollowersByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
            .map(user -> {
                user.setFollowers(user.getFollowers() + 1);
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Increment following by emails
    @PostMapping("/by-email/increment-following")
    public ResponseEntity<User> incrementFollowingByEmail(
            @RequestParam String loggedInUserEmail,
            @RequestParam String targetUserEmail) {
        return userRepository.findByEmail(loggedInUserEmail)
            .map(user -> {
                user.setFollowing(user.getFollowing() + 1);
                userRepository.save(user);
                
                // Also increment target user's followers
                userRepository.findByEmail(targetUserEmail).ifPresent(targetUser -> {
                    targetUser.setFollowers(targetUser.getFollowers() + 1);
                    userRepository.save(targetUser);
                });
                
                return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
