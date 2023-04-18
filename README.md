# Glitter Boys

[![Netlify Status](https://api.netlify.com/api/v1/badges/3cc65fd7-3f90-4046-a8a9-1f7cece21f11/deploy-status)](https://app.netlify.com/sites/glitter-boys/deploys) [![CI](https://github.com/shepherdjerred/glitter-boys/actions/workflows/ci.yml/badge.svg)](https://github.com/shepherdjerred/glitter-boys/actions/workflows/ci.yml)

## Setup

### Backend

The backend is intended to be hosted on [fly.io](https://fly.io/), although there is no reason it cannot be deployed elsewhere. The following need to be setup before deployment:

- A persistent data volume should be mounted at `/data`, which will host the SQLite database
- The environment variable `APPLICATION_ID` should be set
- The environment variable `DISCORD_TOKEN` should be set

## Deploy

```bash
earthly -P +deploy.backend --stage=beta
```
