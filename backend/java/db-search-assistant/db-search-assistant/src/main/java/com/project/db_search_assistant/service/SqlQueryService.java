package com.project.db_search_assistant.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SqlQueryService {

    private final RestTemplate restTemplate;
    private final JdbcTemplate jdbcTemplate;

    @Value("${fastapi.url}")
    private String fastApiUrl;

    @Autowired
    public SqlQueryService(JdbcTemplate jdbcTemplate, RestTemplate restTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.restTemplate = restTemplate;
    }

    public String getSqlQuery(String userQuery) {
        if (userQuery == null || userQuery.isEmpty()) {
            throw new IllegalArgumentException("User query cannot be empty");
        }

        // JSON body
        Map<String, String> body = new HashMap<>();
        body.put("prompt", userQuery);

        // JSON headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);

        // URL to FastAPI
        String url = fastApiUrl + "/generate_sql";

        // Send POST to FastAPI to get the SQL query
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
        String sqlQuery = response.getBody();
        sqlQuery = cleanSqlQuery(sqlQuery);

        System.out.println(sqlQuery);

        // Execute SQL query on database
        return executeSqlQuery(sqlQuery);
    }

    // Executes the SQL query on PostgreSQL and returns the result
    public String executeSqlQuery(String sqlQuery) {
        try {
            if (sqlQuery == null || sqlQuery.trim().isEmpty()) {
                return "Error: SQL query cannot be empty.";
            }

            // Execute query using JdbcTemplate and capture the result
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sqlQuery);

            if (result.isEmpty()) {
                return "No data found for the query.";
            }

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(result);

        } catch (Exception e) {
            return "Something went wrong... Try again.";
        }
    }

    // Helper method to clean the SQL query
    private String cleanSqlQuery(String sqlQuery) {
        if (sqlQuery == null) {
            return "";
        }

        // Remove unnecessary quotes around the query and normalize newline characters
        sqlQuery = sqlQuery.replace("\"", "");   // Remove any surrounding quotes
        sqlQuery = sqlQuery.replace("\n", " ");  // Replace newline characters with a single space
        sqlQuery = sqlQuery.replace("\r", " ");  // Remove carriage returns
        sqlQuery = sqlQuery.replace("\\", "'");
        sqlQuery = sqlQuery.replace("'n", "");
        sqlQuery = sqlQuery.trim();

        return sqlQuery;
    }
}
