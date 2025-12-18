package com.beerfinder.dto;

import com.beerfinder.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private Long id;
    private Long matchId;
    private Long senderId;
    private String senderName;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static MessageResponse fromEntity(Message message) {
        if (message == null) {
            return null;
        }

        String senderName = message.getSender().getProfile() != null
                ? message.getSender().getProfile().getName()
                : message.getSender().getEmail();

        return new MessageResponse(
                message.getId(),
                message.getMatch().getId(),
                message.getSender().getId(),
                senderName,
                message.getContent(),
                message.getIsRead(),
                message.getCreatedAt()
        );
    }
}