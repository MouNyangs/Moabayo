package com.sboot.moabayo.feign;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "API")
public interface ChartApiClient {
    @GetMapping("/api/charts/sales")
    Map<String, Object> getSales();
}
/*public interface RecommendClient {
    @GetMapping("/recommend/summary")
    Map<String, Object> getSummary();
}
*/