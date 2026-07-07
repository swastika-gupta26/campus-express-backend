# Campus Express - Backend REST API

Campus Express is a secure and scalable REST API built using Spring Boot for managing hyper-local campus commerce and logistics. The system enables role-based product management, inventory tracking, and order processing within a university ecosystem.

## Overview

The application supports three user roles:

* **Consumer** – Browse products and place orders.
* **Producer** – Manage products and inventory, and update order statuses.
* **Admin** – Full system-level control, including product management and administrative operations.

The project follows a layered architecture with Controller, Service, Repository, and Entity layers to ensure maintainability and separation of concerns.

## Features

### Authentication & Authorization

* Implemented stateless authentication using JWT (JSON Web Tokens).
* Secured REST endpoints with Spring Security.
* Role-Based Access Control (RBAC) for Consumers, Producers, and Admins.

### Product & Inventory Management

* Producers can add and remove products from inventory.
* Real-time stock tracking and validation.
* Prevents order placement when requested quantity exceeds available stock.
* Automatic inventory updates after successful order creation.

### Order Management

* Consumers can place orders for available products.
* Producers can update order statuses.
* Order workflows are protected through role-based authorization.

### Database Design

* Modeled entity relationships using JPA and Hibernate:
  * Product -> User
  * Order -> User
* Implemented relational mappings using `@ManyToOne`.
* Created derived queries with Spring Data JPA for location-specific filtering and delivery optimization.

### Transaction Management

* Used `@Transactional` to ensure atomic operations during order creation and stock deduction.
* Prevents partial database updates and guarantees rollback on failures.

### Exception Handling

* Implemented centralized exception handling using `@ControllerAdvice`.
* Returned consistent and structured JSON error responses for business and runtime exceptions.

## Technology Stack

* Java 21
* Spring Boot 3.x
* Spring Security
* Spring Data JPA (Hibernate)
* JWT Authentication
* MySQL
* Maven
* Postman

