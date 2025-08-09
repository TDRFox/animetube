# AnimeTube — Minimal local setup (Generated)

Contenu minimal pour lancer en local :
- API Node/Express (upload route)
- Worker (BullMQ skeleton)
- Transcoder (FFmpeg script + Dockerfile)
- Frontend prototype (React component)
- docker-compose.yml (dev with MinIO, Postgres, Mongo, Redis)

## Lancer en local (dev)
Prérequis: Docker & Docker Compose

1. Copier `.env.example` vers `.env` dans le dossier `api/` et remplir les variables si besoin.
2. `cd /workspace/anime-tube` (ou l'endroit où tu as extrait le zip)
3. `docker-compose up --build`
4. API disponible sur http://localhost:3000 (expose dev)

Notes:
- MinIO est fourni pour simuler un stockage S3 local.
- Ce dépôt est un prototype minimal : sécurités, production hardening, et intégrations (Whisper, ACRCloud) doivent être ajoutées.


## Added API endpoints
- /api/auth/login  (POST) -> sets httpOnly cookie `token`
- /api/auth/logout (POST) -> clears cookie
- /api/admin/presign (POST) -> requires admin JWT cookie, returns presigned PUT URL
- /api/admin/action (POST) -> admin action (approve/reject)
- /api/admin/dmca (POST) -> generates DMCA text file and signed GET URL

Use in development with MinIO (configured in docker-compose).