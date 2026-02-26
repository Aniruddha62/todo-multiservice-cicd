package com.user.service;
import com.user.model.User;
import com.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already exists: " + user.getEmail());
        return userRepository.save(user);
    }

    public List<User> getAll() { return userRepository.findAll(); }

    public Optional<User> getById(Long id) { return userRepository.findById(id); }

    public User update(Long id, User updated) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setName(updated.getName());
        user.setEmail(updated.getEmail());
        return userRepository.save(user);
    }

    public void delete(Long id) { userRepository.deleteById(id); }
}
