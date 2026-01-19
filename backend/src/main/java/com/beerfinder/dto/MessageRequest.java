package com.beerfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    @NotNull(message = "Match ID is required")
    private Long matchId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;
}