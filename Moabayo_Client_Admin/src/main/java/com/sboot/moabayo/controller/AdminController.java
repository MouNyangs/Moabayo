package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

	@GetMapping("/cusumer")
	public String handleToken(@RequestParam String token, HttpSession session) {
	    try {
	    	
	    	// Bearer 접두사 제거
	        if (token.startsWith("Bearer ")) {
	            token = token.substring(7); // "Bearer " 잘라내기
	        }
	        // 토큰 검증
	        Jwts.parserBuilder()
	            .setSigningKey(AdminJwtGenerate.getKey())
	            .build()
	            .parseClaimsJws(token);

	        // 검증된 토큰을 세션이나 모델에 저장 (필요시)
	        session.setAttribute("token", token); // 또는 사용자 정보

	        // URL 정리해서 리다이렉트 (토큰 제거)
	        return "redirect:/admin/dashboard"; // index.html 대신 정제된 주소로 이동
	    } catch (Exception e) {
	        return "redirect:/error";
	    }
	}
	
	@GetMapping("/dashboard")
	public String showDashboard() {
	    return "index";  // templates/index.html
	}



}
