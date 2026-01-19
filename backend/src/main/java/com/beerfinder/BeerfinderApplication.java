package com.beerfinder;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
@Tag(name = "System", description = "System health and info endpoints")
public class BeerfinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeerfinderApplication.class, args);
	}

	@Operation(summary = "API Home", description = "Returns basic API information")
	@ApiResponse(responseCode = "200", description = "API is running")
	@GetMapping("/")
	public Map<String, Object> home() {
		Map<String, Object> response = new HashMap<>();
		response.put("message", "🍺 Beer Finder API is running!");
		response.put("status", "OK");
		response.put("timestamp", LocalDateTime.now().toString());
		response.put("version", "0.0.1-SNAPSHOT");
		return response;
	}

	@Operation(summary = "Health Check", description = "Returns application health status")
	@ApiResponse(responseCode = "200", description = "Application is healthy")
	@GetMapping("/api/health")
	public Map<String, String> health() {
		Map<String, String> health = new HashMap<>();
		health.put("status", "UP");
		health.put("application", "Beer Finder Backend");
		return health;
	}
}