package com.sboot.moabayo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@RestController
@RequestMapping("/user")
public class LoginCheckController {

    @PostMapping("/validate")
    public UserInfoVO validate(@RequestBody LoginFormVO form) {
        // 예시 하드코딩
        if ("admin".equals(form.getId()) && "1234".equals(form.getPw())) {
            return new UserInfoVO("admin", "ADMIN");
        }
        return null;
    }
}
