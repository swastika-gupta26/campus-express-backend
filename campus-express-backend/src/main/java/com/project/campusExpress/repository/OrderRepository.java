package com.project.campusExpress.repository;

import com.project.campusExpress.entity.Order;
import com.project.campusExpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserHostelName(String hostelName);
    List<Order> findByProductCreatedBy(User producer);
    List<Order> findByUser(User user);
    long countByProductCreatedByAndStatus(User producer, String status);
}
