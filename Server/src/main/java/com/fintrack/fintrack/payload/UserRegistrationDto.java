package com.fintrack.fintrack.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationDto {
    @NotBlank(message = "Name must not be empty")
    private String name;
    @NotBlank(message = "EmailId must not be empty")
    private String emailId;
    @NotBlank(message = "Password must not be empty")
    private String password;
    String role;
}
