package com.beerfinder.service;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.entity.Profile;
import com.beerfinder.entity.User;
import com.beerfinder.repository.ProfileRepository;
import com.beerfinder.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public ProfileResponse getMyProfile() {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found for current user"));

        return ProfileResponse.fromEntity(profile);
    }

    public ProfileResponse updateMyProfile(UpdateProfileRequest request) {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Profile not found for current user"));

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

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
