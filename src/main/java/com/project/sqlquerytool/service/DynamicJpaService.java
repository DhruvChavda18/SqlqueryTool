package com.project.sqlquerytool.service;

import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import java.util.HashMap;
import java.util.Map;
import com.project.sqlquerytool.model.SavedQuery;

@Service
public class DynamicJpaService {

    private EntityManagerFactory entityManagerFactory;

    public EntityManagerFactory initDynamicJpa(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan(SavedQuery.class.getPackageName());
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

        em.setJpaPropertyMap(properties);
        em.afterPropertiesSet();

        this.entityManagerFactory = em.getObject();
        return this.entityManagerFactory;
    }

    public EntityManagerFactory getEntityManagerFactory() {
        return this.entityManagerFactory;
    }
    
}
