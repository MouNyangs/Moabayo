package com.sboot.moabayo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.sboot.moabayo.service.MypageService;
import com.sboot.moabayo.vo.SummaryVO;
import com.sboot.moabayo.vo.UserVO;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MyPageController {

	private MypageService mypageservice;
	
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
	
	  @GetMapping("/profile")
	  public UserVO getProfile(HttpSession session) {
	    Long userId = (Long) session.getAttribute("userId"); // 세션에 userId 저장돼있다는 전제
	    if (userId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
	    return mypageservice.getProfile(userId);
	  }
	  
	  // POST: 수정 저장
	  @PostMapping("/profile")
	  public Map<String,Object> saveProfile(HttpSession session, @RequestBody UserVO req) {
	    Long userId = (Long) session.getAttribute("userId");
	    if (userId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

	    // 비밀번호 확인
	    if (req.getNewPw() != null || req.getNewPwConfirm() != null) {
	      if (req.getNewPw() == null || req.getNewPwConfirm() == null
	          || !req.getNewPw().equals(req.getNewPwConfirm())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다.");
	      }
	      if (req.getNewPw().length() < 8) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 8자 이상이어야 합니다.");
	      }
	    }
	    mypageservice.updateProfile(userId, req);

	    return Map.of("success", true);
	  }
}
