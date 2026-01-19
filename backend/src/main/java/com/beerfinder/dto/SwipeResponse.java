package com.beerfinder.dto;

import com.beerfinder.entity.SwipeAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SwipeResponse {
    private Long swipeId;
    private Long swiperId;
    private Long swipedUserId;
    private SwipeAction action;
    private Boolean isMatch; // true jeśli powstał match
    private Long matchId;    // ID matcha jeśli powstał
    private String message;
}
