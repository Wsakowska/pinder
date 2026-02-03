package com.beerfinder.controller;

import com.beerfinder.dto.ChatMessage;
import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.dto.TypingIndicator;
import com.beerfinder.entity.User;
import com.beerfinder.exception.BadRequestException;
import com.beerfinder.exception.ResourceNotFoundException;
import com.beerfinder.repository.UserRepository;
import com.beerfinder.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatWebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketController.class);

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public ChatWebSocketController(MessageService messageService,
                                   SimpMessagingTemplate messagingTemplate,
                                   UserRepository userRepository) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{matchId}")
    public void sendMessage(@DestinationVariable Long matchId, @Payload Map<String, Object> payload) {
        try {
            // Extract content from payload
            String content = (String) payload.get("content");

            if (content == null || content.trim().isEmpty()) {
                logger.error("Empty message content");
                return;
            }

            logger.info("Received WebSocket message for match {}: {}", matchId, content);

            // Try to get user from security context (may be null for WebSocket)
            User currentUser = getCurrentUserOrNull();

            if (currentUser == null) {
                logger.warn("No authenticated user in SecurityContext, checking payload for senderId");
                // Fallback: get senderId from payload
                Object senderIdObj = payload.get("senderId");
                if (senderIdObj != null) {
                    Long senderId = ((Number) senderIdObj).longValue();
                    currentUser = userRepository.findById(senderId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));
                    logger.info("Found user from payload: {}", senderId);
                } else {
                    logger.error("No senderId in payload and no authenticated user");
                    return;
                }
            }

            // Create and save message
            MessageRequest request = new MessageRequest();
            request.setMatchId(matchId);
            request.setContent(content.trim());

            // Temporarily set authentication for MessageService
            setAuthenticationForUser(currentUser);
            MessageResponse savedMessage = messageService.sendMessage(request);

            logger.info("Saved message with ID: {}", savedMessage.getId());

            // Create ChatMessage for broadcast
            ChatMessage chatMessage = new ChatMessage(
                    savedMessage.getId(),
                    savedMessage.getMatchId(),
                    savedMessage.getSenderId(),
                    savedMessage.getSenderName(),
                    savedMessage.getContent(),
                    savedMessage.getCreatedAt()
            );

            // Broadcast to all subscribers
            String destination = "/topic/matches/" + matchId;
            logger.info("Broadcasting message to: {}", destination);
            messagingTemplate.convertAndSend(destination, chatMessage);
            logger.info("Message broadcast successful");

        } catch (Exception e) {
            logger.error("Error processing WebSocket message: ", e);
        }
    }

    /**
     * Handle typing indicators
     * Client sends: /app/typing/{matchId}
     * Server broadcasts: /topic/matches/{matchId}/typing
     */
    @MessageMapping("/typing/{matchId}")
    public void handleTyping(@DestinationVariable Long matchId, @Payload Map<String, Object> payload) {
        try {
            logger.info("Received typing indicator for match {}", matchId);

            // Extract data from payload
            Object userIdObj = payload.get("userId");
            String userName = (String) payload.get("userName");
            Object isTypingObj = payload.get("isTyping");

            if (userIdObj == null || userName == null || isTypingObj == null) {
                logger.warn("Invalid typing indicator payload");
                return;
            }

            Long userId = ((Number) userIdObj).longValue();
            Boolean isTyping = (Boolean) isTypingObj;

            // Create typing indicator
            TypingIndicator indicator = new TypingIndicator(matchId, userId, userName, isTyping);

            // Broadcast to all subscribers of this match
            String destination = "/topic/matches/" + matchId + "/typing";
            messagingTemplate.convertAndSend(destination, indicator);

            logger.info("Typing indicator broadcast to {}: user {} is {}",
                    destination, userName, isTyping ? "typing" : "stopped typing");

        } catch (Exception e) {
            logger.error("Error handling typing indicator: ", e);
        }
    }

    private User getCurrentUserOrNull() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return null;
            }
            String email = auth.getName();
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            logger.debug("Could not get user from SecurityContext: {}", e.getMessage());
            return null;
        }
    }

    private void setAuthenticationForUser(User user) {
        // This is a simplified approach - for production use proper authentication
        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        "",
                        java.util.Collections.emptyList()
                );

        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        principal, null, java.util.Collections.emptyList()
                );

        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}