package com.project.sqlquerytool.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_queries")
public class SavedQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_name", nullable = false)
    private String pageName;

    @Column(name = "query", nullable = false, columnDefinition = "TEXT")
    private String query;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPageName() { return pageName; }
    public void setPageName(String pageName) { this.pageName = pageName; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
