# Railway build for the Kokoro static site + tiny clean-URL server.
# Deterministic on purpose: pins Node 20 and uses npm, so Railway's builder
# auto-detection (bun lockfile / EOL Node) can't break the deploy.
FROM node:20-slim
WORKDIR /app

# Install server deps (express). npm install (not ci) — no lockfile needed.
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy the site source and build dist/ via the existing cp script.
COPY . .
RUN npm run build

# server.js binds process.env.PORT (Railway injects it at runtime).
CMD ["node", "server.js"]
