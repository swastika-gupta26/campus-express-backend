package com.project.campusExpress.repository;

import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByNameIgnoreCaseAndPriceAndCreatedBy(String name, Double price, User createdBy);
    List<Product> findByCreatedByIdNot(Long userId);
}
