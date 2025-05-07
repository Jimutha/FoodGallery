package com.foodgallery.service;

import com.foodgallery.model.DecorationTip;
import com.foodgallery.repository.DecorationTipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class DecorationTipService {

    @Autowired
    private DecorationTipRepository repository;

    public DecorationTip createTip(DecorationTip tip) throws ExecutionException, InterruptedException {
        return repository.save(tip);
    }

    public DecorationTip updateTip(String id, DecorationTip tip) throws ExecutionException, InterruptedException {
        tip.setId(id);
        return repository.save(tip);
    }

    public DecorationTip getTipById(String id) throws ExecutionException, InterruptedException {
        return repository.findById(id);
    }

    public List<DecorationTip> getAllTips() throws ExecutionException, InterruptedException {
        return repository.findAll();
    }

    public List<DecorationTip> getTipsByCategory(String category) throws ExecutionException, InterruptedException {
        return repository.findByCategory(category);
    }

    public void deleteTip(String id) throws ExecutionException, InterruptedException {
        repository.delete(id);
    }
}