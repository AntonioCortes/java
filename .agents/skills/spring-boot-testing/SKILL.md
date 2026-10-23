---
name: spring-boot-testing
description: >-
  Expert Spring Boot testing specialist skill covering modern test pyramid strategies,
  focused test slices (@WebMvcTest, @DataJpaTest, @RestClientTest, @JsonTest),
  full integration tests (@SpringBootTest + Testcontainers with @ServiceConnection),
  AssertJ fluent assertions, BDDMockito, and context caching optimization.
---

# Spring Boot Testing Expert Skill

Guidelines and patterns for creating fast, reliable, maintainable, and isolated tests in Spring Boot applications.

## 1. Core Principles

1. **Test Pyramid Strategy:**
   - **Unit Tests:** Fast, isolated in plain JVM, testing business logic with Mockito and JUnit 5 without starting the Spring context.
   - **Slice Tests:** Focused on a single architectural boundary (`@WebMvcTest`, `@DataJpaTest`, `@JsonTest`, `@RestClientTest`) to verify integration within a specific layer.
   - **Integration Tests:** Complete end-to-end verification (`@SpringBootTest(webEnvironment = RANDOM_PORT)` + Testcontainers).

2. **Narrowest Slice Policy:**
   - Always choose the narrowest possible test slice that provides sufficient confidence.
   - Never use `@SpringBootTest` when testing a controller route (`@WebMvcTest`), a repository query (`@DataJpaTest`), or business logic (`@ExtendWith(MockitoExtension.class)`).

3. **AssertJ Fluent Style:**
   - Use AssertJ exclusively for assertions.
   - Prefer `usingRecursiveComparison()` over field-by-field assertions.
   - Use rich collection assertions: `extracting(...)`, `containsExactly(...)`, `doesNotContain(...)`.

4. **Spring Application Context Caching:**
   - Minimize variations in `@MockBean` / `@MockitoBean` configurations across tests to maximize Spring context reuse.
   - Never mutate shared application context state without cleaning up.

---

## 2. Test Slices Decision Matrix

| Target Layer | Recommended Annotation | Collaborators Strategy | What it Verifies |
| :--- | :--- | :--- | :--- |
| **Service / Business** | `@ExtendWith(MockitoExtension.class)` | `@Mock` + `@InjectMocks` | Business algorithms, validations, exception triggers. |
| **Controller / Web** | `@WebMvcTest(Controller.class)` | `@MockBean` / `@MockitoBean` | HTTP routes, status codes, JSON serialization, `@Valid` bean validation. |
| **Repository / Data** | `@DataJpaTest` | Testcontainers (`@ServiceConnection`) | Queries (JPQL/native), constraints, entity mapping, transactions. |
| **REST Client** | `@RestClientTest(Client.class)` | `MockRestServiceServer` | HTTP client payloads, headers, error response handling. |
| **JSON Mapping** | `@JsonTest` | `JacksonTester<T>` | Jackson serialization, `@JsonProperty`, `@JsonFormat` dates. |
| **End-to-End** | `@SpringBootTest(webEnvironment = RANDOM_PORT)` | Real DB container via Testcontainers | Full workflow: HTTP -> Controller -> Service -> Real DB. |

---

## 3. Best Practices & Code Idioms

### A. Web Layer Testing (`@WebMvcTest`)
```java
@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PetService petService;

    @Test
    void shouldReturn200AndPetJsonWhenExists() throws Exception {
        given(petService.findById(1)).willReturn(new PetDTO(1, "Max", "Dog"));

        mockMvc.perform(get("/petshop/pet/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Max"));
    }
}
```

### B. Persistence Testing with Testcontainers (`@DataJpaTest`)
```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class PetRepositoryTest {

    @Container
    @ServiceConnection // Spring Boot 3.1+ auto-configures JDBC URL, user, pass
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private PetJpaRepository petRepository;

    @Test
    void shouldSaveAndRetrievePet() {
        PetEntity pet = PetEntity.builder().name("Buddy").species("Dog").build();
        PetEntity saved = petRepository.save(pet);

        assertThat(petRepository.findById(saved.getId()))
                .isPresent()
                .get()
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(pet);
    }
}
```

### C. Isolated Unit Testing with Mockito
```java
@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetJpaRepository petRepository;

    @InjectMocks
    private PetServiceImpl underTest;

    @Captor
    private ArgumentCaptor<PetEntity> captor;

    @Test
    void shouldSavePetSuccessfully() {
        PetDTO input = PetDTO.builder().name("Max").build();
        given(petRepository.save(captor.capture())).willReturn(new PetEntity(1L, "Max"));

        PetDTO result = underTest.registerPet(input);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(captor.getValue().getName()).isEqualTo("Max");
    }
}
```
