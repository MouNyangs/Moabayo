package com.sboot.moabayo.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.awt.Desktop;
import java.net.URI;

@Component
public class InitBrowser {

	@Value("${server.port}")
	private int serverPort;

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		String url = "http://localhost:" + serverPort;
		System.setProperty("java.awt.headless", "false");

		try {
			Desktop.getDesktop().browse(URI.create(url));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}