//package com.sboot.moabayo.feign;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
//import com.sboot.moabayo.vo.LoginFormVO;
//import com.sboot.moabayo.vo.UserVO;
//
//@FeignClient(name = "LoginService") // Eureka에 등록된 spring.application.name
//public interface LoginFeignClient {
//	
//
//    @PostMapping("/api/login")
//    ResponseEntity<UserVO> checkUser(@RequestBody LoginFormVO loginFormVO);
//}
