package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import ch.qos.logback.core.model.Model;

@Controller
public class CardController {

	
	@GetMapping("/cards")
	public String showCardList(Model model) {
//	    List<CardDTO> cardList = cardService.getMyCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "card/cardList"; // cardList.html 렌더링
	}
	
	@GetMapping("/recommendcards")
	public String showRecommendList(Model model) {
//	    List<CardDTO> cardList = cardService.getMyCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "card/card-recommendation"; // cardList.html 렌더링
	}
}
