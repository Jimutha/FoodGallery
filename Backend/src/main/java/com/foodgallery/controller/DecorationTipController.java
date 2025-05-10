package com.foodgallery.controller;

import com.foodgallery.model.DecorationTip;
import com.foodgallery.service.DecorationTipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/decoration-tips")
@CrossOrigin(origins = "http://localhost:3000")
public class DecorationTipController {

    @Autowired
    private DecorationTipService service;

    @PostMapping
    public ResponseEntity<DecorationTip> createTip(@RequestBody DecorationTip tip) throws ExecutionException, InterruptedException {
        DecorationTip savedTip = service.createTip(tip);
        return ResponseEntity.ok(savedTip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DecorationTip> updateTip(@PathVariable String id, @RequestBody DecorationTip tip) throws ExecutionException, InterruptedException {
        DecorationTip updatedTip = service.updateTip(id, tip);
        return ResponseEntity.ok(updatedTip);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DecorationTip> getTipById(@PathVariable String id) throws ExecutionException, InterruptedException {
        DecorationTip tip = service.getTipById(id);
        if (tip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tip);
    }

    @GetMapping
    public ResponseEntity<List<DecorationTip>> getAllTips() throws ExecutionException, InterruptedException {
        List<DecorationTip> tips = service.getAllTips();
        return ResponseEntity.ok(tips);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DecorationTip>> getTipsByCategory(@PathVariable String category) throws ExecutionException, InterruptedException {
        List<DecorationTip> tips = service.getTipsByCategory(category);
        return ResponseEntity.ok(tips);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTip(@PathVariable String id) throws ExecutionException, InterruptedException {
        service.deleteTip(id);
        return ResponseEntity.noContent().build();
    }
}