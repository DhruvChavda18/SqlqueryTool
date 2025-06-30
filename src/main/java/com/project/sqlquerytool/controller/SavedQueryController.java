package com.project.sqlquerytool.controller;

import com.project.sqlquerytool.model.SavedQuery;
import com.project.sqlquerytool.service.DynamicJpaService;
import com.project.sqlquerytool.service.SavedQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class SavedQueryController {

    @Autowired
    private SavedQueryService savedQueryService;

    @Autowired
    private DynamicJpaService dynamicJpaService;

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

        savedQueryService.save(sq);

        return ResponseEntity.ok("✅ Query saved successfully!");
    }

    // list all saved pages
    @GetMapping("/pages")
    public ResponseEntity<List<SavedQuery>> getAllPages() {
        List<SavedQuery> pages = savedQueryService.findAll();
        return ResponseEntity.ok(pages);
    }

    // execute a saved page
    @GetMapping("/pages/{id}")
    public ResponseEntity<?> runSavedQuery(@PathVariable Long id) {
        SavedQuery sq = savedQueryService.findById(id);

        if (sq == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Page not found.");
        }

        String query = sq.getQuery();

        if (!query.trim().toLowerCase().startsWith("select")) {
            return ResponseEntity.badRequest().body("Only SELECT queries are allowed.");
        }

        try {
            // use EntityManager to run a native query on dynamic DB
            EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
            EntityManager em = emf.createEntityManager();

            List<?> result = em.createNativeQuery(query).getResultList();

            em.close();

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("result", result);

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error executing saved query: " + ex.getMessage());
        }
    }
}
