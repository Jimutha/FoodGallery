package com.foodgallery.controller;

import com.foodgallery.User;
import com.foodgallery.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            LOGGER.info("Received signup request for user: " + request.getDisplayName());
            String idToken = request.getIdToken();
            User user = userService.authenticateUser(idToken);
            if (user == null) {
                user = new User();
                user.setUid(FirebaseAuth.getInstance().verifyIdToken(idToken).getUid());
                user.setEmail(FirebaseAuth.getInstance().verifyIdToken(idToken).getEmail());
                userService.createUser(user);
            }

            // Update user with profile image if provided
            String profileImage = request.getProfileImage();
            if (profileImage != null && !profileImage.isEmpty()) {
                LOGGER.info("Profile image provided, length: " + profileImage.length());
                user.setPhotoURL(profileImage);
            } else {
                LOGGER.info("No profile image provided.");
            }
            user.setDisplayName(request.getDisplayName());
            userService.updateUser(user);

            LOGGER.info("User successfully signed up: " + user.getUid());
            return ResponseEntity.ok(user);
        } catch (FirebaseAuthException e) {
            LOGGER.error("Firebase Auth Exception during signup: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Signup failed: " + e.getMessage());
            return ResponseEntity.badRequest().body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LOGGER.info("Received login request");
            String idToken = request.getIdToken();
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            LOGGER.info("User authenticated with UID: " + uid);

            User user = userService.getUserByUid(uid);
            if (user == null) {
                // New user from Google Sign-In, create a new record
                user = new User();
                user.setUid(uid);
                user.setEmail(decodedToken.getEmail());
                user.setDisplayName(decodedToken.getName());
                user.setPhotoURL(decodedToken.getPicture());
                userService.createUser(user);
                LOGGER.info("Created new user record for UID: " + uid);
            }

            // Generate a custom token or session token (here we return the ID token as the
            // session token)
            Map<String, Object> response = new HashMap<>();
            response.put("token", idToken);
            response.put("user", user);

            LOGGER.info("User logged in successfully: " + uid);
            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            LOGGER.error("Firebase Auth Exception during login: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        try {
            LOGGER.info("Received update profile request");
            String idToken = request.getIdToken();
            User user = userService.authenticateUser(idToken);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            user.setDisplayName(request.getDisplayName());
            String profileImage = request.getProfileImage();
            if (profileImage != null && !profileImage.isEmpty()) {
                user.setPhotoURL(profileImage);
            }
            userService.updateUser(user);

            LOGGER.info("Profile updated successfully for user: " + user.getUid());
            return ResponseEntity.ok(user);
        } catch (FirebaseAuthException e) {
            LOGGER.error("Firebase Auth Exception during profile update: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Profile update failed: " + e.getMessage());
            return ResponseEntity.badRequest().body("Profile update failed: " + e.getMessage());
        }
    }
}

class SignupRequest {
    private String idToken;
    private String displayName;
    private String profileImage;

    // Getters and setters
    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}

class LoginRequest {
    private String idToken;

    // Getters and setters
    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}

class UpdateProfileRequest {
    private String idToken;
    private String displayName;
    private String profileImage;

    // Getters and setters
    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}