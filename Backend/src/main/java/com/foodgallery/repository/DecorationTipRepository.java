package com.foodgallery.repository;

import com.foodgallery.model.DecorationTip;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public class DecorationTipRepository {

    private final Firestore firestore = FirestoreClient.getFirestore();
    private static final String COLLECTION_NAME = "decoration-tips";

    public DecorationTip save(DecorationTip tip) throws ExecutionException, InterruptedException {
        if (tip.getId() == null || tip.getId().isEmpty()) {
            String id = firestore.collection(COLLECTION_NAME).document().getId();
            tip.setId(id);
        }
        firestore.collection(COLLECTION_NAME).document(tip.getId()).set(tip).get();
        return tip;
    }

    public DecorationTip findById(String id) throws ExecutionException, InterruptedException {
        return firestore.collection(COLLECTION_NAME)
                .document(id)
                .get()
                .get()
                .toObject(DecorationTip.class);
    }

    public List<DecorationTip> findAll() throws ExecutionException, InterruptedException {
        List<DecorationTip> tips = new ArrayList<>();
        for (QueryDocumentSnapshot document : firestore.collection(COLLECTION_NAME).get().get().getDocuments()) {
            tips.add(document.toObject(DecorationTip.class));
        }
        return tips;
    }

    public List<DecorationTip> findByCategory(String category) throws ExecutionException, InterruptedException {
        List<DecorationTip> tips = new ArrayList<>();
        for (QueryDocumentSnapshot document : firestore.collection(COLLECTION_NAME)
                .whereEqualTo("category", category)
                .get()
                .get()
                .getDocuments()) {
            tips.add(document.toObject(DecorationTip.class));
        }
        return tips;
    }

    public void delete(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION_NAME).document(id).delete().get();
    }
}