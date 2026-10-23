---
name: testing-expert
description: >-
  Testing methodologies, unit, slice, and integration testing for Java and Spring Boot
  using JUnit 5, Mockito, AssertJ, @DataJpaTest, @WebMvcTest, and Testcontainers.
---

# Testing Expert Skill

Guidelines and patterns for creating fast, reliable, and isolated tests across the test pyramid.

## Testing Layers

1. **Unit Tests (Fast, Isolated, No Spring Context):**
   - Test business logic in `@Service` classes using plain **JUnit 5** and **Mockito**:
     ```java
     @ExtendWith(MockitoExtension.class)
     class PetServiceTest {
         @Mock private PetRepository petRepository;
         @InjectMocks private PetServiceImpl petService;
     }
     ```
   - Use **AssertJ** for readable fluent assertions (`assertThat(result).isNotNull().hasFieldOrPropertyWithValue("name", "Buddy");`).
   - Use **BDDMockito** (`given(...).willReturn(...)`, `then(...).should()`) for clearer intent.

2. **Slice Tests (Targeted Spring Context):**
   - **`@WebMvcTest(PetController.class)`:** Tests only the web layer (validation, serialization, HTTP status codes, security filters) using `MockMvc` with `@MockBean` for dependencies.
   - **`@DataJpaTest`:** Tests only repository queries against an in-memory database (H2) or Testcontainers, auto-configuring JPA and rolling back transactions by default.
   - **`@JsonTest`:** Verifies Jackson serialization and deserialization contracts.

3. **Integration Tests (`@SpringBootTest`):**
   - Use `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` only when verifying the entire system end-to-end.
   - Prefer **Testcontainers** (`@Container static PostgreSQLContainer<?> postgres = ...`) over in-memory H2 to test real database dialects, triggers, constraints, and JSONB columns.
