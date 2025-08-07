package com.sboot.moabayo.controller;

import com.sboot.moabayo.feign.MoabayoClientMain;
import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserVO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TokenMainController {

    private final MoabayoClientMain moabayoClientMain;

    @PostMapping("/proxy-login") 
    public ResponseEntity<UserVO> login(@RequestBody LoginFormVO form, HttpServletResponse response) {
        ResponseEntity<UserVO> feignResponse = moabayoClientMain.checkUser(form);
        UserVO user = feignResponse.getBody();
        String token = feignResponse.getHeaders().getFirst("Authorization");
        System.out.println(token);
        

        if (user != null && token != null) {
            response.setHeader("Authorization", token);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
