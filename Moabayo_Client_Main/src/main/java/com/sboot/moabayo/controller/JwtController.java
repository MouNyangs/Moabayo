package com.sboot.moabayo.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.sboot.moabayo.feign.JwtFeignClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class JwtController {

    private final JwtFeignClient jwtFeignClient;

    @GetMapping("/jwt/verify")
    public ResponseEntity<String> verifyCardAccess(HttpServletRequest request, HttpServletResponse response) {
        String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("토큰 없음 또는 잘못된 형식");
        }

        try {
            ResponseEntity<String> feignRes = jwtFeignClient.verifyToken(authHeader);

            // ✅ 검증 OK → 쿠키로 전환
            String rawToken = authHeader.substring("Bearer ".length()).trim();
            ResponseCookie cookie = ResponseCookie.from("ACCESS_TOKEN", rawToken)
                    .httpOnly(true)
                    .secure(false)            // 운영 HTTPS면 true
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(java.time.Duration.ofMinutes(30))
                    .build();
            response.addHeader("Set-Cookie", cookie.toString());

            // ✅ 여기서 단 한 번만 반환
            return ResponseEntity.ok(feignRes.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(403).body("인증 실패: " + e.getMessage());
        }
    }

}
