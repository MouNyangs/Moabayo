package com.sboot.moabayo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class APIController {
	
	@GetMapping("/consumption")
	public String goConsumption() {
		return "consumption";
	}
}
