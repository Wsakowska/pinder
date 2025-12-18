package com.beerfinder.controller;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.service.CloudinaryService;
import com.beerfinder.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ProfileService profileService;
    private final CloudinaryService cloudinaryService;

    public UserController(ProfileService profileService, CloudinaryService cloudinaryService) {
        this.profileService = profileService;
        this.cloudinaryService = cloudinaryService;
    }

    // GET /api/users/me - dane profilu zalogowanego użytkownika
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        ProfileResponse profile = profileService.getMyProfile();
        return ResponseEntity.ok(profile);
    }

    // PUT /api/users/profile - aktualizacja profilu
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse updated = profileService.updateMyProfile(request);
        return ResponseEntity.ok(updated);
    }

    // GET /api/users/discover - lista profili do swipe
    @GetMapping("/discover")
    public ResponseEntity<List<ProfileResponse>> discoverProfiles() {
        List<ProfileResponse> profiles = profileService.discoverProfiles();
        return ResponseEntity.ok(profiles);
    }

    // POST /api/users/profile/photo - upload zdjęcia profilowego
    @PostMapping("/profile/photo")
    public ResponseEntity<Map<String, String>> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file) {
        try {
            // Upload do Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);

            // Zaktualizuj profil użytkownika
            profileService.updateProfilePhoto(imageUrl);

            // Zwróć URL
            Map<String, String> response = new HashMap<>();
            response.put("photoUrl", imageUrl);
            response.put("message", "Photo uploaded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // DELETE /api/users/profile/photo - usuń zdjęcie profilowe
    @DeleteMapping("/profile/photo")
    public ResponseEntity<Map<String, String>> deleteProfilePhoto() {
        try {
            profileService.deleteProfilePhoto();

            Map<String, String> response = new HashMap<>();
            response.put("message", "Photo deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete photo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}