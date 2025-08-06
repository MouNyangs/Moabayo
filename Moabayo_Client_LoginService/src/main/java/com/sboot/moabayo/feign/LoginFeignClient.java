package com.sboot.moabayo.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@FeignClient(name = "LoginService") // Eureka에 등록된 spring.application.name
public interface LoginFeignClient {
	
    @PostMapping("/user/validate") // ✅ 실제 LoginService의 컨트롤러 경로에 맞게 수정
    UserInfoVO checkUser(@RequestBody LoginFormVO form);
}
