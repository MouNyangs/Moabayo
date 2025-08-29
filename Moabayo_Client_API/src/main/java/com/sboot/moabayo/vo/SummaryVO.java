package com.sboot.moabayo.vo;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SummaryVO {

    // 요청 세그먼트 에코백: {SIDO, AGE, GENDER, (TIMEBAND)}
    private Map<String, Object> segment;

    // 업종 Top-N 결과
    private List<TopUpjong> topUpjong;

    // 차트 데이터(혹은 차트 JSON을 제공하는 URL)
    private Charts charts;

    // 디버그/운영 참고용 파일 경로
    private String predictionsFile;
    private String modelMetricsFile;

    // (선택) 유사 이용자 수 등
    private Integer peerCount;

    // --------- 내부 서브 VO (필요 시 별도 파일로 분리해도 됩니다) ---------
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class TopUpjong {
        private String upjong;
        private String upjongName;
        private double scoreNorm;    // 0~1
        private double scoreRaw;
        private int    scorePercent; // 0~100
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class Charts {
        // 정적 JSON 경로 또는 동적 API URL
        private String topBothChartjs;  // 옵션
        private String timeChartjs;     // e.g., /card/chart/time?upjong=ss007
        private String regionChartjs;   // e.g., /card/chart/region?upjong=ss007
    }
}
