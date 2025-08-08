package com.sboot.moabayo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sboot.moabayo.service.RegisterService;
import com.sboot.moabayo.vo.UserVO;

@Controller
@RequestMapping("/registration")
public class RegisterController {

	@Autowired
    private RegisterService registerService;
	
	 @PostMapping("/register")
	    public String register(UserVO vo) {
		 registerService.register(vo);
	        return "redirect:/member/success"; // 가입 성공 후 이동
	    }
	 
	    @ResponseBody
	    @GetMapping("/checkId")
	    public String checkId(@RequestParam("loginId") String id) {
	        boolean exists = registerService.isLoginIdExists(id);
	        return exists ? "duplicate" : "available";
	    }

	    @GetMapping("/success")
	    public String success() {
	        return "member/success"; // 회원가입 완료 화면 (JSP/Thymeleaf 등)
	    }
}
