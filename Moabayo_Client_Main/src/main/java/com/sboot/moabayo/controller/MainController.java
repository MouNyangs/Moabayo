package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sboot.moabayo.service.MypageService;
import com.sboot.moabayo.vo.SummaryVO;

import jakarta.servlet.http.HttpSession;



@Controller
public class MainController {

	private MypageService mypageservice;
	
	@GetMapping("/mainpage")
	public String gomainpage() {
		return "main/mainpage";
	}

	@GetMapping("/loginpage")
	public String gologinpage(Model model) {
		return "login/login";
	}

	@GetMapping("/registerpage")
	public String goregisterpage(Model model) {
		return "login/register";
	}

	@GetMapping("/mypage")
	public String myPage() {
		return "mypage/mypage";
	}
	
	@GetMapping("/mypagesummary")
	@ResponseBody  // JSON으로 리턴
	public SummaryVO getSummary(HttpSession session) {
	    String userId = (String) session.getAttribute("userId");
	    System.out.println("userId=" + userId);

	    SummaryVO vo = new SummaryVO();
	    vo.setAsset(mypageservice.getSumBalance(userId));
	    vo.setAccounts(mypageservice.getAccountCount(userId));
	    vo.setCards(mypageservice.getCardCount(userId));

	    return vo;   // JSON {asset:..., accounts:..., cards:...}
	}

	

	// __Cloudinary__ 페이지 접근
	@GetMapping("cloudinary")
	public String upload_image(Model model) {
		return "main/cloudinaryUploader";
	}
}
