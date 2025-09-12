package com.maxxenergywebpage.service;

import com.maxxenergywebpage.model.User;
import com.maxxenergywebpage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    // Database properties pulled from application.properties using @Value annotations
    @Value("${spring.datasource.url:jdbc:mysql://134.209.173.139:3306/maxxenergy?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}")
    private String dbUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:MAXX3NERGY}")
    private String dbPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment; // For dynamically retrieving properties

    @Autowired
    public DataInitializationService(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder,
                                     Environment environment) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.environment = environment;
    }

    @Override
    public void run(String... args) {
        // Log database information dynamically and via @Value annotations
        logDatabaseDetails();

        // Add default users if the repository is empty
        if (userRepository.count() == 0) {
            List<User> defaultUsers = List.of(
                    createUser("engineer1", "engineer1", "ENGINEER"),
                    createUser("admin", "admin123", "ADMIN"),
                    createUser("employee1", "employee1", "EMPLOYEE")
            );

            userRepository.saveAll(defaultUsers);
            System.out.println("Default users inserted into the database successfully!");
        } else {
            System.out.println("Default users already exist in the database.");
        }
    }

    private User createUser(String username, String password, String role) {
        // Create a new User object
        User user = new User(username, passwordEncoder.encode(password), role);
        user.setActive(true); // Default the user to active
        return user;
    }

    private void logDatabaseDetails() {
        // Log @Value-annotated properties
        System.out.println("---- Using @Value Annotations ----");
        System.out.println("spring.datasource.url: " + dbUrl);
        System.out.println("spring.datasource.username: " + dbUsername);
        System.out.println("spring.datasource.password: " +
                (dbPassword.equals("NOT_SET") || dbPassword.isEmpty() ? "Not Set" : "******"));

        // Log properties fetched dynamically with the Environment object
        System.out.println("---- Using Environment Object ----");
        String dynamicUrl = environment.getProperty("spring.datasource.url", "NOT_SET");
        String dynamicUsername = environment.getProperty("spring.datasource.username", "NOT_SET");
        String dynamicPassword = environment.getProperty("spring.datasource.password", "NOT_SET");

        System.out.println("Dynamic spring.datasource.url: " + dynamicUrl);
        System.out.println("Dynamic spring.datasource.username: " + dynamicUsername);
        System.out.println("Dynamic spring.datasource.password: " +
                (dynamicPassword.equals("NOT_SET") || dynamicPassword.isEmpty() ? "Not Set" : "******"));

        // If neither method resolves properties, warn the user
        if (dynamicUrl.equals("NOT_SET") && dbUrl.equals("NOT_SET")) {
            System.out.println("WARNING: Database URL is not configured. Please check application.properties or environment variables!");
        }
    }
}