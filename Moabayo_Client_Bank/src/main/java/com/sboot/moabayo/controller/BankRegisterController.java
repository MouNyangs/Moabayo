package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sboot.moabayo.service.AccountBalanceService;
import com.sboot.moabayo.service.AccountService;
import com.sboot.moabayo.service.BankProductService;
import com.sboot.moabayo.service.BankService;
import com.sboot.moabayo.service.KakaoPayService;
import com.sboot.moabayo.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/register")
public class BankRegisterController {

    private final BankService bankService;
    private final BankProductService bankProductService;
    private final AccountService accountService;
    private final AccountBalanceService accBalServ;
    private final TransactionService transactionService;
    private final KakaoPayService kakaoPayService;   // ✅ 추가
	
    @GetMapping("/product")
    public String productDetail(@RequestParam Integer id, Model model) {
        // id로 조회…
    	model.addAttribute("bpDetail", bankProductService.getById(id));
	
		 System.out.println(id); System.out.println(bankProductService.getById(id));
		

        return "bpdetail";
    }
    
    @GetMapping("/apply")
    public String startApply(@RequestParam("productId") Integer productId,
			/*
			 * @RequestParam(required=false) Long amount,
			 * 
			 * @RequestParam(required=false) Integer termMonths,
			 * 
			 * @RequestParam(required=false) BigDecimal taxRate,
			 */
                             Model model) {
    	
    	model.addAttribute("productId", productId);
        // productId로 bank_product 조회 → 모델 세팅
        // amount/termMonths/taxRate 있으면 초기값으로 바인딩
    	
        return "bpregister"; // 가입 위저드 뷰
    }
    
    
}
