package com.fintrack.fintrack.service.Impl;

import com.fintrack.fintrack.entity.User;
import com.fintrack.fintrack.repository.UserRepository;
import com.fintrack.fintrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userRepository.findByEmail(email));
    }

    @Override
    public Optional<User> findByUser(String user) {
        return Optional.ofNullable(userRepository.findByUsername(user));
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
