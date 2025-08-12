package com.sboot.moabayo.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sboot.moabayo.service.ImageService;

//__Cloudinary__ Controller
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class CloudinaryUploaderController {

    private final ImageService imageService;

    /** multipart/form-data 로 업로드 */
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<UploadResponse> upload(@RequestPart("file") MultipartFile file) throws Exception {
        String url = imageService.upload(file);
        UploadResponse resp = new UploadResponse();
        resp.setUrl(url);
        return ResponseEntity.ok(resp);
    }

    @Data
    static class UploadResponse {
        private String url;
    }
//		TODO: Cloudinary에 올라간 이미지 보는건 아직 구현중....    
    @GetMapping("/list")
    public ResponseEntity<List<ImageInfo>> listImages() throws Exception {
        List<ImageInfo> images = imageService.listImages();
        return ResponseEntity.ok(images);
    }

    @Data
    @AllArgsConstructor
    public static class ImageInfo {
        private String publicId;
        private String url;
    }
}
