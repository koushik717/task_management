# TaskFlow — Enterprise Task Management Platform

A production-style task management system with JWT auth, RBAC, pagination/filtering, and OpenAPI docs.

**Tech:** Spring Boot, PostgreSQL, Redis, Docker, GitHub Actions, OpenAPI/Swagger

## Demo
- Live: [Link to Live Demo]
- API Docs (OpenAPI): [Link to Swagger UI]
- Demo credentials: `admin / password` (if applicable)

## Key Features
- **JWT Authentication**: Secure stateless auth with Refresh Token rotation.
- **RBAC**: Role-based access control (Admin vs User scopes).
- **Pagination & Filtering**: Efficient data fetching with Spring Data JPA Specifications.
- **Health Checks**: Spring Boot Actuator for monitoring.

## Architecture
- `api/` Spring Boot REST API
- `db/` PostgreSQL
- `cache/` Redis for session/caching

## Getting Started (Local)
### Prerequisites
- Java 17+
- Docker

### Run with Docker Compose
```bash
docker compose up --build
```

### Run API only
```bash
./mvnw spring-boot:run
```

- **API Base URL**: `http://localhost:8080`
- **Swagger/OpenAPI**: `http://localhost:8080/swagger-ui/index.html`

## Testing
```bash
./mvnw test
```

## Roadmap
- [ ] Refresh tokens usage
- [ ] Integration tests with Testcontainers
- [ ] Rate limiting
