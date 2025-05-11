package com.foodgallery.service;

import com.foodgallery.model.FoodPost;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class FirebaseService {

    private final DatabaseReference databaseReference;

    public FirebaseService() {
        databaseReference = FirebaseDatabase.getInstance().getReference("posts");
    }

    public FoodPost createPost(FoodPost foodPost) {
        CompletableFuture<FoodPost> future = new CompletableFuture<>();

        if (foodPost.getId() == null) {
            String id = databaseReference.push().getKey();
            foodPost.setId(id);
        }

        databaseReference.child(foodPost.getId()).setValue(foodPost, (error, ref) -> {
            if (error != null) {
                future.completeExceptionally(new RuntimeException("Failed to save post: " + error.getMessage()));
            } else {
                // Add a small delay to ensure data is synced
                try {
                    Thread.sleep(500); // 500ms delay
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                future.complete(foodPost);
            }
        });

        try {
            return future.get(5, TimeUnit.SECONDS); // Timeout after 5 seconds
        } catch (Exception e) {
            throw new RuntimeException("Error saving post: Timeout or " + e.getMessage(), e);
        }
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
                            if (post != null) {
                                post.setId(dataSnapshot.getKey());
                                posts.add(post);
                            }
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
                    post.setId(snapshot.getKey());
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