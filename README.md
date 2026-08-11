# Campus Express - Full-Stack Marketplace Application

Campus Express is a secure full-stack marketplace application built for hyper-local campus commerce. It enables students to buy and sell products within their university ecosystem with role-based access, inventory management, and order processing.

**Live Demo:** https://campus-express-frontend.vercel.app

## Overview

The application supports three user roles:

* **Consumer** – Browse products and place orders.
* **Producer** – List and manage products, track inventory, and update order statuses.
* **Admin** – Manage products and perform administrative operations.

The backend follows a layered architecture using Controller, Service, Repository, and Entity layers. The frontend is built with React and communicates with the backend through REST APIs.

## Tech Stack

**Backend**

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA (Hibernate)
* JWT
* Maven

**Frontend**

* React
* Axios
* Tailwind CSS

**Database & Deployment**

* TiDB Cloud (MySQL-compatible)
* Render (Dockerized Backend)
* Vercel (Frontend)

## Features

### Authentication & Authorization

* JWT-based stateless authentication.
* Spring Security with Role-Based Access Control (RBAC).
* Supports Consumer, Producer, and Admin roles.

### Product & Inventory

* Producers can create, update, and delete their products.
* Stock validation and automatic inventory updates during orders.
* Users do not see their own listings in the marketplace feed.

### Order Management

* Consumers can place and cancel orders.
* Producers can view and update incoming order statuses.
* Product name and price are preserved in orders at the time of purchase.

### Database & Transactions

* JPA relationships using `@OneToMany` and `@ManyToOne`.
* `@Transactional` ensures atomic order creation and stock updates.
* Centralized exception handling using `@ControllerAdvice`.

## Deployment Architecture


React (Vercel)
      ↓
Spring Boot API (Render)
      ↓
TiDB Cloud


Sensitive configuration such as database credentials and JWT secrets is managed using environment variables.

## API Testing

APIs were tested using Postman, including authentication, product management, inventory validation, order processing, RBAC, and error handling.

## How to Run Locally

1. Clone the repository.
2. Configure database and JWT credentials using environment variables.
3. Start the Spring Boot backend.
4. Start the React frontend.
5. Use Postman or the frontend to interact with the API.
