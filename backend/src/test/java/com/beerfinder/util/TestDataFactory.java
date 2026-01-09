package com.beerfinder.util;

import com.beerfinder.dto.RegisterRequest;
import com.beerfinder.dto.SwipeRequest;
import com.beerfinder.entity.Profile;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;

import java.util.List;

public class TestDataFactory {

    // --- ENTCJE (Entities) ---

    public static User createTestUser(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setPasswordHash("hashed_password");
        return user;
    }

    public static Profile createTestProfile(User user, String name, int age) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setName(name);
        profile.setAge(age);
        profile.setBio("Test bio for " + name);
        profile.setInterests(List.of("Beer", "Code"));
        profile.setLatitude(54.3520); // Domyślnie Gdańsk
        profile.setLongitude(18.6466);
        user.setProfile(profile);
        return profile;
    }

    // --- DTOs ---

    public static RegisterRequest createRegisterRequest(String email) {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword("password123");
        return request;
    }

    public static SwipeRequest createSwipeRequest(Long swipedId, SwipeAction action) {
        SwipeRequest request = new SwipeRequest();
        request.setSwipedUserId(swipedId);
        request.setAction(action);
        return request;
    }
}