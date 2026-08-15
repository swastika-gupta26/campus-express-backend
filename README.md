# Campus Express

A full-stack hyper-local campus marketplace and delivery platform where students can buy and sell products within their university ecosystem.

Live Demo: https://campus-express-frontend.vercel.app

## Features

* JWT Authentication & Role-Based Access Control (Consumer, Producer, Admin)
* Marketplace for browsing and purchasing campus products
* Product creation, update, deletion, and inventory management
* Real-time stock validation with automatic stock updates and rollback on cancellation
* Order creation, status updates, and cancellation
* Notifications for order status changes with unread tracking
* Profile management with input validation
* Product snapshots preserved in orders even after product updates or deletion
* Transaction-safe order and inventory operations using `@Transactional`
* Centralized exception handling using `@ControllerAdvice`

## Tech Stack

| Layer       | Technologies                                                           |
| ----------- | ---------------------------------------------------------------------- |
| Backend     | Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate, JWT |
| Frontend    | React, Axios, Tailwind CSS                                             |
| Database    | MySQL-compatible TiDB Cloud Serverless                                 |
| Deployment  | Render, Docker, Vercel                                                 |
| API Testing | Postman                                                                |

## Architecture

```text
React (Vercel)
      ↓
Spring Boot REST API (Render + Docker)
      ↓
TiDB Cloud Serverless
```

The backend follows a layered architecture:

```text
Controller → Service → Repository → Entity
```

Sensitive configuration such as database credentials and JWT secrets is managed through environment variables.

## Database

The application uses JPA/Hibernate to model relationships between:

* User ↔ Product
* User ↔ Order
* Product ↔ Order
* User ↔ Notification

Historical orders remain intact even when their associated products are deleted.

## API Testing

APIs were tested using Postman, covering:

* Authentication
* Product and inventory operations
* Order creation, status updates, and cancellation
* Notifications
* Role-based authorization
* Validation and error handling

## Deployment

* Frontend: Vercel
* Backend: Dockerized Spring Boot service on Render
* Database: TiDB Cloud Serverless
* Configuration: Environment variables for secrets and deployment-specific settings

## Project Highlights

* Secure REST APIs using Spring Security and JWT
* Role-based authorization
* Relational database design using JPA/Hibernate
* Transaction-safe business workflows
* React and Spring Boot integration
* Production deployment with CORS, environment configuration, and SSL setup
