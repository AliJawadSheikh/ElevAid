# ElevAid API - Sequence Diagrams

This document contains sequence diagrams showcasing the API flows for each endpoint in the ElevAid backend system.

## 1. Upload Record Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    
    Client->>API: POST /api/upload-record
    Note over Client,API: {diagnosis, status, note}
    
    API->>API: Validate all fields
    alt Validation Failed
        API-->>Client: 400 Bad Request
        Note over API,Client: Missing or empty fields
    else Validation Passed
        API->>DB: INSERT INTO records
        DB-->>API: Record ID
        API-->>Client: 201 Created
        Note over API,Client: {success: true, recordId: 1}
    end
```

## 2. Get Active Problems Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    
    Client->>API: GET /api/problems/active
    
    API->>DB: SELECT id, diagnosis FROM records WHERE status = 'active'
    DB-->>API: [{id: 1, diagnosis: "Hypertension"}, {id: 3, diagnosis: "Diabetes"}]
    
    API-->>Client: 200 OK
    Note over API,Client: {success: true, problems: [...], count: 2}
```

## 3. Get Resolved Problems Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    
    Client->>API: GET /api/problems/resolved
    
    API->>DB: SELECT id, diagnosis FROM records WHERE status = 'resolved'
    DB-->>API: [{id: 2, diagnosis: "Common Cold"}]
    
    API-->>Client: 200 OK
    Note over API,Client: {success: true, problems: [...], count: 1}
```

## 4. Problem Summary Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    participant AI as AI Service
    
    Client->>API: GET /api/problem-summary/1
    
    API->>API: Validate ID parameter
    alt Invalid ID
        API-->>Client: 400 Bad Request
    else Valid ID
        API->>DB: SELECT note FROM records WHERE id = 1
        alt Record Not Found
            DB-->>API: null
            API-->>Client: 404 Not Found
        else Record Found
            DB-->>API: "Patient shows improvement in blood pressure readings"
            API->>AI: Generate layman summary
            AI-->>API: "The patient is getting better in blood pressure measurements"
            API-->>Client: 200 OK
            Note over API,Client: {original_note, ai_summary}
        end
    end
```

## 5. Search Problems Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    
    Client->>API: GET /api/problems/search?q=hypertension
    
    API->>API: Validate query parameter
    alt Missing Query
        API-->>Client: 400 Bad Request
    else Valid Query
        API->>DB: SELECT * FROM records WHERE diagnosis LIKE '%hypertension%' OR note LIKE '%hypertension%'
        DB-->>API: [{id: 1, diagnosis: "Hypertension", status: "Active", note: "..."}]
        
        API-->>Client: 200 OK
        Note over API,Client: {success: true, results: [...], count: 1, query: "hypertension"}
    end
```

## 6. Complete API Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API as ElevAid API
    participant DB as SQLite Database
    participant AI as AI Service
    
    User->>Frontend: Create new medical record
    Frontend->>API: POST /api/upload-record
    API->>DB: Insert record
    DB-->>API: Record ID
    API-->>Frontend: Success response
    Frontend-->>User: Record created
    
    User->>Frontend: View active problems
    Frontend->>API: GET /api/problems/active
    API->>DB: Query active records
    DB-->>API: Active problems list
    API-->>Frontend: Problems data
    Frontend-->>User: Display active problems
    
    User->>Frontend: Search for specific condition
    Frontend->>API: GET /api/problems/search?q=diabetes
    API->>DB: Search records
    DB-->>API: Matching records
    API-->>Frontend: Search results
    Frontend-->>User: Display search results
    
    User->>Frontend: Get AI summary
    Frontend->>API: GET /api/problem-summary/1
    API->>DB: Get record note
    DB-->>API: Medical note
    API->>AI: Generate layman summary
    AI-->>API: Simplified summary
    API-->>Frontend: Original + AI summary
    Frontend-->>User: Display both summaries
```

## 7. Error Handling Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express API
    participant DB as SQLite Database
    
    Client->>API: Invalid request
    
    alt Validation Error
        API-->>Client: 400 Bad Request
        Note over API,Client: {error: "Validation error", message: "..."}
    else Database Error
        API->>DB: Database operation
        DB-->>API: Error
        API-->>Client: 500 Internal Server Error
        Note over API,Client: {error: "Server error", message: "..."}
    else Not Found
        API->>DB: Query record
        DB-->>API: No results
        API-->>Client: 404 Not Found
        Note over API,Client: {error: "Not found", message: "..."}
    end
```

## 8. Database Schema Overview

```mermaid
erDiagram
    RECORDS {
        integer id PK
        text diagnosis
        text status
        text note
        datetime created_at
        datetime updated_at
    }
    
    RECORDS ||--o{ ACTIVE_PROBLEMS : "status = 'active'"
    RECORDS ||--o{ RESOLVED_PROBLEMS : "status = 'resolved'"
    RECORDS ||--o{ SEARCH_RESULTS : "diagnosis/note LIKE query"
```

## 9. API Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Application]
        Mobile[Mobile App]
        CLI[CLI Tool]
    end
    
    subgraph "API Layer"
        Express[Express.js Server]
        Routes[Route Handlers]
        Middleware[CORS, Body Parser]
    end
    
    subgraph "Business Logic"
        Validation[Input Validation]
        AI[AI Summary Service]
        Search[Search Logic]
    end
    
    subgraph "Data Layer"
        SQLite[(SQLite Database)]
        Records[(Records Table)]
    end
    
    subgraph "Documentation"
        Swagger[Swagger UI]
        Docs[API Documentation]
    end
    
    Web --> Express
    Mobile --> Express
    CLI --> Express
    
    Express --> Routes
    Routes --> Validation
    Validation --> AI
    Validation --> Search
    
    AI --> SQLite
    Search --> SQLite
    Routes --> SQLite
    
    Express --> Swagger
    Swagger --> Docs
```

## 10. Request/Response Flow

```mermaid
flowchart TD
    A[Client Request] --> B{Valid Request?}
    B -->|No| C[Return 400 Error]
    B -->|Yes| D[Process Request]
    D --> E{Database Operation}
    E -->|Success| F[Format Response]
    E -->|Error| G[Return 500 Error]
    F --> H[Return 200/201 Success]
    C --> I[Client Receives Error]
    G --> I
    H --> J[Client Receives Data]
```

---

## Notes

- All diagrams use **Mermaid** syntax for easy rendering in GitHub, GitLab, and other Markdown viewers
- Diagrams showcase both **happy path** and **error scenarios**
- The architecture follows **RESTful API** principles
- **Error handling** is consistent across all endpoints
- **Database operations** are optimized with prepared statements
- **AI integration** is modular and can be easily replaced with different providers

These diagrams provide a clear visual representation of how the ElevAid API handles different types of requests and interactions between system components. 