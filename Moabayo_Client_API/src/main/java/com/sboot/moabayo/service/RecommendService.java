package com.sboot.moabayo.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.opencsv.bean.CsvToBeanBuilder;
import com.sboot.moabayo.vo.PredictionsRowVO;
import com.sboot.moabayo.vo.SummaryVO;

/**
 * RecommendService (아주 단순 버전)
 *
 * 역할 요약:
 *  - 파이썬이 만든 CSV(predictions_by_segment.csv)를 메모리에 로드
 *  - /card/recommend: 조건으로 필터 → 업종별 RAW 합산 → 정규화 → TopN 생성
 *  - /card/chart/time: TIMEBAND(점심/저녁/심야)별 평균 RAW 만들기
 *  - /card/chart/region: 지역(SIDO)별 평균 RAW 상위 6개 만들기
 *
 * 설계 포인트:
 *  
 *  - 최초 1회 CSV 로드 후 this.rows에 보관(간단 캐시)
 */
@Service
public class RecommendService {

    // (1) 클래스패스 기준 CSV 위치
    //     실제 파일 경로: src/main/resources/static/csv/ml_out/predictions_by_segment.csv
    private static final String PRED_CSV_CLASSPATH =
            "static/csv/ml_out/predictions_by_segment.csv";

    // (2) CSV를 읽어 담아둘 메모리 리스트 (처음 접근 시 로드)
    private List<PredictionsRowVO> rows;

    /**
     * 카드 추천 요약 만들기
     * @param sido    지역 (예: "서울")
     * @param gender  성별 ("M" 또는 "F")
     * @param age     연령대 ("20대", "30대" 등)
     * @param timeband 시간대 선택 (예: "저녁(18–21)") — 옵션(안 보낼 수 있음)
     * @return SummaryVO (프론트로 내려갈 JSON의 스키마)
     */
    public SummaryVO getSummary(String sido, String gender, String age, String timeband) {
        // (1) CSV 로드 (최초 1회만 파일에서 읽고 이후엔 메모리 재사용)
        List<PredictionsRowVO> all = loadRows();

        // (2) 조건으로 필터한 행들을 담을 리스트
        List<PredictionsRowVO> filtered = new ArrayList<>();
        for (PredictionsRowVO r : all) {
            // 각 조건이 다 맞는 행만 통과시킵니다.
            if (!eq(r.getSIDO(), sido)) continue;             // SIDO 일치
            if (!eq(r.getAGE(), age)) continue;               // AGE 일치
            if (!eqIgnoreCase(r.getGENDER(), gender)) continue; // GENDER 대소문자 무시하고 일치
            // timeband를 요청하지 않았다면(=null/빈문자) 전체 TIMEBAND를 포함합니다.
            if (notBlank(timeband) && !eq(r.getTIMEBAND(), timeband)) continue;
            filtered.add(r);
        }

        // (3) 업종별 RAW 합산을 위한 맵 + 업종코드→업종명 매핑 맵
        Map<String, Double> sumRaw = new HashMap<>();      // upjong -> RAW 합계
        Map<String, String> nameByUpjong = new HashMap<>(); // upjong -> 한글 업종명
        for (PredictionsRowVO r : filtered) {
            String up = r.getUPJONG();
            // 업종명은 한 번만 저장(없을 때만 put)
            nameByUpjong.putIfAbsent(up, r.getUPJONG_NAME());
            // RAW 점수 누적 (없으면 0.0에서 시작)
            sumRaw.put(up, sumRaw.getOrDefault(up, 0.0) + r.getSCORE_RAW());
        }

        // (4) 정규화를 위해 업종별 RAW 합계 중 최댓값을 찾음
        double max = 0.0;
        for (double v : sumRaw.values()) {
            if (v > max) max = v;
        }

        // (5) 업종별 결과를 SummaryVO.TopUpjong 리스트로 변환
        List<SummaryVO.TopUpjong> topList = new ArrayList<>();
        for (Map.Entry<String, Double> e : sumRaw.entrySet()) {
            String up = e.getKey();    // 업종 코드
            double raw = e.getValue(); // 해당 업종의 RAW 합계
            // max가 0이면 0 나눗셈 방지 → norm = 0
            double norm = (max <= 0) ? 0.0 : (raw / max); // 0~1 사이로 정규화
            int percent = (int) Math.round(norm * 100);  // 0~100 퍼센트로 변환

            // 리스트에 하나 추가 (소수 4자리로 반올림해서 저장)
            SummaryVO.TopUpjong item = SummaryVO.TopUpjong.builder()
                    .upjong(up)
                    .upjongName(nameByUpjong.getOrDefault(up, up))
                    .scoreRaw(round4(raw))
                    .scoreNorm(round4(norm))
                    .scorePercent(percent)
                    .build();
            topList.add(item);
        }

        // (6) 점수(퍼센트) 내림차순으로 정렬하고, 상위 10개만 사용
        topList.sort((a, b) -> Integer.compare(b.getScorePercent(), a.getScorePercent()));
        if (topList.size() > 10) {
            topList = topList.subList(0, 10);
        }

        // (7) 차트 URL 만들기 (가장 점수가 높은 업종 기준으로 링크 제공)
        SummaryVO.Charts charts = new SummaryVO.Charts();
        if (!topList.isEmpty()) {
            String topUp = topList.get(0).getUpjong();
            // 프론트는 이 URL을 fetch해서 Chart.js에 꽂으면 됩니다.
            charts.setTimeChartjs("/card/chart/time?upjong=" + topUp);
            charts.setRegionChartjs("/card/chart/region?upjong=" + topUp);
        }

        // (8) 요청 세그먼트를 그대로 에코백(프론트에서 화면 상단 등에 표시 용도)
        Map<String, Object> seg = new LinkedHashMap<>();
        seg.put("SIDO", sido);
        seg.put("AGE", age);
        seg.put("GENDER", gender);
        if (notBlank(timeband)) seg.put("TIMEBAND", timeband);

        // (9) 최종 응답 객체 조립
        SummaryVO out = SummaryVO.builder()
                .segment(seg)
                .topUpjong(topList)
                .charts(charts)
                .predictionsFile("/csv/ml_out/predictions_by_segment.csv") // 참고/디버그용
                .modelMetricsFile("/csv/ml_out/model_metrics.json")        // 참고/디버그용
                .build();

        return out; // 컨트롤러에서 이 객체를 그대로 리턴하면 JSON으로 직렬화됩니다.
    }

