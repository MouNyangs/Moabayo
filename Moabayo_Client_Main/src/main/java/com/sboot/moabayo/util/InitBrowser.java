package com.sboot.moabayo.util;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.awt.Desktop;
import java.net.URI;

@Component
public class InitBrowser {

	@Value("${server.port}")
	private int serverPort;

	@PostConstruct
	public void init() {
		String url = "http://localhost:" + serverPort;
		System.setProperty("java.awt.headless", "false");

		try {
			Desktop.getDesktop().browse(URI.create(url));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}