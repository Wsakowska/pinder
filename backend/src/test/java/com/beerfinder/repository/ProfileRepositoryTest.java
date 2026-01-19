package com.beerfinder.repository;

import com.beerfinder.entity.Profile;
import com.beerfinder.entity.Swipe;
import com.beerfinder.entity.SwipeAction;
import com.beerfinder.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ProfileRepositoryTest {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User currentUser;
    private User otherUser;

    @BeforeEach
    void setUp() {
        // Czyścimy dane przed każdym testem
        entityManager.getEntityManager().createQuery("DELETE FROM Swipe").executeUpdate();
        entityManager.getEntityManager().createQuery("DELETE FROM Profile").executeUpdate();
        entityManager.getEntityManager().createQuery("DELETE FROM User").executeUpdate();

        currentUser = new User();
        currentUser.setEmail("me@test.com");
        // Poprawione: w README miałeś password_hash, więc zakładam setPasswordHash
        currentUser.setPasswordHash("encoded_password");
        entityManager.persist(currentUser);

        otherUser = new User();
        otherUser.setEmail("other@test.com");
        otherUser.setPasswordHash("encoded_password");
        entityManager.persist(otherUser);

        Profile myProfile = new Profile();
        myProfile.setUser(currentUser);
        myProfile.setName("Me");
        myProfile.setAge(25);
        entityManager.persist(myProfile);

        Profile otherProfile = new Profile();
        otherProfile.setUser(otherUser);
        otherProfile.setName("Someone Else");
        otherProfile.setAge(30);
        entityManager.persist(otherProfile);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    @DisplayName("Should find profile by user")
    void shouldFindProfileByUser() {
        Optional<Profile> found = profileRepository.findByUser(currentUser);
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Me");
    }

    @Test
    @DisplayName("Should return profiles that were not swiped yet")
    void shouldFindDiscoverProfiles() {
        List<Profile> discover = profileRepository.findDiscoverProfiles(currentUser);

        assertThat(discover).hasSize(1);
        assertThat(discover.get(0).getUser().getEmail()).isEqualTo("other@test.com");
    }

    @Test
    @DisplayName("Should not return already swiped profiles")
    void shouldExcludeSwipedProfiles() {
        Swipe swipe = new Swipe();
        swipe.setSwiper(currentUser);
        swipe.setSwiped(otherUser);
        swipe.setAction(SwipeAction.LIKE);
        entityManager.persist(swipe);
        entityManager.flush();

        List<Profile> discover = profileRepository.findDiscoverProfiles(currentUser);

        assertThat(discover).isEmpty();
    }

    @Test
    @DisplayName("Should return profiles when they match age filters")
    void shouldIncludeProfilesWithinAgeRange() {
        List<Profile> discover = profileRepository.findDiscoverProfilesWithFilters(currentUser, 28, 32);

        assertThat(discover).hasSize(1);
        assertThat(discover.get(0).getAge()).isEqualTo(30);
    }
}