package com.project.campusExpress;

import com.project.campusExpress.entity.Order;
import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.repository.OrderRepository;
import com.project.campusExpress.repository.ProductRepository;
import com.project.campusExpress.repository.UserRepository;
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

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping("/users/{userId}/product/{productId}")
    public Order createOrder(@PathVariable Long userId, @PathVariable Long productId, @RequestBody Order order) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Integer orderedQuantity = order.getQuantity(); //stockQuantity update after placing order
        if (product.getStockQuantity() < orderedQuantity) {
            throw new RuntimeException("Stock is not enough Only!" + product.getStockQuantity() + "products are left");
        } else {
            product.setStockQuantity(product.getStockQuantity() - orderedQuantity);
        }


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
