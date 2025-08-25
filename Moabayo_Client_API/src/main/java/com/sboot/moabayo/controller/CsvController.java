package com.sboot.moabayo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sboot.moabayo.csv.CsvReader;
import com.sboot.moabayo.vo.AgeGenderVO;
import com.sboot.moabayo.vo.RegionVO;
import com.sboot.moabayo.vo.TimeVO;

@RestController
@RequestMapping("/csv")
public class CsvController {

    @Autowired
    private CsvReader csvReader;
    

    @GetMapping("/")
    public String home() {
        return "index.html";
    }

    @GetMapping("/age")
    public List<AgeGenderVO> getAgeGender() throws Exception {
        return csvReader.readAgeGender();
    }

    @GetMapping("/region")
    public List<RegionVO> getRegion() throws Exception {
        return csvReader.readRegion();
    }

    @GetMapping("/time")
    public List<TimeVO> getTime() throws Exception {
        return csvReader.readTime();
    }
}
