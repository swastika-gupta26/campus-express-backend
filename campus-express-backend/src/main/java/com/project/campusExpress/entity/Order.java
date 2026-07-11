package com.project.campusExpress.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.ForeignKey;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;
    private String status;
    private Integer quantity;
    private String cancelReason;
    private String deliveryAddress;
    private String contactNumber;
    private String productSnapshot;
    private Double priceSnapshot;
    private LocalDateTime orderDate;
    private LocalDateTime deliveredAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true,
            foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private Product product;


    public Order() {
    }


    public Order(Long id, Double totalPrice, String status, Integer quantity, String cancelReason,
                 String deliveryAddress, String contactNumber, String productSnapshot, Double priceSnapshot,
                 LocalDateTime orderDate, LocalDateTime deliveredAt, User user, Product product) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.status = status;
        this.quantity = quantity;
        this.cancelReason = cancelReason;
        this.deliveryAddress = deliveryAddress;
        this.contactNumber = contactNumber;
        this.productSnapshot = productSnapshot;
        this.priceSnapshot = priceSnapshot;
        this.orderDate = orderDate;
        this.deliveredAt = deliveredAt;
        this.user = user;
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getProductSnapshot() {
        return productSnapshot;
    }

    public void setProductSnapshot(String productSnapshot) {
        this.productSnapshot = productSnapshot;
    }

    public Double getPriceSnapshot() {
        return priceSnapshot;
    }

    public void setPriceSnapshot(Double priceSnapshot) {
        this.priceSnapshot = priceSnapshot;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}