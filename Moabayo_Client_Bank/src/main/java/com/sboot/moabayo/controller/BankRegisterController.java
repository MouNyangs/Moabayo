package com.sboot.moabayo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sboot.moabayo.service.AccountBalanceService;
import com.sboot.moabayo.service.AccountService;
import com.sboot.moabayo.service.BankProductService;
import com.sboot.moabayo.service.BankService;
import com.sboot.moabayo.service.KakaoPayService;
import com.sboot.moabayo.service.TransactionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
	
		/*
		 * System.out.println(id); System.out.println(bankProductService.getById(id));
		 */
		

        return "bpdetail";
    }
    
    // 상세 → 가입 페이지
    @GetMapping("/apply")
    public String startApply(
    		@RequestParam("productId") Integer productId, 
    		HttpServletRequest request,
    		HttpSession Session,
    		Model model
    		) {
        // productId로 bank_product 조회 → 모델 세팅
        // amount/termMonths/taxRate 있으면 초기값으로 바인딩

    	String loginId = (String) Session.getAttribute("loginId");
    	model.addAttribute("account", bankService.getUser(loginId));
    	model.addAttribute("bpDetail", bankProductService.getById(productId));
    	model.addAttribute("loginId", loginId);
        return "bpregister"; // 가입 위저드 뷰
    }
    
    // 계좌 목록(드롭다운)
    @ResponseBody
    @GetMapping("/api/accounts")
    public List<Map<String,Object>> myAccounts(HttpServletRequest req, HttpSession session){
      Long userId = currentUserId(session);
      return accountMapper.findSimpleAccountsByUserId(userId);
    }
    
    
}
