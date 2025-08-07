package com.sboot.moabayo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        // 로그인 서버에 로그인 요청
        ResponseEntity<UserInfoVO> userResponse = loginFeignClient.checkUser(form);

        // 응답 상태 확인
        if (userResponse.getStatusCode() == HttpStatus.OK) {
            // JWT 토큰 헤더에서 꺼내기
            String token = userResponse.getHeaders().getFirst("Authorization");
            System.out.println("✅ 메인 서버가 받은 토큰: " + token);

            if (token != null) {
                // 토큰을 헤더에 담아 프론트로 전달
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", token);

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(userResponse.getBody());
            }
        }

        // 인증 실패
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
