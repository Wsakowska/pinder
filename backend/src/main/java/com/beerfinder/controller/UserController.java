package com.beerfinder.controller;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ProfileService profileService;

    public UserController(ProfileService profileService) {
        this.profileService = profileService;
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
}
