package com.beerfinder.controller;

import com.beerfinder.dto.SwipeRequest;
import com.beerfinder.dto.SwipeResponse;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.service.SwipeService;
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
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SwipeController.class)
@AutoConfigureMockMvc(addFilters = false)
class SwipeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SwipeService swipeService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should return 201 Created when swipe is successful")
    void shouldReturnCreatedWhenSwipeIsSuccessful() throws Exception {
        // Given
        SwipeRequest request = new SwipeRequest();
        request.setSwipedUserId(2L);
        request.setAction(SwipeAction.LIKE); // Poprawione: używamy Enum zamiast String

        SwipeResponse response = new SwipeResponse();
        // Usunąłem setMatched, bo Twoje DTO go nie posiada.
        // Jeśli masz tam jakieś pole, np. response.setMessage("..."), możesz je ustawić tutaj.

        when(swipeService.swipe(any(SwipeRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/swipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("Should return 400 when request is invalid")
    void shouldReturn400WhenRequestIsInvalid() throws Exception {
        // Test walidacji @Valid - wysyłamy pusty obiekt
        SwipeRequest request = new SwipeRequest();

        mockMvc.perform(post("/api/swipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}