package com.foodgallery.service;

import com.foodgallery.model.FoodPost;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;

    public FirebaseService() {
        databaseReference = FirebaseDatabase.getInstance().getReference("posts");
    }

    public FoodPost createPost(FoodPost foodPost) {
        String id = databaseReference.push().getKey();
        foodPost.setId(id);
        databaseReference.child(id).setValueAsync(foodPost);
        return foodPost;
    }

    public List<FoodPost> getPostsByCategory(String category) {
        CompletableFuture<List<FoodPost>> future = new CompletableFuture<>();
        List<FoodPost> posts = new ArrayList<>();

        databaseReference.orderByChild("category").equalTo(category)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot snapshot) {
                        for (DataSnapshot dataSnapshot : snapshot.getChildren()) {
                            FoodPost post = dataSnapshot.getValue(FoodPost.class);
                            posts.add(post);
                        }
                        future.complete(posts);
                    }

                    @Override
                    public void onCancelled(DatabaseError error) {
                        future.completeExceptionally(new RuntimeException("Failed to fetch posts: " + error.getMessage()));
                    }
                });

        try {
            return future.get();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching posts by category", e);
        }
    }

    public FoodPost getPostById(String id) {
        CompletableFuture<FoodPost> future = new CompletableFuture<>();

        databaseReference.child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                FoodPost post = snapshot.getValue(FoodPost.class);
                if (post == null) {
                    future.completeExceptionally(new RuntimeException("Post not found with id: " + id));
                } else {
                    future.complete(post);
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(new RuntimeException("Failed to fetch post: " + error.getMessage()));
            }
        });

        try {
            return future.get();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching post by id", e);
        }
    }

    public void deletePost(String id) {
        CompletableFuture<Void> future = new CompletableFuture<>();

        databaseReference.child(id).removeValue((error, ref) -> {
            if (error != null) {
                future.completeExceptionally(new RuntimeException("Failed to delete post: " + error.getMessage()));
            } else {
                future.complete(null);
            }
        });

        try {
            future.get();
        } catch (Exception e) {
            throw new RuntimeException("Error deleting post", e);
        }
    }
}