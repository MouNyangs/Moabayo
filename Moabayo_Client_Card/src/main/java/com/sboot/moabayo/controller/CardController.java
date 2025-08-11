package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sboot.moabayo.jwt.CardJwtGenerate;
import com.sboot.moabayo.service.CardProductService;
import com.sboot.moabayo.vo.CardProductVO;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/usercard")
public class CardController {

	private final CardProductService service;
	
    public CardController(CardProductService service) {
        this.service = service;
    }
	
	@GetMapping("/cardList")
	public String showCardList(@RequestParam String token,Model model,HttpSession session) {
		 try {
		    	
		    	// Bearer 접두사 제거
		        if (token.startsWith("Bearer ")) {
		            token = token.substring(7); // "Bearer " 잘라내기
		        }
		        // 토큰 검증
		        Jwts.parserBuilder()
		            .setSigningKey(CardJwtGenerate.getKey())
		            .build()
		            .parseClaimsJws(token);

		        // 검증된 토큰을 세션이나 모델에 저장 (필요시)
		        session.setAttribute("token", token); // 또는 사용자 정보

		        // URL 정리해서 리다이렉트 (토큰 제거)
		        return "redirect:/usercard/toCardList"; // index.html 대신 정제된 주소로 이동
		    } catch (Exception e) {
		        return "redirect:/error";
		    }
//	    List<CardDTO> cardList = cardService.getMyCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    // cardList.html 렌더링
	}
	@GetMapping("/toCardList")
	public String showDashboard() {
	    return "cardList";  // templates/index.html
	}

	
	@GetMapping("/recommendcards")
	public String recommendCards(Model model) {
	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "card-recommendation"; // cardList.html 렌더링
	}
}
