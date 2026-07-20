FROM node:20-slim

RUN apt-get update && \
    apt-get install -y git git-lfs openssl ca-certificates && \
    git lfs install && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.9.0

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/main.js"]
