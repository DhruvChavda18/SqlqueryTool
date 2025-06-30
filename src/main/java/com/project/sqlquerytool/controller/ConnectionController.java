package com.project.sqlquerytool.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.project.sqlquerytool.model.DbConfig;
import com.project.sqlquerytool.service.DynamicJpaService;
import javax.sql.DataSource;      
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.sql.Connection;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ConnectionController {

    @Autowired
    private DynamicJpaService dynamicJpaService;

    @PostMapping("/connect")
    public ResponseEntity<?> connectToDatabase(@RequestBody DbConfig config) {
        try {
            String url = String.format(
                    "jdbc:postgresql://%s:%d/%s",
                    config.getHost(),
                    config.getPort(),
                    config.getDbName()
            );

            DriverManagerDataSource ds = new DriverManagerDataSource();
            ds.setUrl(url);
            ds.setUsername(config.getUsername());
            ds.setPassword(config.getPassword());
            ds.setDriverClassName("org.postgresql.Driver");

            // test connection
            Connection conn = ds.getConnection();
            conn.close();

            // initialize JPA dynamically
            dynamicJpaService.initDynamicJpa(ds);

            return ResponseEntity.ok("✅ Connected and initialized successfully!");

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("❌ Failed: " + ex.getMessage());
        }
    }
    
}
