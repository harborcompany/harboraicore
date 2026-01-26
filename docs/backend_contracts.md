# Backend Service Contracts & Mapping

This document maps the visual architecture diagram components to their underlying backend services and API contracts. Engineering teams must treat these as fixed contracts.

## 1. Capture Network
**Nodes**: Contributor Service • Device Ingest • Consent

### Backend Services
- `ContributorService`: Manages user/device identity and reputation.
- `DeviceIngestService`: Handles raw stream ingestion from edge devices.
- `ConsentService`: Cryptographically signs data with user consent policies.

### Core Endpoints
- `POST /capture/upload`: Multipart upload for raw media blobs.
- `POST /capture/consent`: Register consent for a specific capture session.

### Guarantees
- **Identity Attached**: No anonymous data ingestion.
- **Consent Recorded**: Every interaction must have a valid consent signature.
- **Source Immutable**: Metadata about the source device cannot be altered after ingest.

---

## 2. Media Ingestion & Storage
**Nodes**: Chunking • Fingerprinting • Temporal

### Backend Services
- `MediaIngestService`: Orchestrates the intake pipeline.
- `MediaStorageService`: Abstraction over hot/cold storage tiers.
- `ChunkingService`: Splits media into semantically meaningful temporal chunks.

### Core Endpoints
- `POST /media/ingest`: Trigger ingestion workflow.
- `GET /media/{id}`: Retrieve raw or processed media assets.

### Guarantees
- **Chunked Storage**: Data is never stored as monolithic files; always chunked for RAG.
- **Temporal Preservation**: Frame timing and sequence are preserved bit-perfect.
- **Media Fingerprinting**: Content-addressable hashing for deduplication and verification.

---

## 3. Annotation & Curation Fabric
**Nodes**: Review • Versioning • Confidence

### Backend Services
- `AnnotationService`: Manages labels, bounding boxes, and semantic metadata.
- `ReviewService`: Routing logic for human-in-the-loop or automated QA.
- `VersioningService`: Tracks dataset evolution (Git-like semantics for data).

### Core Endpoints
- `POST /annotation/create`: Submit new annotations.
- `POST /annotation/review`: Submit review decisions/corrections.
- `GET /annotation/version`: Retrieve a specific snapshot of truth.

### Guarantees
- **Time-Aligned Labels**: Annotations are strictly bound to timecode ranges.
- **Confidence Scores**: Every label includes a probabilistic confidence score.
- **Version History**: Full audit trail of who changed what and when.

---

## 4. RAG Dataset Engine
**Nodes**: Embedding • Indexing • Retrieval

### Backend Services
- `EmbeddingService`: Generates vector embeddings for media chunks.
- `IndexService`: Manages vector databases (e.g., Pinecone, Milvus, Weaviate).
- `RetrievalService`: Semantic search and context window construction.

### Core Endpoints
- `POST /datasets/embed`: Force re-embedding of a dataset.
- `POST /datasets/query`: RAG-enabled semantic search.

### Guarantees
- **All Datasets Retrievable**: If it's in the system, it's indexed.
- **Feedback Loops Supported**: Usage signals tune ranking models.
- **Version-Aware Querying**: "Query the dataset as it was on Jan 1st."

---

## 5A. Dataset Marketplace
**Nodes**: Catalog • Licensing • Access

### Backend Services
- `DatasetCatalogService`: Public-facing directory and metadata.
- `LicensingService`: Smart contract or ledger-based license management.
- `AccessControlService`: Enforces permissions based on license holdings.

### Core Endpoints
- `GET /datasets`: Public search/list of available data.
- `POST /datasets/license`: Purchase or acquire a license.

### Guarantees
- **License Enforcement**: API keys only work for licensed scopes.
- **SLA-Aware Access**: Tiered rate limits and uptime guarantees.
- **Version Locking**: Buyers purchase specific versions (or subscription to head).

---

## 5B. Ads Creative Engine
**Nodes**: Projects • Prompts • Generation

### Backend Services
- `AdsProjectService`: Project namespaces for creative iterations.
- `PromptCompilerService`: injects RAG context into LLM prompts.
- `GenerationOrchestrator`: Manages async generation jobs across GPU clusters.

### Core Endpoints
- `POST /ads/projects`: Create a new creative workspace.
- `POST /ads/generate`: Trigger a generation job.

### Guarantees
- **Dataset-Backed Generation**: Generations cite their source data (RAG).
- **Deterministic Prompts**: Inputs + Seed = Same Output.
- **Performance Feedback Capture**: Click-through rates fed back into the model.

---

## 6. API Gateway
**Nodes**: Datasets • RAG • Ads • Usage

### Backend Services
- `APIGateway`: The single entry point (Kong, Tyk, or custom).
- `UsageMeteringService`: Counts tokens, GBs, and requests for billing.
- `AuthMiddleware`: Validates JWTs and license keys.

### Core Endpoints
- `/api/datasets`: Routes to Marketplace & RAG services.
- `/api/ads`: Routes to Ads Creative Engine.
- `/api/rag`: Direct RAG access (bypassing marketplace UI).

### Guarantees
- **Single Access Surface**: No side-doors to underlying services.
- **Usage Tracking**: Every request is billed/tracked.
- **Enterprise Readiness**: Rate limiting, localized caching, DDOS protection.
