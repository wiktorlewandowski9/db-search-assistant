package com.project.db_search_assistant.controllers;

import com.project.db_search_assistant.models.SqlQueryResponse;
import com.project.db_search_assistant.services.SqlQueryService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost")
public class SqlQueryController {

    private final SqlQueryService sqlQueryService;

    public SqlQueryController(SqlQueryService sqlQueryService) {
        this.sqlQueryService = sqlQueryService;
    }

    @GetMapping("/query")
    public SqlQueryResponse getSqlQuery(@RequestParam String userQuery) {
        String sqlQuery = sqlQueryService.getSqlQuery(userQuery);
        SqlQueryResponse response = new SqlQueryResponse();
        response.setSql_query(sqlQuery);
        return response;
    }
}
