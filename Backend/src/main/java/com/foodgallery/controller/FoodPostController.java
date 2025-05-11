package com.foodgallery.controller;

import com.foodgallery.model.FoodPost;
import com.foodgallery.service.FoodPostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodPostController {

    private static final Logger logger = LoggerFactory.getLogger(FoodPostController.class);

    @Autowired
    private FoodPostService foodPostService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<FoodPost> createPost(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) MultipartFile[] media) {
        logger.info("Received POST request: title={}, description={}, media count={}",
                title, description, media != null ? media.length : 0);

        if (title == null || title.trim().isEmpty()) {
            logger.error("Title is required");
            return ResponseEntity.badRequest().body(null);
        }
        if (description == null || description.trim().isEmpty()) {
            logger.error("Description is required");
            return ResponseEntity.badRequest().body(null);
        }

        FoodPost foodPost = new FoodPost();
        foodPost.setTitle(title);
        foodPost.setDescription(description);

        List<String> mediaBase64Strings = Collections.emptyList();
        if (media != null && media.length > 0) {
            mediaBase64Strings = new ArrayList<>();
            for (MultipartFile file : media) {
                try {
                    String contentType = file.getContentType();
                    String base64String = Base64.getEncoder().encodeToString(file.getBytes());
                    String base64DataUri = String.format("data:%s;base64,%s", contentType, base64String);
                    mediaBase64Strings.add(base64DataUri);
                } catch (Exception e) {
                    logger.error("Failed to process media file: {}", file.getOriginalFilename(), e);
                    return ResponseEntity.badRequest().body(null);
                }
            }
        } else {
            logger.warn("No media files provided; proceeding without media");
        }
        foodPost.setMediaUrls(mediaBase64Strings);

        FoodPost savedPost = foodPostService.createPost(foodPost);
        logger.info("Post created successfully: id={}", savedPost.getId());
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<FoodPost> updatePost(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "media", required = false) MultipartFile[] media) {
        logger.info("Received PUT request for post id={}: title={}, description={}, media count={}",
                id, title, description, media != null ? media.length : 0);

        if (title == null || title.trim().isEmpty()) {
            logger.error("Title is required");
            return ResponseEntity.badRequest().body(null);
        }
        if (description == null || description.trim().isEmpty()) {
            logger.error("Description is required");
            return ResponseEntity.badRequest().body(null);
        }

        FoodPost existingPost = foodPostService.getPostById(id);
        if (existingPost == null) {
            logger.error("Post with id={} not found", id);
            return ResponseEntity.notFound().build();
        }

        existingPost.setTitle(title);
        existingPost.setDescription(description);

        List<String> mediaBase64Strings = existingPost.getMediaUrls();
        if (media != null && media.length > 0) {
            mediaBase64Strings = new ArrayList<>();
            for (MultipartFile file : media) {
                try {
                    String contentType = file.getContentType();
                    String base64String = Base64.getEncoder().encodeToString(file.getBytes());
                    String base64DataUri = String.format("data:%s;base64,%s", contentType, base64String);
                    mediaBase64Strings.add(base64DataUri);
                } catch (Exception e) {
                    logger.error("Failed to process media file: {}", file.getOriginalFilename(), e);
                    return ResponseEntity.badRequest().body(null);
                }
            }
        }
        existingPost.setMediaUrls(mediaBase64Strings);
        existingPost.setId(id); // Ensure the ID is set for the update

        try {
            FoodPost updatedPost = foodPostService.createPost(existingPost);
            logger.info("Post updated successfully: id={}", updatedPost.getId());
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            logger.error("Failed to update post id={} due to: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodPost>> getPostsByCategory(@PathVariable String category) {
        logger.info("Fetching posts for category: {}", category);
        List<FoodPost> posts = foodPostService.getPostsByCategory(category);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodPost> getPostById(@PathVariable String id) {
        logger.info("Fetching post with id: {}", id);
        FoodPost post = foodPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        logger.info("Deleting post with id: {}", id);
        foodPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}