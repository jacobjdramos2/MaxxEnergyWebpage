package com.maxxenergywebpage.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(
  name = "users",
  uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "first_name", nullable = false, length = 255)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 255)
  private String lastName;

  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  // Store a BCrypt hash, not the raw password. Length 60 fits BCrypt.
  @JsonIgnore // never serialize to JSON
  @Column(name = "password_hash", nullable = false, length = 60)
  private String passwordHash;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }

  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
