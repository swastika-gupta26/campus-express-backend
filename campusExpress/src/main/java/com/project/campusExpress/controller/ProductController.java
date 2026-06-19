package com.project.campusExpress.controller;


import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.repository.ProductRepository;
import com.project.campusExpress.repository.UserRepository;
import com.project.campusExpress.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtService jwtservice;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String username = jwtservice.extractUsername(token);
        User producer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        product.setCreatedBy(producer);
        return productRepository.save(product);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId, @AuthenticationPrincipal UserDetails userDetails) {
        String currentUsername = userDetails.getUsername();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));
        boolean isAdmin = userDetails.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        boolean isProducer = userDetails.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PRODUCER"));

        if (isAdmin == true) {
            productRepository.delete(product);
            return ResponseEntity.ok("Product deleted successfully by Admin");
        } else if (isProducer == true) {
            if (product.getCreatedBy().getUsername().equals(currentUsername)) {
                productRepository.delete(product);
                return ResponseEntity.ok("Your product has been deleted successfully.");
            } else {
                return ResponseEntity.status(403).body("You can not delete product of other producers.");
            }
        }
        return ResponseEntity.status(403).body("You don't have access to delete products.");
    }
}
