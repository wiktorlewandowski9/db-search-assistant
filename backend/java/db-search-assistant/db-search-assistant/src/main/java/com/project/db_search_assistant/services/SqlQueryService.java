package com.project.db_search_assistant.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SqlQueryService {

    private final RestTemplate restTemplate;
    private final JdbcTemplate jdbcTemplate;
    private final String context = readContextFromFile();

    @Autowired
    public SqlQueryService(JdbcTemplate jdbcTemplate, RestTemplate restTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.restTemplate = restTemplate;
    }

    @Value("${MODEL_URL}")
    private String modelURL;

    @Value("${MODEL_NAME}")
    private String modelName;


    public String getSqlQuery(String userQuery) {
        if (userQuery == null || userQuery.isEmpty()) {
            throw new IllegalArgumentException("User query cannot be empty");
        }

        String fullPrompt = context + "\n" + userQuery;
        System.out.println("Constructed full prompt:\n" + fullPrompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", modelName);
        body.put("prompt", fullPrompt);
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            System.out.println("Sending request to model URL: " + modelURL);
            ResponseEntity<String> response = restTemplate.postForEntity(modelURL, requestEntity, String.class);

            String sqlQuery = extractSqlQueryFromResponse(response.getBody());
            System.out.println("Cleaned SQL query: " + sqlQuery);

            return executeSqlQuery(sqlQuery);

        } catch (RestClientException e) {
            System.err.println("Error during API call to Ollama: " + e.getMessage());
            throw new RuntimeException("Error during API call to Ollama", e);
        }
    }

    private String readContextFromFile() {
        try {
            String context = new String(Files.readAllBytes(Paths.get(getClass().getClassLoader().getResource("context.txt").toURI())));
            System.out.println("Context successfully read.");
            return context;
        } catch (Exception e) {
            System.err.println("Failed to read context file: " + e.getMessage());
            throw new RuntimeException("Failed to read context file from resources.", e);
        }
    }

    public String executeSqlQuery(String sqlQuery) {
        try {
            if (sqlQuery == null || sqlQuery.trim().isEmpty()) {
                System.err.println("SQL query is empty or null.");
                return "Error: SQL query cannot be empty.";
            }

            if (sqlQuery.isEmpty()) {
                return "No data found for the query.";
            }

            System.out.println("Executing SQL query: " + sqlQuery);
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlQuery);

            if (result == null || result.isEmpty()) {
                System.out.println("No results found for the query.");
                return "No results";
            }

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonResponse = objectMapper.writeValueAsString(result);
            System.out.println("Query executed successfully. Result: " + jsonResponse);
            return jsonResponse;

        } catch (Exception e) {
            System.err.println("Error during SQL query execution: " + e.getMessage());
            return "Error: " + e.getMessage();
        }
    }

    private String extractSqlQueryFromResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);

            return (String) responseMap.get("response");
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract SQL query from response", e);
        }
    }
}
