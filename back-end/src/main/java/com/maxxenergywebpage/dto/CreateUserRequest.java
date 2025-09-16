package com.maxxenergywebpage.dto;

public record CreateUserRequest(
  @jakarta.validation.constraints.NotBlank String firstName,
  @jakarta.validation.constraints.NotBlank String lastName,
  @jakarta.validation.constraints.Email     String email,
  @jakarta.validation.constraints.NotBlank String password
) {}
