package com.sboot.moabayo.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController	
@RequestMapping("/recommend")
public class RecommendController {

    @GetMapping("/summary")
    public ResponseEntity<Resource> getSummary() throws IOException {
        Path path = Paths.get("src/main/resources/static/csv/ml_out/summary.json");
        Resource resource = new FileSystemResource(path.toFile());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(resource);
    }
}
