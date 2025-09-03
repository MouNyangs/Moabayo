package com.sboot.moabayo.csv;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.opencsv.bean.CsvToBeanBuilder;
import com.sboot.moabayo.vo.AgeGenderVO;
import com.sboot.moabayo.vo.RegionVO;
import com.sboot.moabayo.vo.TimeVO;

@Component
public class CsvReader {

    private BufferedReader getReader(String path) throws Exception {
        BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        new ClassPathResource(path).getInputStream(),
                        StandardCharsets.UTF_8
                )
        );

        // BOM 제거
        br.mark(1);
        if (br.read() != 0xFEFF) {
            br.reset();
        }
        return br;
    }

    public List<AgeGenderVO> readAgeGender() throws Exception {
        BufferedReader br = getReader("static/csv/agegender.csv");
        List<AgeGenderVO> list = new CsvToBeanBuilder<AgeGenderVO>(br)
                .withType(AgeGenderVO.class)
                .withIgnoreLeadingWhiteSpace(true)
                .build()
                .parse();
        br.close();
        return list;
    }

    public List<RegionVO> readRegion() throws Exception {
        BufferedReader br = getReader("static/csv/region.csv");
        List<RegionVO> list = new CsvToBeanBuilder<RegionVO>(br)
                .withType(RegionVO.class)
                .withIgnoreLeadingWhiteSpace(true)
                .build()
                .parse();
        br.close();
        return list;
    }

    public List<TimeVO> readTime() throws Exception {
        BufferedReader br = getReader("static/csv/time.csv");
        List<TimeVO> list = new CsvToBeanBuilder<TimeVO>(br)
                .withType(TimeVO.class)
                .withIgnoreLeadingWhiteSpace(true)
                .build()
                .parse();
        br.close();
        return list;
    }
}
