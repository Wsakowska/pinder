package com.beerfinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
public class BeerfinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeerfinderApplication.class, args);
	}

	@GetMapping("/")
	public Map<String, Object> home() {
		Map<String, Object> response = new HashMap<>();
		response.put("message", "🍺 Beer Finder API is running!");
		response.put("status", "OK");
		response.put("timestamp", LocalDateTime.now().toString());
		response.put("version", "0.0.1-SNAPSHOT");
		return response;
	}

	@GetMapping("/api/health")
	public Map<String, String> health() {
		Map<String, String> health = new HashMap<>();
		health.put("status", "UP");
		health.put("application", "Beer Finder Backend");
		return health;
	}
}