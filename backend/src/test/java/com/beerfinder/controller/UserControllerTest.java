package com.beerfinder.controller;

import com.beerfinder.dto.ProfileResponse;
import com.beerfinder.dto.UpdateProfileRequest;
import com.beerfinder.service.CloudinaryService;
import com.beerfinder.service.ProfileService;
import com.beerfinder.security.JwtUtil;
import com.beerfinder.security.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

    @MockBean
    private CloudinaryService cloudinaryService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should return my profile")
    void shouldReturnMyProfile() throws Exception {
        ProfileResponse response = new ProfileResponse();
        // response.setName("Test User"); // Ustaw pola jeśli istnieją

        when(profileService.getMyProfile()).thenReturn(response);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should discover profiles with filters")
    void shouldDiscoverProfilesWithFilters() throws Exception {
        when(profileService.discoverProfilesWithFilters(anyInt(), anyInt(), anyInt()))
                .thenReturn(List.of(new ProfileResponse()));

        mockMvc.perform(get("/api/users/discover")
                        .param("minAge", "18")
                        .param("maxAge", "30")
                        .param("maxDistance", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("Should upload profile photo successfully")
    void shouldUploadProfilePhoto() throws Exception {
        // Symulacja pliku Multipart
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        String mockUrl = "http://cloudinary.com/photo.jpg";
        when(cloudinaryService.uploadImage(any())).thenReturn(mockUrl);

        mockMvc.perform(multipart("/api/users/profile/photo")
                        .file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.photoUrl").value(mockUrl))
                .andExpect(jsonPath("$.message").value("Photo uploaded successfully"));
    }

    @Test
    @DisplayName("Should handle upload error from Cloudinary")
    void shouldHandleUploadError() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "content".getBytes());

        when(cloudinaryService.uploadImage(any())).thenThrow(new IllegalArgumentException("File too large"));

        mockMvc.perform(multipart("/api/users/profile/photo").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("File too large"));
    }

    @Test
    @DisplayName("Should delete profile photo")
    void shouldDeletePhoto() throws Exception {
        mockMvc.perform(delete("/api/users/profile/photo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Photo deleted successfully"));
    }
}