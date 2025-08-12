package com.maxxenergywebpage.controller;

import com.maxxenergywebpage.dto.CreateUserRequest;
import com.maxxenergywebpage.dto.UpdateUserRequest;
import com.maxxenergywebpage.model.User;
import com.maxxenergywebpage.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

  private final UserRepository repo;

  public UserController(UserRepository repo) {
    this.repo = repo;
  }

  @PostMapping
  public ResponseEntity<User> create(@Valid @RequestBody CreateUserRequest req) {
    String normalizedEmail = req.email().strip().toLowerCase();
    if (repo.existsByEmailIgnoreCase(normalizedEmail)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }
    User u = new User();
    u.setFirstName(req.firstName().strip());
    u.setLastName(req.lastName().strip());
    u.setEmail(normalizedEmail);
    User saved = repo.save(u);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  @GetMapping
  public List<User> getAll() {
    return repo.findAll();
  }

  // ✅ GET by id with no-store to avoid stale caches
  @GetMapping("/{id}")
  public ResponseEntity<User> getOne(@PathVariable Long id) {
    User u = repo.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(u);
  }

  // ✅ Search used by your LoginPage (firstName + email)
  @GetMapping("/search")
  public ResponseEntity<User> search(
      @RequestParam String firstName,
      @RequestParam String email
  ) {
    String fn = firstName.strip();
    String em = email.strip().toLowerCase();
    return repo.findByFirstNameIgnoreCaseAndEmailIgnoreCase(fn, em)
        .map(u -> ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(u))
        .orElse(ResponseEntity.notFound().build());
  }

  // ✅ Update and return the saved entity (so the UI can use it immediately)
  @PutMapping("/{id}")
  public ResponseEntity<User> update(
      @PathVariable Long id,
      @Valid @RequestBody UpdateUserRequest req
  ) {
    User u = repo.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    String newFirst = req.firstName().strip();
    String newLast  = req.lastName().strip();
    String newEmail = req.email().strip().toLowerCase();

    if (repo.existsByEmailIgnoreCaseAndIdNot(newEmail, id)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
    }

    u.setFirstName(newFirst);
    u.setLastName(newLast);
    u.setEmail(newEmail);

    User saved = repo.save(u);
    return ResponseEntity.ok(saved);
  }
}
