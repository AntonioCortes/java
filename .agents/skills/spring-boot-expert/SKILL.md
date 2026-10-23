---
name: spring-boot-expert
description: >-
  Enterprise-grade guidelines and architecture for Spring Boot 3.x, constructor-based
  dependency injection, layered clean architecture, RFC 7807 problem details, and configuration management.
---

# Spring Boot Expert Skill

Specialized skill for building robust, scalable, and maintainable enterprise microservices with Spring Boot 3.x.

## Core Rules & Architecture

1. **Strict Constructor Injection:**
   - **Never use field injection (`@Autowired private Service service;`)**: it prevents testing without reflection, hides dependency bloat, and breaks immutability.
   - Use constructor injection with `final` fields (or Lombok `@RequiredArgsConstructor`):
     ```java
     @Service
     @RequiredArgsConstructor
     public class PetServiceImpl implements PetService {
         private final PetRepository petRepository;
     }
     ```

2. **Clean Layered Architecture (SRP):**
   - **Controller Layer (`@RestController`):** Handles only HTTP transport, request mapping, validation (`@Valid`), status codes, and delegates immediately to services. No business logic!
   - **Service Layer (`@Service`):** Orchestrates business use cases, coordinates multiple repositories/clients, and boundaries transactions with `@Transactional`.
   - **Data Access Layer (`@Repository`):** Only database persistence and retrieval.
   - **DTOs & Mappers:** Never leak JPA `@Entity` classes directly into `@RestController` responses (avoids lazy-loading exceptions, circular references, and unintended database updates).

3. **Externalized Configuration:**
   - Use typed immutable Java Records with `@ConfigurationProperties(prefix = "app")` and `@Validated` instead of scattered `@Value` annotations.

4. **Unified Error Handling:**
   - Centralize exceptions using `@RestControllerAdvice` emitting RFC 7807 `ProblemDetail` or a standardized `ErrorResponseDTO`.
