package com.sboot.moabayo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.feign.LoginFeignClient;
import com.sboot.moabayo.jwt.JwtUtil;
import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginFeignClient loginFeignClient;
    private final JwtUtil jwtUtil;

    public LoginController(LoginFeignClient loginFeignClient, JwtUtil jwtUtil) {
        this.loginFeignClient = loginFeignClient;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginFormVO form) {
        // 1. LoginService에 로그인 검증 요청
        UserInfoVO user = loginFeignClient.checkUser(form);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("❌ 아이디 또는 비밀번호가 틀렸습니다.");
        }

        // 2. JWT 생성
        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        // 3. JWT를 응답 헤더에 포함
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        return ResponseEntity.ok().headers(headers).body(user);
    }
}
