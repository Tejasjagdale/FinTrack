package com.fintrack.fintrack.service;

import com.fintrack.fintrackmodel.Entity.Users.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService {
    Optional<User> findByEmail(String email);
    Optional<User> findByUser(String user);
    User save(User user);
}
