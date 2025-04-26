package com.foodgallery.service;

import com.foodgallery.model.FoodPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodPostService {

    @Autowired
    private FirebaseService firebaseService;

    public FoodPost createPost(FoodPost foodPost) {
        return firebaseService.createPost(foodPost);
    }

    public List<FoodPost> getPostsByCategory(String category) {
        return firebaseService.getPostsByCategory(category);
    }

    public FoodPost getPostById(String id) {
        return firebaseService.getPostById(id);
    }

    public void deletePost(String id) {
        firebaseService.deletePost(id);
    }
}