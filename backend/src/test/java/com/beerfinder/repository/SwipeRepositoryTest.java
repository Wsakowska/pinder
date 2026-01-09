package com.beerfinder.repository;

import com.beerfinder.entity.Swipe;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class SwipeRepositoryTest {

    @Autowired
    private SwipeRepository swipeRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = new User();
        userA.setEmail("userA@test.com");
        userA.setPasswordHash("hash");
        entityManager.persist(userA);

        userB = new User();
        userB.setEmail("userB@test.com");
        userB.setPasswordHash("hash");
        entityManager.persist(userB);

        entityManager.flush();
    }

    @Test
    @DisplayName("Should confirm that swipe exists between two users")
    void shouldConfirmExistsBySwiperAndSwiped() {
        // Given
        Swipe swipe = new Swipe();
        swipe.setSwiper(userA);
        swipe.setSwiped(userB);
        swipe.setAction(SwipeAction.LIKE);
        entityManager.persist(swipe);
        entityManager.flush();

        // When
        Boolean exists = swipeRepository.existsBySwiperAndSwiped(userA, userB);
        Boolean notExists = swipeRepository.existsBySwiperAndSwiped(userB, userA);

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should find swipe by swiper, swiped and specific action")
    void shouldFindSwipeByAction() {
        // Given
        Swipe swipe = new Swipe();
        swipe.setSwiper(userA);
        swipe.setSwiped(userB);
        swipe.setAction(SwipeAction.LIKE);
        entityManager.persist(swipe);
        entityManager.flush();

        // When
        Optional<Swipe> found = swipeRepository.findBySwiperAndSwipedAndAction(userA, userB, SwipeAction.LIKE);
        Optional<Swipe> notFound = swipeRepository.findBySwiperAndSwipedAndAction(userA, userB, SwipeAction.PASS);

        // Then
        assertThat(found).isPresent();
        assertThat(notFound).isEmpty();
    }
}