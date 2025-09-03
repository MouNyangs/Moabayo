package com.sboot.moabayo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.feign.ChartApiClient;

@RestController
@RequestMapping("/charts")
public class ChartProxyController {
    private final ChartApiClient chartApiClient;
    public ChartProxyController(ChartApiClient chartApiClient){ this.chartApiClient = chartApiClient; }

    @GetMapping("/sales")
    public Map<String, Object> sales() {
        return chartApiClient.getSales(); // 그대로 전달
    }
}