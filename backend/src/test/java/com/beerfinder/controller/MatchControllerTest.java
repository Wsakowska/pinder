package com.beerfinder.controller;

import com.beerfinder.dto.MatchResponse;
import com.beerfinder.service.MatchService;
import com.beerfinder.security.JwtUtil;
import com.beerfinder.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MatchController.class)
@AutoConfigureMockMvc(addFilters = false) // Wyłącza filtry Security
public class MatchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MatchService matchService;

    // MUSIMY zamockować te komponenty, jeśli są używane w SecurityConfig lub filtrach
    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void shouldReturn200WhenGettingMatches() throws Exception {
        when(matchService.getMyMatches()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/matches")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturn200WhenGettingMatchById() throws Exception {
        Long matchId = 1L;
        when(matchService.getMatchById(matchId)).thenReturn(new MatchResponse());

        mockMvc.perform(get("/api/matches/" + matchId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}