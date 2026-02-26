package com.user;
import com.user.model.User;
import com.user.repository.UserRepository;
import com.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository userRepository;
    @InjectMocks UserService userService;

    @Test void shouldCreateUser() {
        User u = User.builder().name("Alice").email("alice@test.com").build();
        when(userRepository.existsByEmail("alice@test.com")).thenReturn(false);
        when(userRepository.save(u)).thenReturn(u);
        assertEquals("Alice", userService.create(u).getName());
    }

    @Test void shouldThrowIfEmailExists() {
        User u = User.builder().email("exists@test.com").build();
        when(userRepository.existsByEmail("exists@test.com")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> userService.create(u));
    }

    @Test void shouldReturnUserById() {
        User u = User.builder().id(1L).name("Bob").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(u));
        assertTrue(userService.getById(1L).isPresent());
    }

    @Test void shouldDeleteUser() {
        userService.delete(1L);
        verify(userRepository).deleteById(1L);
    }
}
