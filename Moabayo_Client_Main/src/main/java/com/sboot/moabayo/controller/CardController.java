package com.sboot.moabayo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.sboot.moabayo.feign.CardFeignClient;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class CardController {

    private final CardFeignClient cardFeignClient;

    @GetMapping("/card/verify")
    public ResponseEntity<String> verifyCardAccess(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println("🔑 받은 토큰: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("토큰 없음 또는 잘못된 형식");
        }

        // ✅ FeignClient를 통해 카드 서비스의 verify 호출
        try {
            ResponseEntity<String> response = cardFeignClient.verifyToken(authHeader);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(403).body("인증 실패: " + e.getMessage());
        }
    }
}
