package com.beerfinder.service;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.entity.Profile;
import com.beerfinder.entity.User;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.ProfileRepository;
import com.beerfinder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProfileService profileService;

    private User currentUser;
    private Profile currentProfile;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setEmail("me@test.com");

        currentProfile = new Profile();
        currentProfile.setUser(currentUser);
        currentProfile.setName("My Name");
        currentUser.setProfile(currentProfile);
    }

    private void mockAuth() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(currentUser.getEmail());
        when(userRepository.findByEmail(currentUser.getEmail())).thenReturn(Optional.of(currentUser));
    }

    @Test
    @DisplayName("Should update profile fields correctly")
    void shouldUpdateProfile() {
        // Given
        mockAuth();
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("New Name");
        request.setAge(25);

        when(profileRepository.findByUser(currentUser)).thenReturn(Optional.of(currentProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        ProfileResponse response = profileService.updateMyProfile(request);

        // Then
        assertThat(response.getName()).isEqualTo("New Name");
        verify(profileRepository).save(currentProfile);
    }

    @Test
    @DisplayName("Should filter profiles by distance")
    void discoverWithDistanceFilter() {
        // Given
        mockAuth();
        currentProfile.setLatitude(54.3520); // Gdańsk
        currentProfile.setLongitude(18.6466);

        Profile farProfile = new Profile();
        farProfile.setLatitude(52.2297); // Warszawa (~280km)
        farProfile.setLongitude(21.0122);

        Profile nearProfile = new Profile();
        nearProfile.setLatitude(54.4416); // Sopot (~12km)
        nearProfile.setLongitude(18.5601);

        List<Profile> allProfiles = new ArrayList<>(List.of(nearProfile, farProfile));

        when(profileRepository.findDiscoverProfilesWithFilters(any(), any(), any()))
                .thenReturn(allProfiles);

        // When
        List<ProfileResponse> results = profileService.discoverProfilesWithFilters(null, null, 50);

        // Then
        assertThat(results).hasSize(1); // Tylko Sopot powinien zostać
    }

    @Test
    @DisplayName("Should delete old photo from Cloudinary when updating to a new one")
    void shouldDeleteOldPhoto() throws IOException {
        // Given
        mockAuth();
        currentProfile.setProfilePhoto("https://res.cloudinary.com/demo/image/upload/old_photo.jpg");

        when(profileRepository.findByUser(currentUser)).thenReturn(Optional.of(currentProfile));
        when(cloudinaryService.extractPublicId(anyString())).thenReturn("old_photo");

        // When
        profileService.updateProfilePhoto("https://new-url.com/photo.jpg");

        // Then
        verify(cloudinaryService).deleteImage("old_photo");
        assertThat(currentProfile.getProfilePhoto()).isEqualTo("https://new-url.com/photo.jpg");
    }

    @Test
    @DisplayName("Should throw exception when profile not found")
    void shouldThrowExceptionWhenNoProfile() {
        // Given
        mockAuth();
        when(profileRepository.findByUser(currentUser)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> profileService.getMyProfile())
                .isInstanceOf(ResourceNotFoundException.class);
    }
}