package com.foodgallery.model;

import lombok.Data;

import java.util.List;

@Data
public class FoodPost {
    private String id;
    private String title;
    private String description;
    private List<String> mediaUrls;
    private String category = "POST";
}