package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sboot.moabayo.service.CardProductService;
import com.sboot.moabayo.vo.CardProductVO;

@Controller
@RequestMapping("/usercard")
public class CardController {

	private final CardProductService service;
	
    public CardController(CardProductService service) {
        this.service = service;
    }
	
	@GetMapping("cardList")
	public String showCardList(Model model) {
//	    List<CardDTO> cardList = cardService.getMyCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "cardList"; // cardList.html 렌더링
	}
	
	@GetMapping("recommendcards")
	public String recommendCards(Model model) {
	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "card-recommendation"; // cardList.html 렌더링
	}
}
