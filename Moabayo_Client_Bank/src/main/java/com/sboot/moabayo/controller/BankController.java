package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sboot.moabayo.jwt.BankJwtGenerate;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpSession;

//import com.sboot.moabayo.service.ProductService;
//import com.sboot.moabayo.vo.CardProductVO;

@Controller
@RequestMapping("/bank")
public class BankController {


	@GetMapping("/verify")
	public String handleToken(@RequestParam String token, HttpSession session) {
	    try {
	    	
	    	// Bearer 접두사 제거
	        if (token.startsWith("Bearer ")) {
	            token = token.substring(7); // "Bearer " 잘라내기
	        }
	        // 토큰 검증
	        Jwts.parserBuilder()
	            .setSigningKey(BankJwtGenerate.getKey())
	            .build()
	            .parseClaimsJws(token);

	        // 검증된 토큰을 세션이나 모델에 저장 (필요시)
	        session.setAttribute("token", token); // 또는 사용자 정보

	        // URL 정리해서 리다이렉트 (토큰 제거)
	        return "redirect:/bank/index"; // index.html
	    } catch (Exception e) {
	        return "redirect:/error";
	    }
	}
	
	@GetMapping("/index")
	public String showBankIndex(Model model) {
		// TODO: do Something index page?
		return "index";
	}
	
	@GetMapping("/account/List")
	public String showAccountList(Model model) {
//	    List<CardDTO> cardList = cardService.getMyCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "accountList"; // cardList.html 렌더링
	}
	
	@GetMapping("/recommend")
	public String recommendAccounts(Model model) {
//	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "recommend"; // cardList.html 렌더링
	}
	
	@GetMapping("/product/list")
	public String bankProduct(Model model) {
//	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "bankProductList"; // cardList.html 렌더링
	}
}
