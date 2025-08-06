package com.sboot.moabayo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.sboot.moabayo.feign")
public class MoabayoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoabayoApplication.class, args);
	}

}
