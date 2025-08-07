package com.sboot.moabayo.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "Bank")
public interface BankFeignClient {
	@GetMapping("/bank/main")
	void bankMain();
	
}
