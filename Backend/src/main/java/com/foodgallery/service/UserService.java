package com.foodgallery.service;

import com.foodgallery.User;
import com.foodgallery.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticateUser(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String uid = decodedToken.getUid();
        // Simply verify the token and return the user if exists, let the controller
        // handle creation
        User user = userRepository.findById(uid).orElse(null);
        return user;
    }

    public User getUserByUid(String uid) {
        return userRepository.findById(uid).orElse(null);
    }

    public void createUser(User user) {
        user.setCreatedAt(LocalDateTime.now().toString());
        userRepository.save(user);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public User registerUser(User user) {
        // Add logic to save the user (e.g., hash password if needed)
        return userRepository.save(user);
    }
}