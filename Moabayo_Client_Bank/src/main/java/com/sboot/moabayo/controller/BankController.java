package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.sboot.moabayo.jwt.BankJwtGenerate;
import com.sboot.moabayo.service.AccountService;
import com.sboot.moabayo.service.BankProductService;
import com.sboot.moabayo.service.BankService;
import com.sboot.moabayo.service.TransactionService;
import com.sboot.moabayo.vo.AccountVO;
import com.sboot.moabayo.vo.NyangCoinHistoryVO;
import com.sboot.moabayo.vo.NyangCoinVO;
import com.sboot.moabayo.vo.TxnRowVO;
import com.sboot.moabayo.vo.UserAccountVO;
import com.sboot.moabayo.vo.UserVO;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpSession;

//import com.sboot.moabayo.service.ProductService;
//import com.sboot.moabayo.vo.CardProductVO;

@Controller
@RequestMapping("/bank")
public class BankController {

    // //////////////// 시작 \\\\\\\\\\\\\\\
    
    // \\\\\\\\\\\\\\\\ 종료 ///////////////
	
    private final BankService bankService;
    private final BankProductService bankProductService;
    private final AccountService accountService;
    private final TransactionService transactionService;

    public BankController(
    		BankService bankService, 
    		BankProductService bankProductService,
    		AccountService accountService,
    		TransactionService transactionService) {
        this.bankService = bankService;
        this.bankProductService = bankProductService;
        this.accountService = accountService;
        this.transactionService = transactionService;
    }
	
	@GetMapping("/verify")
	public String handleToken(@RequestParam String token, HttpSession session) {
	    try {
	    	
	    	// Bearer 접두사 제거
	        if (token.startsWith("Bearer ")) {
	            token = token.substring(7); // "Bearer " 잘라내기
	        }
	        
	        // 토큰 검증
	        String loginId = Jwts.parserBuilder()
	            .setSigningKey(BankJwtGenerate.getKey())
	            .build()
	            .parseClaimsJws(token)
	            .getBody()
	            .getSubject();
	        UserVO user = bankService.getUser(loginId);
	        System.out.println("UserVO: " + user.toString());
	        
	        // 검증된 토큰을 세션이나 모델에 저장 (필요시)
	        session.setAttribute("token", token); // 또는 사용자 정보
	        session.setAttribute("loginId", loginId); // 또는 사용자 정보
	        session.setAttribute("userId", user.getUserId());
	        // URL 정리해서 리다이렉트 (토큰 제거)
	        return "redirect:/bank/index"; // index.html
	    } catch (Exception e) {
	    	System.err.println(e);
	    	System.err.println(e.getMessage());
	    	System.err.println(e.getCause());
	        return "redirect:/error";
	    }
	}
	
	@GetMapping("/index")
	public String showBankIndex(
            @SessionAttribute(name = "token",   required = false) String token,
            @SessionAttribute(name = "loginId", required = false) String loginId,
            @SessionAttribute(name = "userId",  required = false) Object userIdObj, // 세션 타입 안전 처리
			Model model) {
        // //////////////// 뱅크 메인 페이지 DB 연결 부분 시작 \\\\\\\\\\\\\\\
        // 세션 체크
        if (userIdObj == null || loginId == null) {
            return "redirect:/loginpage";
        }

        // userId를 Long으로 안전 변환 (세션에 String/Integer/Long 어떤 형태로든 대비)
        Long userId;
        if (userIdObj instanceof Long) {
            userId = (Long) userIdObj;
        } else if (userIdObj instanceof Integer) {
            userId = ((Integer) userIdObj).longValue();
        } else {
            userId = Long.valueOf(userIdObj.toString()); // "123" 형태 처리
        }

        System.out.println("세션 토큰: " + token);
        System.out.println("loginId: " + loginId);
        System.out.println("userId: " + userId);

        model.addAttribute("loginId", loginId);

        // 코인 조회
        NyangCoinVO ncvo = bankService.getNyangCoinByUserId(userId);
        model.addAttribute("NyangCoin", ncvo);
        
        // 히스토리 조회 (페이지는 1-based로 가정)
        
        if (ncvo != null) {
            int page = 1; // 첫 페이지
            int size = 10; // 한 페이지 10개 등
            List<NyangCoinHistoryVO> history = bankService.getHistoryPage(ncvo.getNyangCoinId(), page, size);
            System.out.println("history size: " + history.size());
            System.out.println("coinId = " + ncvo.getNyangCoinId()); // null이면 ①번 확정
            System.out.println("count = " + bankService.countHistory(ncvo.getNyangCoinId()));
            model.addAttribute("NyangCoinHistory", history);
        } else {
            model.addAttribute("NyangCoinHistory", List.of());
        }
        
        // \\\\\\\\\\\\\\\\ 뱅크 메인 페이지 DB 연결 부분 종료 ///////////////
		return "index";
	}
	
	@GetMapping("/account/list")
	public String showAccountList(HttpSession session, Model model) {
		String loginId = (String) session.getAttribute("loginId");
		model.addAttribute("loginId", loginId);
		Long userId = (Long) session.getAttribute("userId");
		
		List<AccountVO> acclist = accountService.getUserAccountsWithHistory(userId);
		System.out.println("acclist: " + acclist.toString());
		
		model.addAttribute("acclist", acclist);
		
		
	    return "account-list"; // accountList.html 렌더링
	}
	
	@GetMapping("/recommend")
	public String recommendAccounts(Model model) {
//	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "recommend"; // cardList.html 렌더링
	}
	
	@GetMapping("/product/list")
	public String bankProduct(Model model) {
		model.addAttribute("products", bankProductService.findAll());
//	    List<CardProductVO> cardList = service.getRecommendCards(); // 카드 리스트 조회
//	    model.addAttribute("cardList", cardList);
	    return "bankProductList"; // cardList.html 렌더링
	}
	
	@GetMapping("/history")
	public String bankhistory(HttpSession session, Model model) {
	    Long userId = (Long) session.getAttribute("userId");
	    List<TxnRowVO> txnlist = transactionService.search(userId);
	    System.out.println(txnlist.toString());
	    model.addAttribute("txnlist", txnlist);
		
		return "transactions";
	}
}
