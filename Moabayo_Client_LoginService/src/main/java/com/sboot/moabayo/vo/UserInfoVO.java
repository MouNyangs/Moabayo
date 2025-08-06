package com.sboot.moabayo.vo;

import lombok.Data;

@Data
public class UserInfoVO {

	private String id;
	private String name;
	private String role;

	public UserInfoVO(String id, String name, String role) {
		this.id = id;
		this.name = name;
		this.role = role;
	}

	public UserInfoVO() {
	}
}
