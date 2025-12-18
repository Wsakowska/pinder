package com.beerfinder.service;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.entity.Profile;
import com.beerfinder.entity.User;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.exception.UnauthorizedException;
import com.beerfinder.repository.ProfileRepository;
import com.beerfinder.repository.UserRepository;
import com.beerfinder.util.GeoUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          CloudinaryService cloudinaryService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public ProfileResponse getMyProfile() {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        return ProfileResponse.fromEntity(profile);
    }

    public ProfileResponse updateMyProfile(UpdateProfileRequest request) {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        profile.setName(request.getName());
        profile.setAge(request.getAge());
        profile.setBio(request.getBio());
        profile.setOccupation(request.getOccupation());
        profile.setInterests(request.getInterests());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        profile.setProfilePhoto(request.getProfilePhoto());

        Profile saved = profileRepository.save(profile);
        return ProfileResponse.fromEntity(saved);
    }

    public List<ProfileResponse> discoverProfiles() {
        User currentUser = getCurrentUser();

        List<Profile> profiles = profileRepository.findDiscoverProfiles(currentUser);

        return profiles.stream()
                .map(ProfileResponse::fromEntity)
                .toList();
    }

    /**
     * Discover profiles with filters (age, distance)
     *
     * @param minAge      Minimum age filter (optional)
     * @param maxAge      Maximum age filter (optional)
     * @param maxDistance Maximum distance in km (optional)
     * @return List of filtered profiles
     */
    public List<ProfileResponse> discoverProfilesWithFilters(Integer minAge, Integer maxAge, Integer maxDistance) {
        User currentUser = getCurrentUser();
        Profile currentUserProfile = currentUser.getProfile();

        // Pobierz profile z filtrem wieku
        List<Profile> profiles = profileRepository.findDiscoverProfilesWithFilters(
                currentUser,
                minAge,
                maxAge
        );

        // Jeśli jest filtr odległości, zastosuj go
        if (maxDistance != null && currentUserProfile.getLatitude() != null && currentUserProfile.getLongitude() != null) {
            profiles = profiles.stream()
                    .filter(profile -> {
                        // Jeśli profil nie ma lokalizacji, pomiń go
                        if (profile.getLatitude() == null || profile.getLongitude() == null) {
                            return false;
                        }

                        // Oblicz dystans
                        double distance = GeoUtils.calculateDistance(
                                currentUserProfile.getLatitude(),
                                currentUserProfile.getLongitude(),
                                profile.getLatitude(),
                                profile.getLongitude()
                        );

                        return distance <= maxDistance;
                    })
                    .collect(Collectors.toList());
        }

        return profiles.stream()
                .map(ProfileResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Aktualizuje zdjęcie profilowe użytkownika
     */
    public void updateProfilePhoto(String photoUrl) {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        // Jeśli użytkownik już ma zdjęcie, usuń stare z Cloudinary
        if (profile.getProfilePhoto() != null && profile.getProfilePhoto().contains("cloudinary")) {
            try {
                String publicId = cloudinaryService.extractPublicId(profile.getProfilePhoto());
                if (publicId != null) {
                    cloudinaryService.deleteImage(publicId);
                }
            } catch (IOException e) {
                // Log error but continue - old photo stays in Cloudinary
                System.err.println("Failed to delete old photo: " + e.getMessage());
            }
        }

        profile.setProfilePhoto(photoUrl);
        profileRepository.save(profile);
    }

    /**
     * Usuwa zdjęcie profilowe użytkownika
     */
    public void deleteProfilePhoto() throws IOException {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for current user"));

        if (profile.getProfilePhoto() != null && profile.getProfilePhoto().contains("cloudinary")) {
            String publicId = cloudinaryService.extractPublicId(profile.getProfilePhoto());
            if (publicId != null) {
                cloudinaryService.deleteImage(publicId);
            }
        }

        profile.setProfilePhoto(null);
        profileRepository.save(profile);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}