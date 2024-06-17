package com.fintrack.fintrack.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDto {

    @NotBlank(message = "Username must not be empty")
    private String userName;

    @NotBlank(message = "Password must not be empty")
    private String password;

    private String otp;

}
