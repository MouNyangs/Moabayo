package com.sboot.moabayo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.jwt.JwtGenerate;
import com.sboot.moabayo.service.LoginService;
import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;
import com.sboot.moabayo.vo.UserVO;

@RestController
@RequestMapping("/user")
public class LoginCheckController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<UserInfoVO> validate(@RequestBody LoginFormVO form) {

        // 1. 로그인 시도한 아이디로 DB 조회
        UserVO user = loginService.login(form.getId());

        // 2. 사용자 존재 여부 확인
        if (user != null && user.getPassword().equals(form.getPw())) {

            // 3. JWT 발급
            String token = JwtGenerate.createToken(user.getLoginId());
            String refreshToken = JwtGenerate.createRefreshToken(user.getLoginId());

            // 4. 응답 헤더에 JWT 포함
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            headers.set("Refresh-Token", refreshToken);

            // 5. 사용자 정보 구성 후 응답
            UserInfoVO userInfo = new UserInfoVO(user.getLoginId(), user.getName(), user.getIsAdmin());

            return ResponseEntity.ok().headers(headers).body(userInfo);
        }

        // 6. 로그인 실패
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
