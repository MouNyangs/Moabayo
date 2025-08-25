package com.sboot.moabayo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.service.LoginService;
import com.sboot.moabayo.service.UserDetailService;
import com.sboot.moabayo.vo.UserDetailVO;
import com.sboot.moabayo.vo.UserVO;

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
    
    private PasswordEncoder pwEncoder;
    private LoginService loginServ;
    
    @GetMapping("/pwcheck")
    public ResponseEntity<?> validateUserPassword(
    		@RequestParam String loginId,
    		@RequestParam String insertedPw
    		) {
    	// 1. Request로 날라온 로그인 ID가 있는지 확인.
        if (loginId == null || loginId.isBlank()) {
            return ResponseEntity.badRequest().body("loginId is required");
        }
        // 2. loginId로 유저 조회
        UserVO user = loginServ.login(loginId);
        
        // 3. Request로 날라온 비밀번호와 유저의 비밀번호를 매칭
        //  - 비밀번호가 맞으면 ok 와 함께 "비밀번호 일치" 리턴
        //	- 비밀번호가 틀리면 ok 와 함께 "비밀번호 불일치" 리턴
        if (user != null && pwEncoder.matches(insertedPw, user.getPassword())) {
        	return ResponseEntity.ok("비밀번호 일치");
        } else {
        	return ResponseEntity.ok("비밀번호 불일치");
        }
    }
	
}
