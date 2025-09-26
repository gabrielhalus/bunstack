<p align="left">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun Badge" />
  <img src="https://img.shields.io/badge/Hono-FF7E1B?style=for-the-badge&logo=hono&logoColor=white" alt="Hono Badge" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite Badge" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge" />
</p>

## Development

### 1. Clone the repository

```bash
git clone https://github.com/gabrielhalus/bunstack.git --depth=1
cd bunstack
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Create `.env` Files

Each app/package has its own `.env.example` file. Copy it to `.env.local` (ignored by Git) and customize values as needed.

```bash
# Backend
cp apps/api/.env.example apps/api/.env.local

# Web frontend
cp apps/web/.env.example apps/web/.env.local

# Auth frontend
cp apps/auth/.env.example apps/auth/.env.local
```

> For a complete list of all environment variables, their purpose, default values, and which apps use them, check the [Environment Variables Documentation](docs/env.md).

### 4. Generate SQLite Database

```bash
bun run drizzle:push
```

> This will create the SQLite database with the required schema.

### 5. Start the Dev Servers

Run all apps concurently:

```bash
bun run dev
```

Or start individually:

```bash
# API
cd apps/api
bun run dev

# Auth
cd apps/auth
bun run dev

# Web
cd apps/web
bun run dev
```

## Linting (ESLint)

This monorepo includes ESLint configs for all apps and packages. To check code style and catch errors, run:

```bash
bun run lint
```

This will run linting across all workspaces.

Make sure to fix lint warnings/errors before committing to maintain code quality.

## Author

Gabriel Halus https://github.com/gabrielhalus

## License

Distribued under the CC BY-NC 4.0 License. See [LICENSE](https://github.com/gabrielhalus/bunstack/blob/main/LICENSE) for more information.
