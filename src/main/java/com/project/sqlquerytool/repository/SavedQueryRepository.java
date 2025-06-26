package com.project.sqlquerytool.repository;

import com.project.sqlquerytool.model.SavedQuery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedQueryRepository extends JpaRepository<SavedQuery, Long> {
}
