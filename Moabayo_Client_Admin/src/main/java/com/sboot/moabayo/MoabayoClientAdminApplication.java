package com.sboot.moabayo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MoabayoClientAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoabayoClientAdminApplication.class, args);
	}

}
