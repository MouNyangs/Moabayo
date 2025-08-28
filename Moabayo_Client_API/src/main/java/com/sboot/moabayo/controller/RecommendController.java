package com.sboot.moabayo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.service.RecommendService;
import com.sboot.moabayo.vo.SummaryVO;

@RestController
@RequestMapping("/card")
public class RecommendController {

    private final RecommendService service;
    public RecommendController(RecommendService service) { this.service = service; }

    // 쿼리스트링 → 바로 서비스 호출 (SegmentVO 없이)
    @GetMapping("/recommend")
    public ResponseEntity<SummaryVO> recommend(
            @RequestParam String sido,
            @RequestParam String gender,
            @RequestParam String age,
            @RequestParam(required = false) String timeband
    ) {
        return ResponseEntity.ok(service.getSummary(sido, gender, age, timeband));
    }

    // (선택) SegmentVO로 받고 싶으면 이 엔드포인트로 대체해도 됨
    @PostMapping("/recommend")
    public ResponseEntity<SummaryVO> recommend(@RequestBody SegmentVO seg) {
        return ResponseEntity.ok(service.getSummary(seg));
    }
}
