package com.beerfinder.controller;

import com.beerfinder.dto.ChatMessage;
import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(MessageService messageService,
                                   SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Obsługuje wiadomości wysyłane przez WebSocket
     * Client wysyła na: /app/chat/{matchId}
     * Server broadcastuje na: /topic/matches/{matchId}
     */
    @MessageMapping("/chat/{matchId}")
    public void sendMessage(@DestinationVariable Long matchId, @Payload MessageRequest request) {
        // Zapisz wiadomość w bazie
        request.setMatchId(matchId);
        MessageResponse savedMessage = messageService.sendMessage(request);

        // Stwórz ChatMessage do wysłania przez WebSocket
        ChatMessage chatMessage = new ChatMessage(
                savedMessage.getId(),
                savedMessage.getMatchId(),
                savedMessage.getSenderId(),
                savedMessage.getSenderName(),
                savedMessage.getContent(),
                savedMessage.getCreatedAt()
        );

        // Wyślij wiadomość do wszystkich subskrybentów tego matcha
        messagingTemplate.convertAndSend("/topic/matches/" + matchId, chatMessage);
    }
}