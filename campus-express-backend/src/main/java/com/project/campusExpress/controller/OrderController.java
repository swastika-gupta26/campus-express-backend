package com.project.campusExpress.controller;

import com.project.campusExpress.dto.request.CancelRequest;
import com.project.campusExpress.dto.response.OrderResponse;
import com.project.campusExpress.entity.Notification;
import com.project.campusExpress.entity.Order;
import com.project.campusExpress.entity.Product;
import com.project.campusExpress.entity.User;
import com.project.campusExpress.exception.BadRequestException;
import com.project.campusExpress.exception.ResourceNotFoundException;
import com.project.campusExpress.exception.UnauthorizedException;
import com.project.campusExpress.repository.NotificationRepository;
import com.project.campusExpress.repository.OrderRepository;
import com.project.campusExpress.repository.ProductRepository;
import com.project.campusExpress.repository.UserRepository;
import com.project.campusExpress.service.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }


    @PostMapping("/product/{productId}")
    @Transactional
    public OrderResponse createOrder(@PathVariable Long productId, @RequestBody Order order,@RequestHeader("Authorization") String tokenHeader) {

        String token= tokenHeader.substring(7);
        String username= jwtservice.extractUsername(token);


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Integer orderedQuantity = order.getQuantity(); //stockQuantity update after placing order
        if (product.getStockQuantity() < orderedQuantity) {
            throw new BadRequestException("Stock is not enough. Only! " + product.getStockQuantity() + " products are left");
        } else {
            product.setStockQuantity(product.getStockQuantity() - orderedQuantity);
        }

           Double totalPrice= product.getPrice()*orderedQuantity;
        order.setTotalPrice(totalPrice);

        order.setDeliveryAddress(order.getDeliveryAddress());
        order.setContactNumber(order.getContactNumber());

        productRepository.save(product);

        order.setProduct(product);
        order.setUser(user); //updating user_id column in order table

        order.setProductSnapshot(product.getName());
        order.setPriceSnapshot(product.getPrice());
        order.setOrderDate(LocalDateTime.now());
        return OrderResponse.from(orderRepository.save(order));
    }

    @PutMapping("/{orderId}/status") //order status update
    public OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found!"));

        order.setStatus(newStatus);
        if ("DELIVERED".equals(newStatus)) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        String message= "Your order for " + order.getProductSnapshot()+ " is now "+ newStatus+".";
        Notification notification = new Notification( order.getUser(), message);
        notificationRepository.save(notification);

        return OrderResponse.from(orderRepository.save(order));
    }

    @GetMapping("/hostel/{hostelName}")
    public List<OrderResponse> getOrdersByHostel(@PathVariable String hostelName) {
        return orderRepository.findByUserHostelName(hostelName)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/my-sales")
    public List<OrderResponse> getMyOrders(Principal principal){
        String username= principal.getName();
        User producer=userRepository.findByUsername(username)
                .orElseThrow(()->new ResourceNotFoundException("User not found!"));
        return orderRepository.findByProductCreatedBy(producer)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }
    @GetMapping("/my-orders")
            public List<OrderResponse> getMyOrderHistory(Principal principal){
        String username =principal.getName();
        User buyer =userRepository.findByUsername(username)
                .orElseThrow(()->new ResourceNotFoundException("User not found!"));
        return orderRepository.findByUser(buyer)
                .stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }
    @PutMapping("/{orderId}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestBody CancelRequest request, Principal principal){
        String username=principal.getName();
        Order order= orderRepository.findById(orderId)
                .orElseThrow(()->new ResourceNotFoundException("Order not found!"));

        if(order.getUser().getUsername().equals(username)==false){
            throw new UnauthorizedException("You can only cancel your own orders.");
        }


        //stock rollback
        Product product=order.getProduct();
        product.setStockQuantity(order.getQuantity()+ product.getStockQuantity());
        productRepository.save(product);


        order.setStatus("CANCELLED");
        order.setCancelReason(request.getReason());
        orderRepository.save(order);

        return ResponseEntity.ok(OrderResponse.from(order));
    }
}
