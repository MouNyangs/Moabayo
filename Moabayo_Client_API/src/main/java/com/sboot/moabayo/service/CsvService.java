package com.sboot.moabayo.service;

import com.sboot.moabayo.vo.AgeGenderVO;
import com.sboot.moabayo.vo.RegionVO;
import com.sboot.moabayo.vo.TimeVO;
import org.springframework.stereotype.Service;
import com.opencsv.bean.CsvToBeanBuilder;

import java.io.InputStreamReader;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CsvService {

    public Map<String, Object> getChartData() throws Exception {
        Map<String, Object> chartData = new HashMap<>();

        // ===== 나이/성별 데이터 읽기 =====
        InputStream ageStream = getClass().getResourceAsStream("/csv/age_gender.csv");
        List<AgeGenderVO> ageList = new CsvToBeanBuilder<AgeGenderVO>(new InputStreamReader(ageStream))
                .withType(AgeGenderVO.class)
                .build()
                .parse();

        Map<String, Integer> ageMap = ageList.stream()
                .collect(Collectors.groupingBy(AgeGenderVO::getAGE, Collectors.summingInt(AgeGenderVO::getCARD_TOTAL)));

        chartData.put("age", Map.of(
                "labels", new ArrayList<>(ageMap.keySet()),
                "values", new ArrayList<>(ageMap.values())
        ));

        // ===== 지역 데이터 읽기 =====
        InputStream regionStream = getClass().getResourceAsStream("/csv/region.csv");
        List<RegionVO> regionList = new CsvToBeanBuilder<RegionVO>(new InputStreamReader(regionStream))
                .withType(RegionVO.class)
                .build()
                .parse();

        Map<String, Integer> regionMap = regionList.stream()
                .collect(Collectors.groupingBy(RegionVO::getSIDO, Collectors.summingInt(RegionVO::getCARD_TOTAL)));

        chartData.put("region", Map.of(
                "labels", new ArrayList<>(regionMap.keySet()),
                "values", new ArrayList<>(regionMap.values())
        ));

        // ===== 시간대 데이터 읽기 =====
        InputStream timeStream = getClass().getResourceAsStream("/csv/time.csv");
        List<TimeVO> timeList = new CsvToBeanBuilder<TimeVO>(new InputStreamReader(timeStream))
                .withType(TimeVO.class)
                .build()
                .parse();

        Map<Integer, Integer> timeMap = timeList.stream()
                .collect(Collectors.groupingBy(TimeVO::getTIME, Collectors.summingInt(TimeVO::getCARD_TOTAL)));

        chartData.put("time", Map.of(
                "labels", new ArrayList<>(timeMap.keySet()),
                "values", new ArrayList<>(timeMap.values())
        ));

        return chartData;
    }
}
