package com.sboot.moabayo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.service.RecommendService;
import com.sboot.moabayo.vo.SummaryVO;

@RestController
@RequestMapping("/card")
@CrossOrigin(origins = "*") // 개발 중 브라우저에서 바로 호출하려면 열어두기
public class RecommendController {

    private final RecommendService service;

    public RecommendController(RecommendService service) {
        this.service = service;
    }

    /**
     * 카드 추천 요약
     * 예) /card/recommend?sido=서울&gender=M&age=20대&timeband=저녁(18–21)
     */
    @GetMapping("/recommend")
    public SummaryVO recommend(
            @RequestParam String sido,
            @RequestParam String gender,
            @RequestParam String age,
            @RequestParam(required = false) String timeband
    ) {
        // 너무 복잡하게 안 하고, trim 정도만 해줌
        String tb = (timeband == null) ? null : timeband.trim();
        return service.getSummary(sido.trim(), gender.trim(), age.trim(), tb);
    }

    /**
     * 시간대 차트 (Chart.js 포맷: {labels:[], datasets:[...]})
     * 예) /card/chart/time?upjong=ss007
     */
    @GetMapping("/chart/time")
    public Map<String, Object> timeChart(@RequestParam String upjong) {
        return service.buildTimeChart(upjong.trim());
    }

    /**
     * 지역 차트 (Chart.js 포맷: {labels:[], datasets:[...]})
     * 예) /card/chart/region?upjong=ss007
     */
    @GetMapping("/chart/region")
    public Map<String, Object> regionChart(@RequestParam String upjong) {
        return service.buildRegionChart(upjong.trim());
    }
}
