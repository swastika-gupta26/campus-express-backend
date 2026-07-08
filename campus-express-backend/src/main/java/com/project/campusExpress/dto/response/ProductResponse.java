package com.project.campusExpress.dto.response;

import com.project.campusExpress.entity.Product;

public class ProductResponse {
    private Long id;
    private String name;
    private Double price;
    private Integer stockQuantity;
    private String createdByUsername;
    private String description;


    public static ProductResponse from(Product product){
        ProductResponse dto =new ProductResponse();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.price = product.getPrice();
        dto.stockQuantity = product.getStockQuantity();
        dto.description = product.getDescription();
        dto.createdByUsername= product.getCreatedBy()!=null?
                               product.getCreatedBy().getUsername():null;

        return dto;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
    public Integer getStockQuantity() { return stockQuantity; }
    public String getCreatedByUsername() { return createdByUsername; }
    public String getDescription() { return description; }
}
