package com.sboot.moabayo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/csv")
public class CsvController {

    @PostMapping("/uploadMultiple")
    public ResponseEntity<List<List<Map<String, String>>>> uploadMultipleCsv(
            @RequestParam("files") MultipartFile[] files) {

        List<List<Map<String, String>>> allCsvData = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            List<Map<String, String>> csvData = new ArrayList<>();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                String headerLine = br.readLine(); // 첫 줄: 헤더
                if (headerLine == null) continue;

                String[] headers = headerLine.split(",");
                String line;
                while ((line = br.readLine()) != null) {
                    String[] values = line.split(",");
                    Map<String, String> row = new HashMap<>();
                    for (int i = 0; i < headers.length && i < values.length; i++) {
                        row.put(headers[i].trim(), values[i].trim());
                    }
                    csvData.add(row);
                }

                allCsvData.add(csvData);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok(allCsvData);
    }
}
