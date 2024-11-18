package com.project.db_search_assistant.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class SqlQueryService {

    private final RestTemplate restTemplate;

    @Value("${fastapi.url}")
    private String fastApiUrl;

    public SqlQueryService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getSqlQuery(String userQuery) {
        // set default LLM model to use
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

        // send POST to FastAPI
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        return response.getBody();
    }
}
