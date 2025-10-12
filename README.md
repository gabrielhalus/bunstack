<p align="left">
  <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun Badge" />
  <img src="https://img.shields.io/badge/Hono-FF7E1B?style=for-the-badge&logo=hono&logoColor=white" alt="Hono Badge" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge" />
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
cp apps/dashboard/.env.example apps/dashboard/.env.local

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
cd apps/dashboard
bun run dev
```

### 6. Local Reverse Proxy with Caddy (HTTPS Subdomains)

To test production-like cookie behavior (cross-subdomain cookies with SameSite=None), we serve apps via HTTPS subdomains using `Caddyfile.dev`.

#### 1. Install Caddy

##### macOS (Homebrew):

```bash
brew install caddy
```

##### Linux (Debian/Ubuntu)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

#### 2. Configure `/etc/hosts` (Linux/macOS)

Add these lines to map custom local domains to `127.0.0.1`:

```text
127.0.0.1 localhost.dev api.localhost auth.localhost.dev
```

- On Linux: `sudo vim /etc/hosts`
- On macOS: `sudo vim /etc/hosts`

#### 3. Run Caddy

```bash
PROJECT_ROOT=$(pwd) caddy run --config Caddyfile.dev
```

- Your apps are now available at:
   - https://localhost.dev → dashboard
   - https://api.localhost.dev → API
   - https://auth.localhost.dev → Auth

> Optional: You can also use caddy stop and caddy start to manage it in the background.

#### 4. Trust the Caddy Root Certificate

Caddy generates a local CA for HTTPS. Add it to your system trust store to avoid browser warnings:

##### macOS:

- Open `~/Library/Application Support/Caddy/pki/authorities/local/root.crt`
- Add to Keychain → Always Trust

##### Windows:

- Open `%AppData%\Caddy\pki/authorities/local/root.crt`
- Install → Local Machine → Trusted Root Certification Authorities

Once trusted, cross-subdomain cookies will work correctly in dev.

##### Linux (Ubuntu/Debian):

```bash
sudo cp $HOME/.local/share/caddy/pki/authorities/local/root.crt /usr/local/share/ca-certificates/caddy-root.crt
sudo update-ca-certificates
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
