package com.sboot.moabayo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Bank Controller
@RestController
@RequestMapping("/bank")
public class BankController {
	@GetMapping("/main")
	public String bank_main() {
		return "bank/main";
	}
}
