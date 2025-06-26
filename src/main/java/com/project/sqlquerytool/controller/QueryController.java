package com.project.sqlquerytool.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class QueryController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@RequestBody Map<String, String> payload) {
        String sqlQuery = payload.get("sqlQuery").trim().toLowerCase();

        if (!sqlQuery.startsWith("select") ||
            sqlQuery.contains("insert") ||
            sqlQuery.contains("update") ||
            sqlQuery.contains("delete") ||
            sqlQuery.contains("drop") ||
            sqlQuery.contains("alter") ||
            sqlQuery.contains("truncate") ||
            sqlQuery.contains("create")) {

            return ResponseEntity.badRequest().body("❌ Invalid query. Only safe SELECT statements are allowed.");
        }

        try {
            List<Map<String, Object>> result = jdbcTemplate.queryForList(payload.get("sqlQuery"));
            return ResponseEntity.ok(result);
        } catch (BadSqlGrammarException ex) {
            return ResponseEntity.badRequest().body("SQL Error: " + ex.getMostSpecificCause().getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Unexpected Error: " + ex.getMessage());
        }
    }
    
}
