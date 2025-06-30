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
import jakarta.persistence.Tuple;
import jakarta.persistence.TupleElement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
        String queryText = request.get("query");

        if (pageName == null || queryText == null || pageName.isBlank() || queryText.isBlank()) {
            return ResponseEntity.badRequest().body("Page name and query are required.");
        }

        if (!queryText.trim().toLowerCase().startsWith("select")) {
            return ResponseEntity.badRequest().body("Only SELECT queries can be saved.");
        }

        SavedQuery sq = new SavedQuery();
        sq.setPageName(pageName);
        sq.setQuery(queryText);

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

        String queryText = sq.getQuery();

        if (!queryText.trim().toLowerCase().startsWith("select")) {
            return ResponseEntity.badRequest().body("Only SELECT queries are allowed.");
        }

        try {
            // use EntityManager to run a native query on dynamic DB
            EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
            EntityManager em = emf.createEntityManager();

            List<Tuple> tuples = em.createNativeQuery(queryText, Tuple.class).getResultList();

            List<Map<String, Object>> queryResult = new ArrayList<>();
            if (!tuples.isEmpty()) {
                List<TupleElement<?>> elements = tuples.get(0).getElements();
                for (Tuple tuple : tuples) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    for (TupleElement<?> element : elements) {
                        map.put(element.getAlias(), tuple.get(element));
                    }
                    queryResult.add(map);
                }
            }
            
            em.close();

            Map<String, Object> response = new HashMap<>();
            response.put("query", queryText);
            response.put("result", queryResult);

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error executing saved query: " + ex.getMessage());
        }
    }
}
