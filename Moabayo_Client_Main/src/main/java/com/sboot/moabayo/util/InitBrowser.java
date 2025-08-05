package com.sboot.moabayo.util;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.awt.Desktop;
import java.net.URI;

@Component
public class InitBrowser {

//	@PostConstruct
//	public void init() {
//		String url = "http://localhost:8080";
//		System.setProperty("java.awt.headless", "false");
//		try {
//			Desktop.getDesktop().browse(URI.create(url));
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
}