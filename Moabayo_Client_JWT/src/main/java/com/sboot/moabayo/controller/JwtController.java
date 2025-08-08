package com.sboot.moabayo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secure")
public class JwtController {

    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken() {
        // 🔐 이미 CardJwtFilter 통과했기 때문에 여기 도달한 것
        
        return ResponseEntity.ok().build();

    }
}
