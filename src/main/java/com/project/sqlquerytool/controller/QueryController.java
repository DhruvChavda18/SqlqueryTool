package com.project.sqlquerytool.controller;

import com.project.sqlquerytool.service.DynamicJpaService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Tuple;
import jakarta.persistence.TupleElement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class QueryController {

    @Autowired
    private DynamicJpaService dynamicJpaService;

    @PostMapping("/execute")
    public ResponseEntity<?> executeQuery(@RequestBody Map<String, String> payload) {
        String sqlQuery = payload.get("sqlQuery").trim();

        if (!sqlQuery.toLowerCase().startsWith("select") ||
            sqlQuery.toLowerCase().contains("insert") ||
            sqlQuery.toLowerCase().contains("update") ||
            sqlQuery.toLowerCase().contains("delete") ||
            sqlQuery.toLowerCase().contains("drop") ||
            sqlQuery.toLowerCase().contains("alter") ||
            sqlQuery.toLowerCase().contains("truncate") ||
            sqlQuery.toLowerCase().contains("create")) {
            return ResponseEntity.badRequest().body("❌ Invalid query. Only safe SELECT statements are allowed.");
        }

        try {
            EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
            EntityManager em = emf.createEntityManager();

            List<Tuple> tuples = em.createNativeQuery(sqlQuery, Tuple.class).getResultList();
            
            List<Map<String, Object>> result = new ArrayList<>();
            if (!tuples.isEmpty()) {
                List<TupleElement<?>> elements = tuples.get(0).getElements();
                for (Tuple tuple : tuples) {
                    Map<String, Object> map = new LinkedHashMap<>();
                    for (TupleElement<?> element : elements) {
                        map.put(element.getAlias(), tuple.get(element));
                    }
                    result.add(map);
                }
            }
            
            em.close();

            return ResponseEntity.ok(result);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Unexpected Error: " + ex.getMessage());
        }
    }
}
