package com.project.campusExpress.dto.response;

import com.project.campusExpress.entity.Order;

import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private Double totalPrice;
    private String status;
    private Integer quantity;
    private String buyerUsername;
    private String buyerHostel;
    private String productName;
    private Double productPrice;
    private String cancelReason;
    private String deliveryAddress;
    private String contactNumber;
    private String productSnapshot;
    private Double priceSnapshot;
    private LocalDateTime orderDate;
    private LocalDateTime deliveredAt;



    public static OrderResponse from(Order order){
        OrderResponse dto=new OrderResponse();
        dto.id = order.getId();
        dto.totalPrice = order.getTotalPrice();
        dto.status = order.getStatus();
        dto.quantity = order.getQuantity();
        if(order.getUser()!=null){
            dto.buyerUsername=order.getUser().getUsername();
            dto.buyerHostel=order.getUser().getHostelName();
        }
        if(order.getProduct()!=null){
            dto.productName=order.getProduct().getName();
            dto.productPrice=order.getProduct().getPrice();
        } else {

            dto.productName = order.getProductSnapshot();
            dto.productPrice = order.getPriceSnapshot();
        }
        dto.cancelReason=order.getCancelReason();
        dto.deliveryAddress = order.getDeliveryAddress();
        dto.contactNumber = order.getContactNumber();
        dto.productSnapshot = order.getProductSnapshot();
        dto.priceSnapshot = order.getPriceSnapshot();
        dto.orderDate = order.getOrderDate();
        dto.deliveredAt = order.getDeliveredAt();


        return dto;
    }
    public Long getId() { return id; }
    public Double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
    public Integer getQuantity() { return quantity; }
    public String getBuyerUsername() { return buyerUsername; }
    public String getBuyerHostel() { return buyerHostel; }
    public String getProductName() { return productName; }
    public Double getProductPrice() { return productPrice; }
    public String getCancelReason(){ return cancelReason; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getContactNumber() { return contactNumber; }
    public String getProductSnapshot() { return productSnapshot; }
    public Double getPriceSnapshot() { return priceSnapshot; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
}
