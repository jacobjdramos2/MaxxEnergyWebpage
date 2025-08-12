package com.maxxenergywebpage.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @Email @NotBlank String email
) {}
