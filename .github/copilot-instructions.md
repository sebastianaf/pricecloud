# Copilot Instructions for pricecloud

## Project Overview
- **pricecloud** is a multi-service prototype for cloud cost evaluation and provisioning, primarily using Libcloud for AWS, with a modular architecture spanning multiple APIs and a Next.js UI.
- The system is containerized using Docker Compose, with each service (api-01, api-02, api-03, ui) in its own directory and Dockerfile.
- The architecture diagram is available at `latex/gfx/services.drawio.png` and referenced in the main `README.md`.

## Key Components
- **api-01**: Node.js/NestJS service. Modules: user, auth, compute, storage, price, seed, common, email, log. See `api-01/README.md` for module docs and commands.
- **api-02**: Node.js service with GraphQL, event handling, and scrapers. See `api-02/src/` for structure.
- **api-03**: Python (Flask) service for additional compute/storage logic.
- **ui**: Next.js React frontend. Pages in `ui/pages/`, components in `ui/src/components/`.
- **latex/**: Contains documentation, including the architecture diagram and thesis chapters.

## Developer Workflows
- **Setup**: Clone repo, create `.env` files from `.env.example` in each service. For UI production, use `.env.production`.
- **Build & Run (Dev)**: Use `docker-compose up` from the root for all services. For individual services:
  - `api-01`: `npm install`, then `npm run start:dev`
  - `api-02`: `npm install`, then `npm run dev`
  - `api-03`: `pip install -r requirements.txt`, then `python run.py`
  - `ui`: `npm install`, then `npm run dev`
- **Testing**:
  - `api-01`: E2E tests in `api-01/test/`, run with `npm run test:e2e`
- **Environment Variables**: Managed per service. For `api-01`, validate in `validation-schema.ts` and `docker-compose.yml`.
- **Reverse Proxy**: For internet deployment, see Docker Compose and README for DuckDNS and proxy setup.

## Conventions & Patterns
- **Modular Structure**: Each API has clear module boundaries (see `api-01/src/` subfolders).
- **Docs**: API module docs are linked in `api-01/README.md`.
- **External Integrations**: Uses Libcloud for AWS, DuckDNS for dynamic DNS, and recommends nginx-proxy-manager for reverse proxy.
- **Data Flow**: UI communicates with APIs via REST/GraphQL endpoints. APIs may communicate internally (see `api-02/src/events.ts`).

## References
- Main project README: `README.md`
- API-01 docs: `api-01/README.md`
- Architecture diagram: `latex/gfx/services.drawio.png`
- Docker Compose: `docker-compose.yml`

---

**Update this file if you add new services, change build/test workflows, or introduce new architectural patterns.**
