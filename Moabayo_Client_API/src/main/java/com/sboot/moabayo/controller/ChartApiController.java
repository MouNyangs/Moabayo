package com.sboot.moabayo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//API 서버 (예: 8816)
@RestController
@RequestMapping("/api/charts")
public class ChartApiController {
 @GetMapping("/sales")
 public Map<String, Object> sales() {
     return Map.of(
         "labels", List.of("1월","2월","3월","4월","5월","6월"),
         "datasets", List.of(
             Map.of("label","매출(만원)", "data", List.of(120,150,90,180,210,160))
         )
     );
 }
}
