package com.project.campusExpress.controller;


import com.project.campusExpress.dto.response.ProductResponse;
import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.exception.ResourceNotFoundException;
import com.project.campusExpress.exception.UnauthorizedException;
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
import java.util.stream.Collectors;

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
    public List<ProductResponse> getAllProducts(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String username = jwtservice.extractUsername(token);
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return productRepository.findByCreatedByIdNot(currentUser.getId())
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }
    @GetMapping("/my-listings")
    public List<ProductResponse> getMyProducts(@RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String username = jwtservice.extractUsername(token);
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return productRepository.findByCreatedById(currentUser.getId())
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ProductResponse createProduct(@RequestBody Product product, @RequestHeader("Authorization") String tokenHeader) {
        String token = tokenHeader.substring(7);
        String username = jwtservice.extractUsername(token);
        User producer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        //if product already exists, only increase its stockQuantity
        Optional<Product> existing =productRepository.findByNameIgnoreCaseAndPriceAndCreatedBy(
                product.getName(), product.getPrice(), producer
        );
        if(existing.isPresent()){
            Product existingProduct=existing.get();
            existingProduct.setStockQuantity(existingProduct.getStockQuantity()+product.getStockQuantity());
            return ProductResponse.from(productRepository.save(existingProduct));
        }
        product.setCreatedBy(producer);
        return ProductResponse.from(productRepository.save(product));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId, @AuthenticationPrincipal UserDetails userDetails) {
        String currentUsername = userDetails.getUsername();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
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
                throw new UnauthorizedException("You cannot delete another producer's product.");
            }
        }
        throw new UnauthorizedException("You don't have access to delete products.");
    }
    @GetMapping("/all")
    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }
}
