package com.beerfinder.dto;

import com.beerfinder.entity.SwipeAction;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SwipeRequest {

    @NotNull(message = "Swiped user ID is required")
    private Long swipedUserId;

    @NotNull(message = "Action is required")
    private SwipeAction action; //LIKE or PASS
}
