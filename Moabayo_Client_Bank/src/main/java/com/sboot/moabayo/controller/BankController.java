package com.sboot.moabayo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Bank Controller
@RestController
@RequestMapping("/bank")
public class BankController {
	@GetMapping("/index")
	public String bank_index() {
		return "index";
	}
	
	@GetMapping("/main")
	public String main_page() {
		return "bank/main";
	}
	
	@GetMapping("/accounts")
	public String accounts() {
		return "bank/accounts";
	}
}
