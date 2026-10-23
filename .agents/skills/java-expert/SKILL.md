---
name: java-expert
description: >-
  Expert-level guidelines, idioms, and patterns for Modern Java (Java 17/21+ LTS),
  functional programming, records, pattern matching, virtual threads, and clean OOP architecture.
---

# Java Expert Skill

Specialized skill for writing clean, idiom-compliant, and high-performance modern Java (Java 17, 21, and beyond).

## Key Principles

1. **Modern Type System & Immutability:**
   - Prefer **Records** (`record PetDTO(...)`) for immutable data carriers and DTOs over verbose POJOs with getters/setters.
   - Use **Sealed Classes and Interfaces** (`sealed interface PaymentMethod permits CreditCard, PayPal, Crypto`) to model closed domain hierarchies and enable exhaustive pattern matching.
   - Use **Pattern Matching for switch and instanceof**:
     ```java
     if (response instanceof SuccessResponse(var data, var timestamp)) { ... }
     ```

2. **Functional Programming & Streams:**
   - Prefer pure functions without side-effects inside `.map()`, `.filter()`, and `.reduce()`.
   - Never use `.parallelStream()` indiscriminately: it uses the shared `ForkJoinPool.commonPool()` and can degrade throughput if I/O blocking occurs.
   - Use `Stream.toList()` (Java 16+) instead of `.collect(Collectors.toList())` for unmodifiable collections.

3. **Concurrency & Virtual Threads (Java 21+):**
   - Use `Executors.newVirtualThreadPerTaskExecutor()` for high-throughput I/O-bound workloads (REST clients, database calls).
   - Avoid `synchronized` blocks inside virtual threads if they pin the carrier thread (prefer `ReentrantLock`).

4. **Defensive Coding & Null Safety:**
   - Use `Optional<T>` **only as return types** for methods that might legitimately find no result; never use `Optional` for method parameters, fields, or collections.
   - Use `Objects.requireNonNull(arg, "arg must not be null")` in constructors.
