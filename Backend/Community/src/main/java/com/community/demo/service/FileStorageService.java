package com.community.demo.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        // Define the directory where uploaded files will be stored
        this.fileStorageLocation = Paths.get("uploads")
                .toAbsolutePath()
                .normalize();

        try {
            // Create the upload directory if it doesn't exist
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(
                "Could not create the directory where the uploaded files will be stored.", 
                ex
            );
        }
    }

    /**
     * Stores a file in the upload directory
     * 
     * @param file The file to store
     * @return The generated filename
     * @throws RuntimeException if the file cannot be stored
     */
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new RuntimeException(
                    "Sorry! Filename contains invalid path sequence: " + originalFileName
                );
            }

            // Generate a unique filename to prevent collisions
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException(
                "Could not store file " + originalFileName + ". Please try again!", 
                ex
            );
        }
    }

    /**
     * Loads a file as a Resource
     * 
     * @param fileName The name of the file to load
     * @return The Resource object
     * @throws RuntimeException if the file cannot be loaded
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }

    /**
     * Deletes a file from the upload directory
     * 
     * @param fileName The name of the file to delete
     * @return true if the file was deleted successfully
     * @throws RuntimeException if the file cannot be deleted
     */
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + fileName, ex);
        }
    }
}