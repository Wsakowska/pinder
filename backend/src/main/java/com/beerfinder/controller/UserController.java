package com.beerfinder.controller;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.service.CloudinaryService;
import com.beerfinder.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Profile", description = "User profile management endpoints")
public class UserController {

    private final ProfileService profileService;
    private final CloudinaryService cloudinaryService;

    public UserController(ProfileService profileService, CloudinaryService cloudinaryService) {
        this.profileService = profileService;
        this.cloudinaryService = cloudinaryService;
    }

    @Operation(summary = "Get current user profile", description = "Returns the profile of the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        ProfileResponse profile = profileService.getMyProfile();
        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Update user profile", description = "Updates the authenticated user's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse updated = profileService.updateMyProfile(request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Discover profiles", description = "Get list of profiles available for swiping")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profiles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/discover")
    public ResponseEntity<List<ProfileResponse>> discoverProfiles() {
        List<ProfileResponse> profiles = profileService.discoverProfiles();
        return ResponseEntity.ok(profiles);
    }

    @Operation(
            summary = "Upload profile photo",
            description = "Upload a profile photo to Cloudinary. Max size: 5MB. Formats: JPG, PNG, GIF, WEBP"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Photo uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file (wrong format or too large)"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Upload failed")
    })
    @PostMapping(value = "/profile/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfilePhoto(
            @Parameter(description = "Image file (JPG, PNG, GIF, WEBP, max 5MB)")
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            profileService.updateProfilePhoto(imageUrl);

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

    @Operation(summary = "Delete profile photo", description = "Removes the user's profile photo from Cloudinary")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Photo deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Delete failed")
    })
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