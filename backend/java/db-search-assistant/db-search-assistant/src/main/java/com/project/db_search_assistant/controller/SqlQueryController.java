package com.project.db_search_assistant.controller;

import com.project.db_search_assistant.model.SqlQueryResponse;
import com.project.db_search_assistant.service.SqlQueryService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
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
