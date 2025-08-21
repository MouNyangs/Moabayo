package com.sboot.moabayo.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.*;

@Service
public class AnalysisService {

    public Map<String, Object> analyzeCSV(String age, String gender, String region, String time) {
        Map<String, List<Integer>> categoryMap = new HashMap<>();
        String[] files = {"/data/agegender.csv", "/data/region.csv", "/data/time.csv"};

        for (String filePath : files) {
            try (InputStream is = getClass().getResourceAsStream(filePath)) {
                if (is == null) {
                    System.out.println("CSV 파일을 찾을 수 없습니다: " + filePath);
                    continue;
                }

                // 기본 MS949로 읽기, UTF-8로 바꾸고 싶으면 Charset.forName("UTF-8")
                try (CSVReader reader = new CSVReader(new InputStreamReader(is, Charset.forName("UTF-8")))) {
                    String[] headers = reader.readNext();
                    if (headers == null) continue;

                    Map<String, Integer> headerIndex = new HashMap<>();
                    for (int i = 0; i < headers.length; i++) headerIndex.put(headers[i].trim(), i);

                    Integer ageIdx = headerIndex.get("AGE");
                    Integer genderIdx = headerIndex.get("GENDER");
                    Integer regionIdx = headerIndex.get("SIDO");
                    Integer timeIdx = headerIndex.get("TIME");
                    Integer categoryIdx = headerIndex.get("UPJONG_CD");
                    Integer amountIdx = headerIndex.get("AMT_CORR");

                    String[] cols;
                    while ((cols = reader.readNext()) != null) {
                        if ((ageIdx != null && age != null && !age.equals(cols[ageIdx])) ||
                            (genderIdx != null && gender != null && !gender.equals(cols[genderIdx])) ||
                            (regionIdx != null && region != null && !region.equals(cols[regionIdx])) ||
                            (timeIdx != null && time != null && !time.equals(cols[timeIdx]))) {
                            continue;
                        }

                        if (categoryIdx != null && amountIdx != null) {
                            String category = cols[categoryIdx];
                            String amountStr = cols[amountIdx];
                            if (category != null && !category.isEmpty() && amountStr != null && !amountStr.isEmpty()) {
                                try {
                                    int amount = Integer.parseInt(amountStr.trim());
                                    categoryMap.computeIfAbsent(category, k -> new ArrayList<>()).add(amount);
                                } catch (NumberFormatException ignored) {}
                            }
                        }
                    }

                } catch (CsvValidationException e) {
                    e.printStackTrace();
                }

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Map<String, Object> result = new HashMap<>();
        for (Map.Entry<String, List<Integer>> entry : categoryMap.entrySet()) {
            List<Integer> amounts = entry.getValue();
            int sum = amounts.stream().mapToInt(Integer::intValue).sum();
            double avg = amounts.stream().mapToInt(Integer::intValue).average().orElse(0);

            Map<String, Object> stats = new HashMap<>();
            stats.put("sum", sum);
            stats.put("average", avg);

            result.put(entry.getKey(), stats);
        }

        return result;
    }
}
