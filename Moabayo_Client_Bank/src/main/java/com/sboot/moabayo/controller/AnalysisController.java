package com.sboot.moabayo.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sboot.moabayo.service.AnalysisService;

@RestController
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/analyze")
    public Map<String, Object> analyze(String age, String gender, String region, String time) {
        // 선택된 필터에 맞게 데이터 가공 가능
        return analysisService.analyzeCSV(age, gender, region, time);
    }
}
