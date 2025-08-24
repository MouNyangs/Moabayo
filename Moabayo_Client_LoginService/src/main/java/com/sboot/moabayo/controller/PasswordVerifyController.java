package com.sboot.moabayo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.vo.VerifyPasswordRequest;
import com.sboot.moabayo.vo.VerifyPasswordResponse;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class PasswordVerifyController {

    private final PasswordVerifyService passwordVerifyService;

    public PasswordVerifyController(PasswordVerifyService passwordVerifyService) {
        this.passwordVerifyService = passwordVerifyService;
    }

    // 내부검증용 엔드포인트 (Gateway 뒤에서만 접근되도록 제한 권장)
    @PostMapping("/verify-password")
    public VerifyPasswordResponse verify(@RequestBody VerifyPasswordRequest req) {
        boolean ok = passwordVerifyService.verify(req.getUserId(), req.getPassword());
        return VerifyPasswordResponse.of(ok);
    }
}