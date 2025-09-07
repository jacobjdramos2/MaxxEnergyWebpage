package com.maxxenergywebpage.service;

import com.maxxenergywebpage.model.User;
import com.maxxenergywebpage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only add default users if the repository is empty
        if (userRepository.count() == 0) {
            // Create default users
            createUser("engineer1", "engineer1", "ENGINEER");
            createUser("admin", "admin123", "ADMIN");
            createUser("employee1", "employee1", "EMPLOYEE");

            System.out.println("Default users created successfully!");
        }
    }

    private void createUser(String username, String password, String role) {
        User user = new User(username, passwordEncoder.encode(password), role);
        user.setActive(true);
        userRepository.save(user);
    }
}
