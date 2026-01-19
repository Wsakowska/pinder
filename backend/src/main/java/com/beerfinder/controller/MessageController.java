package com.beerfinder.controller;

import com.beerfinder.dto.MessageRequest;
import com.beerfinder.dto.MessageResponse;
import com.beerfinder.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages", description = "Chat messaging between matched users")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @Operation(
            summary = "Send a message",
            description = "Send a message to a matched user within a specific match"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Message sent successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request - not part of match or inactive match"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Match not found")
    })
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Get chat history",
            description = "Retrieves all messages for a specific match, ordered by time. Also marks unread messages as read."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Chat history retrieved successfully",
                    content = @Content(schema = @Schema(implementation = MessageResponse.class))
            ),
            @ApiResponse(responseCode = "400", description = "Not part of this match"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Match not found")
    })
    @GetMapping("/{matchId}")
    public ResponseEntity<List<MessageResponse>> getChatHistory(
            @Parameter(description = "ID of the match to get messages from")
            @PathVariable Long matchId) {
        List<MessageResponse> messages = messageService.getChatHistory(matchId);
        return ResponseEntity.ok(messages);
    }

    @Operation(
            summary = "Get unread message count",
            description = "Returns the number of unread messages for the user in a specific match"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Match not found")
    })
    @GetMapping("/{matchId}/unread")
    public ResponseEntity<Long> getUnreadCount(
            @Parameter(description = "ID of the match to count unread messages")
            @PathVariable Long matchId) {
        Long count = messageService.getUnreadCount(matchId);
        return ResponseEntity.ok(count);
    }
}