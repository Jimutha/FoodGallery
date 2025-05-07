package com.foodgallery;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data // Lombok annotation to generate getters, setters, toString, etc.
public class User {

    @Id
    private String uid; // Firebase UID

    private String email;
    private String displayName;
    private String photoURL; // Stores base64 image
    private String createdAt;

    // Explicitly define getId() for compatibility with UserService
    public String getId() {
        return uid;
    }
}