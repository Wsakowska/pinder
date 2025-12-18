package com.beerfinder.controller;

import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * POST /api/messages - wyślij wiadomość
     */
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/messages/{matchId} - pobierz historię chatu
     */
    @GetMapping("/{matchId}")
    public ResponseEntity<List<MessageResponse>> getChatHistory(@PathVariable Long matchId) {
        List<MessageResponse> messages = messageService.getChatHistory(matchId);
        return ResponseEntity.ok(messages);
    }

    /**
     * GET /api/messages/{matchId}/unread - liczba nieprzeczytanych wiadomości
     */
    @GetMapping("/{matchId}/unread")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long matchId) {
        Long count = messageService.getUnreadCount(matchId);
        return ResponseEntity.ok(count);
    }
}