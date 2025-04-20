package com.community.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.community.demo.entity.User;
import com.community.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/";

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get user by email instead of ID
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // Update user by email instead of ID
    public User updateUserByEmail(String email, Map<String, Object> updates) {
        User user = getUserByEmail(email);
        
        updates.forEach((key, value) -> {
            switch (key) {
                case "name":
                    user.setName((String) value);
                    break;
                case "bio":
                    user.setBio((String) value);
                    break;
                case "summary":
                    user.setSummary((String) value);
                    break;
                case "currentRole":
                    user.setCurrentRole((String) value);
                    break;
                case "futureGoals":
                    user.setFutureGoals((String) value);
                    break;
                case "passion":
                    user.setPassion((String) value);
                    break;
                case "hobbies":
                    user.setHobbies((String) value);
                    break;
                // Add other fields as needed
                case "username":
                    user.setUsername((String) value);
                    break;
                case "password":
                    user.setPassword((String) value);
                    break;
            }
        });
        
        return userRepository.save(user);
    }

    // Upload avatar by email
    public User uploadAvatar(String email, MultipartFile file) throws IOException {
        User user = getUserByEmail(email);
        String fileName = saveImage(file);
        user.setAvatarUrl("/" + UPLOAD_DIR + fileName);
        return userRepository.save(user);
    }

    // Upload cover image by email
    public User uploadCoverImage(String email, MultipartFile file) throws IOException {
        User user = getUserByEmail(email);
        String fileName = saveImage(file);
        user.setCoverImageUrl("/" + UPLOAD_DIR + fileName);
        return userRepository.save(user);
    }

    private String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        return fileName;
    }
    
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> authenticate(String email, String password) {
        return userRepository.findByEmail(email)
            .filter(user -> user.getPassword().equals(password));
    }

    public boolean validateUser(String email, String password) {
        return userRepository.findByEmail(email)
            .map(user -> user.getPassword().equals(password))
            .orElse(false);
    }

    // Change password by email
    public boolean changePassword(String email, String currentPassword, String newPassword) {
        User user = getUserByEmail(email);
        
        // Verify current password
        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Validate new password
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters long");
        }
        
        // Set new password
        user.setPassword(newPassword);
        userRepository.save(user);
        return true;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}