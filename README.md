# Knossos

> A DevOps portfolio project. The application itself — a small NestJS warehouse API — is deliberately simple. The point is everything around it: containerization, CI/CD, infrastructure as code, and cloud deployment.

[![CI](https://github.com/les-holikov/knossos/actions/workflows/ci.yml/badge.svg)](https://github.com/les-holikov/knossos/actions/workflows/ci.yml)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-AWS-7B42BC?logo=terraform&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-TypeScript-E0234E?logo=nestjs&logoColor=white)

## Why this project exists

Named after the ancient Cretan city and its legendary labyrinth — a fitting name for a project about building and navigating infrastructure. The warehouse domain (products made of components) is just a vehicle; the real subject is the platform underneath it.

## Architecture

```mermaid
flowchart TB
    subgraph GH["🐙 GitHub"]
        direction LR
        Push["Push to master"] --> CI["CI<br/>lint · test · build"]
        CI --> Registry["Push image<br/>to GHCR"]
    end

    subgraph AWS["☁️ AWS EC2 — Terraform-provisioned"]
        direction LR
        Compose["docker compose<br/>pull && up -d"] --> API["api<br/>NestJS"]
        API --> PG[("Postgres")]
        API --> Redis[("Redis")]
    end

    subgraph Local["💻 Local machine"]
        direction LR
        Prom["Prometheus"] --> Graf["Grafana"]
    end

    Registry -- "CD: SSH deploy" --> Compose
    Prom -. scrapes .-> API
```

## Stack

**Application**
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?logo=typeorm&logoColor=white)

**Data**
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

**Containers**
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white)

**CI/CD**
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![GHCR](https://img.shields.io/badge/GHCR-181717?logo=github&logoColor=white)

**Infrastructure**
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?logo=terraform&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonec2&logoColor=white)

**Monitoring** *(run locally against the deployed host)*
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?logo=grafana&logoColor=white)

## What's implemented

- ✅ NestJS API with a Product / Component / ProductComponent domain (join entity with its own `quantity`, not a bare many-to-many)
- ✅ Redis caching on read endpoints with cache invalidation on writes
- ✅ Multi-stage Dockerfile + Docker Compose with healthchecks for Postgres and Redis
- ✅ CI pipeline: lint, unit tests, build, image push to GitHub Container Registry
- ✅ CD pipeline: automatic deploy to AWS EC2 on push to `master`
- ✅ Infrastructure provisioned with Terraform (EC2, Security Group, Key Pair)
- ✅ Local Prometheus/Grafana monitoring of the deployed stack

## In progress

- 🔄 PostgreSQL primary + replica (native streaming replication)
- 🔄 PgBouncer / HAProxy as a connection routing layer
- 🔄 `postgres_exporter` wired into the existing Grafana dashboards

## Running locally

```bash
git clone https://github.com/les-holikov/knossos.git
cd knossos
cp .env.example .env   # fill in your own values
docker compose up -d --build
```

The API will be available at `http://localhost:3000`.

## Infrastructure

The AWS infrastructure is fully described in [`infra/`](./infra) using Terraform:

```bash
cd infra
terraform init
terraform plan
terraform apply
```

## License

MIT

