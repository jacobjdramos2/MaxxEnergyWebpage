package com.maxxenergywebpage.model;

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

  @Column(name = "email", nullable = false, length = 255)
  private String email;

  // getters & setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
}
