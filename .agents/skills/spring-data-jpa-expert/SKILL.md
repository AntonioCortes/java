---
name: spring-data-jpa-expert
description: >-
  Expert persistence skill for Spring Data JPA, Hibernate, Relational vs NoSQL (MongoDB),
  database dialect nuances (PostgreSQL vs Oracle), N+1 prevention, entity graphs, and auditing.
---

# Spring Data JPA & NoSQL Expert Skill

Advanced knowledge base for enterprise persistence across relational (PostgreSQL, Oracle) and document (MongoDB) databases.

## 1. Relational Persistence (JPA / Hibernate)

- **Entity Lifecycle & Dirty Checking:** Hibernate tracks entity state in the Persistence Context. Never call `repository.save(entity)` manually inside an active `@Transactional` method when updating an existing entity; dirty checking commits changes automatically upon transaction commit.
- **Solving the N+1 Query Problem:**
  - Avoid `FetchType.EAGER` on `@OneToMany` or `@ManyToMany` collections (causes Cartesian products and unexpected queries).
  - Use `JOIN FETCH` in JPQL or `@EntityGraph(attributePaths = {"owner", "tags"})` on repository methods to fetch associations in a single query.
- **DTO Projections:** Always prefer interface-based projections or constructor expressions (`SELECT new com.example.dto.PetSummaryDTO(p.id, p.name) FROM Pet p`) over fetching full entities when displaying read-only data.

## 2. Database Dialect Nuances: PostgreSQL vs Oracle

- **Boolean Data Type:**
  - *PostgreSQL / MySQL:* Native `BOOLEAN` column type.
  - *Oracle Database (pre-23c):* No native `BOOLEAN` column in SQL DDL! Must use `@Convert(converter = BooleanToStringConverter.class)` or map to `CHAR(1)` (`'Y'`/`'N'`) or `NUMBER(1)` (`1`/`0`).
- **Primary Key Generation:**
  - *PostgreSQL / MySQL:* `GenerationType.IDENTITY` (uses `SERIAL` or `BIGSERIAL` / auto-increment).
  - *Oracle Database:* Historically uses database sequences. Requires `@SequenceGenerator` and `GenerationType.SEQUENCE`:
    ```java
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pet_seq_gen")
    @SequenceGenerator(name = "pet_seq_gen", sequenceName = "PET_SEQ", allocationSize = 1)
    private Long id;
    ```
- **Pagination Syntax:**
  - *PostgreSQL:* `LIMIT :size OFFSET :offset`.
  - *Oracle:* `OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY` (Oracle 12c+) or nested subqueries with `ROWNUM` (Oracle 11g).

## 3. NoSQL Persistence: Spring Data MongoDB

- **Key Differences:**
  - Annotations: `@Document(collection = "pets")` instead of `@Entity` / `@Table`.
  - Identifiers: `@Id private String id;` (ObjectId hex string) instead of numerical auto-increments.
  - Repositories: Extend `MongoRepository<PetDocument, String>` instead of `JpaRepository`.
  - Nested Models: Sub-documents are embedded directly (`private Address address;`) without foreign keys or `@JoinColumn`.
  - Queries: Use JSON / BSON queries (`@Query("{ 'species' : ?0, 'age' : { $gt : ?1 } }")`).
