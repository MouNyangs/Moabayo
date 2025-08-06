package com.sboot.moabayo.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserVO;

//예시로 만든 feign 클라이언트입니다. 참고해서 작성해주세요

@FeignClient(name = "Main") // Eureka에 등록된 서비스 이름
public interface MoabayoClientMain {

	@PostMapping("/api/checkUser")
	UserVO checkUser(@RequestBody LoginFormVO loginFormVO);
}
