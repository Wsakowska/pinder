package com.beerfinder.repository;

import com.beerfinder.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Should find user by email")
    void shouldFindUserByEmail() {
        // Given
        User user = new User();
        user.setEmail("test@beerfinder.com");
        user.setPasswordHash("hashed_password");
        entityManager.persist(user);
        entityManager.flush();

        // When
        Optional<Optional<User>> found = Optional.ofNullable(userRepository.findByEmail("test@beerfinder.com"));

        // Then
        assertThat(found).isPresent();
        assertThat(userRepository.findByEmail("test@beerfinder.com")).isPresent();
        assertThat(userRepository.findByEmail("test@beerfinder.com").get().getEmail())
                .isEqualTo("test@beerfinder.com");
    }

    @Test
    @DisplayName("Should return true when email exists")
    void shouldConfirmEmailExists() {
        // Given
        User user = new User();
        user.setEmail("exists@beerfinder.com");
        user.setPasswordHash("hashed_password");
        entityManager.persist(user);
        entityManager.flush();

        // When
        Boolean exists = userRepository.existsByEmail("exists@beerfinder.com");
        Boolean doesNotExist = userRepository.existsByEmail("notfound@beerfinder.com");

        // Then
        assertThat(exists).isTrue();
        assertThat(doesNotExist).isFalse();
    }

    @Test
    @DisplayName("Should return empty optional for non-existent email")
    void shouldReturnEmptyForUnknownEmail() {
        // When
        Optional<User> found = userRepository.findByEmail("unknown@test.com");

        // Then
        assertThat(found).isEmpty();
    }
}