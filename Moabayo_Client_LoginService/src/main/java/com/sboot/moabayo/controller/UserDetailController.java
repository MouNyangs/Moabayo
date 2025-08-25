package com.sboot.moabayo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.service.UserDetailService;
import com.sboot.moabayo.vo.UserDetailVO;

@RestController
@RequestMapping("/api/userdetail")
public class UserDetailController {
	private UserDetailService udserv;
	
    @GetMapping("/{loginId}/detail")
    public ResponseEntity<?> getUserDetail(@PathVariable String loginId) {
        if (loginId == null || loginId.isBlank()) {
            return ResponseEntity.badRequest().body("loginId is required");
        }

        UserDetailVO vo = udserv.findUserDetailByLoginId(loginId);
        if (vo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found: " + loginId);
        }
        return ResponseEntity.ok(vo);
    }
	
}
