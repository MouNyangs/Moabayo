package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

	@GetMapping("loginpage")
	public String gologinpage(Model model) {
		return "login/login";
	}
	
}
