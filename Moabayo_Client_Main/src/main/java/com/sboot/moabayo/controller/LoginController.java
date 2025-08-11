package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.feign.LoginFeignClient;
import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@RestController
@RequestMapping("/user")
public class LoginController {

    private final LoginFeignClient loginFeignClient;

    public LoginController(LoginFeignClient loginFeignClient) {
        this.loginFeignClient = loginFeignClient;
    }

    @PostMapping("/validate")
    public ResponseEntity<UserInfoVO> login(@RequestBody LoginFormVO form) {
        // 🔐 로그인 서버에 로그인 요청
        ResponseEntity<UserInfoVO> userResponse = loginFeignClient.checkUser(form);

        // ✅ 응답 상태 확인
        if (userResponse.getStatusCode() == HttpStatus.OK) {
            // ✅ JWT 토큰 헤더에서 꺼내기
            String token = userResponse.getHeaders().getFirst("Authorization");

            if (token != null) {
                // ✅ 토큰을 헤더에 담아 프론트로 전달
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", token);  // 필수
                headers.setAccessControlExposeHeaders(List.of("Authorization", "Refresh-Token"));
                return ResponseEntity
                        .status(userResponse.getStatusCode()) // ✅ 수정
                        .headers(headers)
                        .body(userResponse.getBody());
            }
        }

        // ❌ 인증 실패 시
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
