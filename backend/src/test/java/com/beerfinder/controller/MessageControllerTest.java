package com.beerfinder.controller;

import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.service.MessageService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MessageController.class)
@AutoConfigureMockMvc(addFilters = false)
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MessageService messageService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should send message and return 201 Created")
    void shouldSendMessage() throws Exception {
        // Given
        // Uzupełniamy pola, aby przejść walidację @Valid
        MessageRequest request = new MessageRequest();
        request.setMatchId(1L);
        request.setContent("Cześć, idziemy na piwo?");

        MessageResponse response = new MessageResponse();
        // Opcjonalnie: response.setContent("Cześć, idziemy na piwo?");

        when(messageService.sendMessage(any(MessageRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value(response.getContent()));
        // Jeśli MessageResponse nie ma pola content, usuń powyższą linię .andExpect
    }

    @Test
    @DisplayName("Should return chat history and 200 OK")
    void shouldGetChatHistory() throws Exception {
        // Given
        Long matchId = 1L;
        List<MessageResponse> history = List.of(new MessageResponse(), new MessageResponse());

        when(messageService.getChatHistory(matchId)).thenReturn(history);

        // When & Then
        mockMvc.perform(get("/api/messages/{matchId}", matchId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("Should return unread count")
    void shouldGetUnreadCount() throws Exception {
        // Given
        Long matchId = 1L;
        when(messageService.getUnreadCount(matchId)).thenReturn(5L);

        // When & Then
        mockMvc.perform(get("/api/messages/{matchId}/unread", matchId))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }
}