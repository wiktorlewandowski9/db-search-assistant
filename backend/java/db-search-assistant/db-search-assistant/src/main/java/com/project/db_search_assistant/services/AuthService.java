package com.project.db_search_assistant.services;

import com.project.db_search_assistant.models.User;
import com.project.db_search_assistant.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public boolean validateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent() && BCrypt.checkpw(password, user.get().getPassword());
    }
}
