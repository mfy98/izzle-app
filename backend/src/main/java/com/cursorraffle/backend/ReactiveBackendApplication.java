package com.cursorraffle.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication(scanBasePackages = "com.cursorraffle.backend")
@EnableR2dbcRepositories(basePackages = "com.cursorraffle.backend.repository")
public class ReactiveBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactiveBackendApplication.class, args);
	}

}