    /**
     * 시간대 차트 데이터 만들기 (Chart.js 형식)
     * - 라벨: ["점심(11–14)", "저녁(18–21)", "심야(22–02)"]
     * - 값: 각 TIMEBAND에서의 해당 업종 RAW 평균
     */
    public Map<String, Object> buildTimeChart(String upjong) {
        List<PredictionsRowVO> all = loadRows();

        // X축 라벨 (순서 그대로 사용)
        List<String> labels = Arrays.asList("점심(11–14)", "저녁(18–21)", "심야(22–02)");

        // 각 라벨(TIMEBAND)별 평균값을 구해서 values에 넣음
        List<Double> vals = new ArrayList<>();
        for (String band : labels) {
            double sum = 0.0;
            int count = 0;
            for (PredictionsRowVO r : all) {
                // 같은 업종 && 같은 TIMEBAND 인 행만 취합
                if (eq(r.getUPJONG(), upjong) && eq(r.getTIMEBAND(), band)) {
                    sum += r.getSCORE_RAW();
                    count++;
                }
            }
            // count가 0이면 0.0, 있으면 평균(sum/count)
            vals.add(round4(count == 0 ? 0.0 : sum / count));
        }

        // Chart.js 데이터셋: { label, data } 형태
        Map<String, Object> ds = new LinkedHashMap<>();
        ds.put("label", upjong + " 시간대별 예측");
        ds.put("data", vals);

        // Chart.js 전체 포맷: { labels: [...], datasets: [ {label, data} ] }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("labels", labels);
        data.put("datasets", Collections.singletonList(ds));
        return data;
    }

