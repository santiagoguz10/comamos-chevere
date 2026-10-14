FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build
# Next.js standalone output requires static assets + public to be copied manually.
RUN mkdir -p /app/.next/standalone/.next/static && cp -r /app/.next/static/* /app/.next/standalone/.next/static/
RUN if [ -d /app/public ]; then cp -r /app/public /app/.next/standalone/public; fi

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["/bin/sh", "/app/scripts/start.sh"]