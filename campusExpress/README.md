Campus Express - Backend REST API
A REST API backend built using Spring Boot and MySQL to handle hyper-local logistics, inventory, and order systems across university campuses.

#Key Features and Business Logic Implemented:
* Domain Mapping: Modeled relationships between User, Product, and Order using JPA annotations (@ManyToOne, @OneToMany).

* Inventory Control: Multi-quantity stock tracking with stock validation and handles out-of-stock scenarios gracefully.

* Relationship Traversal Queries: Customized derived queries (findByUserHostelName) using Spring Data JPA for location-specific order filtering.

* Global Exception Handling: Implemented an enterprise standard @ControllerAdvice architecture to catch Runtime Exceptions and dispatch uniform 404 Not Found JSON payloads.

#Tech Stack
* Language: Java 21

* Framework: Spring Boot (Spring Web, Spring Data JPA)

* Database: MySQL

* Testing Client: Postman