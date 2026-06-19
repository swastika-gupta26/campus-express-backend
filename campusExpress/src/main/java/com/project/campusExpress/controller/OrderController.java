package com.project.campusExpress.controller;

import com.project.campusExpress.entity.Order;
import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.repository.OrderRepository;
import com.project.campusExpress.repository.ProductRepository;
import com.project.campusExpress.repository.UserRepository;
import com.project.campusExpress.service.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtService jwtservice;

    @GetMapping
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    @PostMapping("/product/{productId}")
    @Transactional
    public Order createOrder(@PathVariable Long productId, @RequestBody Order order,@RequestHeader("Authorization") String tokenHeader) {

        String token= tokenHeader.substring(7);
        String username= jwtservice.extractUsername(token);


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Integer orderedQuantity = order.getQuantity(); //stockQuantity update after placing order
        if (product.getStockQuantity() < orderedQuantity) {
            throw new RuntimeException("Stock is not enough. Only! " + product.getStockQuantity() + " products are left");
        } else {
            product.setStockQuantity(product.getStockQuantity() - orderedQuantity);
        }

           Double totalPrice= product.getPrice()*orderedQuantity;
        order.setTotalPrice(totalPrice);

        productRepository.save(product);
        order.setUser(user); //updating user_id column in order table
        return orderRepository.save(order);
    }

    @PutMapping("/{orderId}/status") //order status update
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        order.setStatus(newStatus);

        return orderRepository.save(order);
    }

    @GetMapping("/hostel/{hostelName}")
    public List<Order> getOrdersByHostel(@PathVariable String hostelName) {
        return orderRepository.findByUserHostelName(hostelName);
    }
}
