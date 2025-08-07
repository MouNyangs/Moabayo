package com.sboot.moabayo.controller;

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
        UserInfoVO user = loginFeignClient.checkUser(form);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
