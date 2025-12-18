package com.beerfinder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private Long messageId;
    private Long matchId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;
    private MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    // Konstruktor dla wiadomości CHAT
    public ChatMessage(Long messageId, Long matchId, Long senderId, String senderName, String content, LocalDateTime timestamp) {
        this.messageId = messageId;
        this.matchId = matchId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.timestamp = timestamp;
        this.type = MessageType.CHAT;
    }
}