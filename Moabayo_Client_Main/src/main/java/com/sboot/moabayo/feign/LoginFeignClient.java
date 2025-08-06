package com.sboot.moabayo.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.sboot.moabayo.vo.LoginFormVO;
import com.sboot.moabayo.vo.UserInfoVO;

@FeignClient(name = "LoginService") // Eureka에 등록된 이름과 동일하게
public interface LoginFeignClient {

    @PostMapping("/user/validate")
    UserInfoVO checkUser(@RequestBody LoginFormVO form);
}
