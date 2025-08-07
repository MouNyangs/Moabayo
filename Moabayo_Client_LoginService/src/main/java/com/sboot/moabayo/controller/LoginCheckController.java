package com.sboot.moabayo.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sboot.moabayo.MoabayoClientLoginServiceApplication;
import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@RestController
@RequestMapping("/user")
public class LoginCheckController {

    private final MoabayoClientLoginServiceApplication moabayoClientLoginServiceApplication;


    LoginCheckController(MoabayoClientLoginServiceApplication moabayoClientLoginServiceApplication) {
        this.moabayoClientLoginServiceApplication = moabayoClientLoginServiceApplication;
    }


	@CrossOrigin(origins = "http://localhost:8812",
			exposedHeaders = "Authorization" )
	@PostMapping("/login")
	public ResponseEntity<UserInfoVO> validate(@RequestBody LoginFormVO form) {
		System.out.println("받은 ID: " + form.getId());
		System.out.println("받은 PW: " + form.getPw());
		
	    if ("admin".equals(form.getId()) && "1234".equals(form.getPw())) {
	        // ✅ 유저 정보 생성
	        UserInfoVO user = new UserInfoVO("admin", "관리자", "ADMIN");

	        // ✅ JWT 토큰 발급
	        String token = JwtUtil.createToken(form.getId());
	        
	        System.out.println(token);

	        // ✅ 토큰을 응답 헤더에 담기
	        HttpHeaders headers = new HttpHeaders();
	        headers.set("Authorization", "Bearer " + token);

	        // ✅ 유저 정보 + 헤더 포함한 응답
	        return ResponseEntity.ok().headers(headers).body(user);
	    }

	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

	}

}
