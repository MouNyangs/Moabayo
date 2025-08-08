//
//package com.sboot.moabayo.feign;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestHeader;
//
//
//// Eureka 에 등록된 서버 이름.
//@FeignClient(name = "CARD")
//public interface CardFeignClient {
//
//    // 토큰 인증 요청
//    @GetMapping("/secure/verify")
//    ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String token);
//}
//
//
