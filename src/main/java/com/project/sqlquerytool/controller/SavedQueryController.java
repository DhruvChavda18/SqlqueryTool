package com.project.sqlquerytool.controller;

import com.project.sqlquerytool.model.SavedQuery;
import com.project.sqlquerytool.repository.SavedQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class SavedQueryController {

    @Autowired
    private SavedQueryRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/saveQuery")
    public ResponseEntity<?> saveQuery(@RequestBody Map<String, String> request) {
        String pageName = request.get("pageName");
        String query = request.get("query");

        if (pageName == null || query == null || pageName.isBlank() || query.isBlank()) {
            return ResponseEntity.badRequest().body("Page name and query are required.");
        }

        if (!query.trim().toLowerCase().startsWith("select")) {
            return ResponseEntity.badRequest().body("Only SELECT queries can be saved.");
        }

        SavedQuery sq = new SavedQuery();
        sq.setPageName(pageName);
        sq.setQuery(query);
        repository.save(sq);

        return ResponseEntity.ok("✅ Query saved successfully!");
    }

    // List all saved pages
    @GetMapping("/pages")
    public ResponseEntity<List<SavedQuery>> getAllPages() {
        List<SavedQuery> pages = repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"));
        return ResponseEntity.ok(pages);
    }

    // Execute a saved page by ID
    @GetMapping("/pages/{id}")
    public ResponseEntity<?> runSavedQuery(@PathVariable Long id) {
        Optional<SavedQuery> optionalQuery = repository.findById(id);

        if (optionalQuery.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Page not found.");
        }

        String query = optionalQuery.get().getQuery().trim();

        if (!query.toLowerCase().startsWith("select")) {
            return ResponseEntity.badRequest().body("Only SELECT queries are allowed.");
        }

        try {
            List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("result", result);

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error executing saved query: " + ex.getMessage());
        }
    }
}
