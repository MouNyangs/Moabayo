package com.sboot.moabayo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secure")
public class CardController {

    @GetMapping("/verify")
    public ResponseEntity<String> renderPage(@RequestHeader("Authorization") String token) {
        // 👉 여기서 JWT 필터가 선검증 or 아래에서 직접 검증

        // ✅ 검증 성공 시: JSP or HTML 직접 문자열로 반환
        String html = """
            <!DOCTYPE html>
            <html lang="ko">
            <head><meta charset="UTF-8"><title>카드 서비스</title></head>
            <body>
                <h1>환영합니다! 카드 서비스 페이지입니다.</h1>
                <p>인증된 사용자만 볼 수 있는 내용입니다.</p>
            </body>
            </html>
        """;

        return ResponseEntity.ok(html);
    }
}
