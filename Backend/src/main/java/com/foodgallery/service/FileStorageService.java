package com.foodgallery.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    public List<String> storeFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        Bucket bucket = StorageClient.getInstance().bucket();

        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            try {
                Blob blob = bucket.create(fileName, file.getInputStream(), file.getContentType());
                String fileUrl = blob.getMediaLink();
                fileUrls.add(fileUrl);
            } catch (IOException e) {
                throw new RuntimeException("Could not store file " + fileName, e);
            }
        }
        return fileUrls;
    }
}