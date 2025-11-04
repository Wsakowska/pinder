package com.beerfinder.repository;

import com.beerfinder.entity.Swipe;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SwipeRepository extends JpaRepository<Swipe, Long> {

    Boolean existsBySwiperAndSwiped(User swiper, User swiped);

    Optional<Swipe> findBySwiperAndSwipedAndAction(User swiper, User swiped, SwipeAction action);
}