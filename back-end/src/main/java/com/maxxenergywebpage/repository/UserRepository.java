package com.maxxenergywebpage.repository;

import com.maxxenergywebpage.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find a user by username
    Optional<User> findByUsername(String username);
    
    // Check if a username exists
    boolean existsByUsername(String username);
    
    // Find users by role
    Iterable<User> findByRole(String role);
}
