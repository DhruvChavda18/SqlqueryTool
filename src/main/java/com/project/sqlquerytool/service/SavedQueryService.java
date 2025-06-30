package com.project.sqlquerytool.service;

import org.springframework.stereotype.Service;
import com.project.sqlquerytool.model.SavedQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;
import java.util.List;

@Service
public class SavedQueryService {

     private final DynamicJpaService dynamicJpaService;

    public SavedQueryService(DynamicJpaService dynamicJpaService) {
        this.dynamicJpaService = dynamicJpaService;
    }

    public SavedQuery save(SavedQuery sq) {
        EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(sq);
        em.getTransaction().commit();
        em.close();
        return sq;
    }

    public List<SavedQuery> findAll() {
        EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        TypedQuery<SavedQuery> query = em.createQuery("SELECT s FROM SavedQuery s ORDER BY s.createdDate DESC", SavedQuery.class);
        List<SavedQuery> results = query.getResultList();
        em.close();
        return results;
    }

    public SavedQuery findById(Long id) {
        EntityManagerFactory emf = dynamicJpaService.getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        SavedQuery sq = em.find(SavedQuery.class, id);
        em.close();
        return sq;
    }

}