    /**
     * 지역 차트 데이터 만들기 (Chart.js 형식)
     * - 지역(SIDO)별 평균 RAW를 구하고, 상위 6개만 반환
     */
    public Map<String, Object> buildRegionChart(String upjong) {
        List<PredictionsRowVO> all = loadRows();

        // 지역별로 [합계, 건수]를 누적하기 위한 맵
        Map<String, double[]> acc = new HashMap<>(); // key: SIDO, value: [sum, cnt]

        for (PredictionsRowVO r : all) {
            // 같은 업종만 관심
            if (!eq(r.getUPJONG(), upjong)) continue;

            String sido = r.getSIDO();
            // 기존 값이 없으면 [0.0, 0.0]에서 시작
            double[] pair = acc.getOrDefault(sido, new double[]{0.0, 0.0});
            pair[0] += r.getSCORE_RAW(); // 합계
            pair[1] += 1.0;               // 건수
            acc.put(sido, pair);
        }

        // [SIDO, 평균] 리스트로 변환하고 평균으로 내림차순 정렬
        List<Map.Entry<String, Double>> list = new ArrayList<>();
        for (Map.Entry<String, double[]> e : acc.entrySet()) {
            double sum = e.getValue()[0];
            double cnt = e.getValue()[1];
            double avg = (cnt == 0) ? 0.0 : (sum / cnt);
            // Java 9 이상: Map.entry(key, value)
            // Java 8 사용 중이면: list.add(new AbstractMap.SimpleEntry<>(e.getKey(), round4(avg)));
            list.add(Map.entry(e.getKey(), round4(avg)));
        }
        list.sort((a, b) -> Double.compare(b.getValue(), a.getValue())); // 큰 값이 먼저

        // 상위 6개만 사용
        if (list.size() > 6) list = list.subList(0, 6);

        // Chart.js에 맞게 labels와 data 배열 생성
        List<String> labels = new ArrayList<>();
        List<Double> vals = new ArrayList<>();
        for (Map.Entry<String, Double> e : list) {
            labels.add(e.getKey());
            vals.add(e.getValue());
        }

        Map<String, Object> ds = new LinkedHashMap<>();
        ds.put("label", upjong + " 지역별 예측");
        ds.put("data", vals);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("labels", labels);
        data.put("datasets", Collections.singletonList(ds));
        return data;
    }

    // ----------------------- 내부 유틸 -----------------------

    /**
     * CSV를 처음 한 번만 로드해서 this.rows에 보관.
     * 이후부터는 메모리의 rows를 그대로 사용(간단 캐시).
     * synchronized: 다중 스레드 환경에서도 처음 로드 시 충돌 방지.
     */
    private synchronized List<PredictionsRowVO> loadRows() {
        if (this.rows != null) return this.rows; // 이미 로드됐다면 그대로 반환

        try {
            // 클래스패스에서 파일을 찾습니다.
            ClassPathResource res = new ClassPathResource(PRED_CSV_CLASSPATH);

            // UTF-8로 읽어들입니다. (CSV 한글 깨짐 방지)
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {

                // OpenCSV로 CSV → VO 매핑 (헤더명과 @CsvBindByName가 연결)
                this.rows = new CsvToBeanBuilder<PredictionsRowVO>(br)
                        .withType(PredictionsRowVO.class)
                        .withIgnoreLeadingWhiteSpace(true)
                        .build()
                        .parse();

                return this.rows;
            }
        } catch (Exception e) {
            // 파일 경로/인코딩/헤더명 불일치 등 문제시 예외 발생
            throw new RuntimeException("predictions_by_segment.csv 로드 실패: " + PRED_CSV_CLASSPATH, e);
        }
    }

    // 아래는 문자열/숫자 비교와 관련된 소소한 헬퍼들입니다.

    /** null/공백을 동일하게 취급하여 두 문자열이 같은지 비교 */
    private static boolean eq(String a, String b) {
        return Objects.equals(emptyToNull(a), emptyToNull(b));
    }

    /** 대소문자 무시하고 비교 (예: "m" == "M") */
    private static boolean eqIgnoreCase(String a, String b) {
        String aa = emptyToNull(a), bb = emptyToNull(b);
        return aa == null ? bb == null : aa.equalsIgnoreCase(bb);
    }

    /** 문자열이 null이 아니고 공백만이 아닌지 확인 */
    private static boolean notBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }

    /** 빈문자열("")을 null로 바꾸는 함수 (비교시 편하게 쓰려고) */
    private static String emptyToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    /** 소수점 4자리 반올림 (UI 숫자 깔끔하게 보이도록) */
    private static double round4(double v) {
        return Math.round(v * 10000.0) / 10000.0;
    }
}
