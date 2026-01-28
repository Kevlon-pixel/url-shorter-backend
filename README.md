## Сократитель URL (backend)

Серверная часть приложения для сокращения ссылок на NestJS.

### Требования

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker + Docker Compose (если запускаете через контейнеры)

### Переменные окружения

Скопируйте переменные из `.env.example` и заполните `.env`:

- `PORT` — порт приложения
- `DATABASE_URL` — строка подключения к PostgreSQL
- `REDIS_HOST`, `REDIS_PORT` — Redis
- `SERVER_URL` — внешний адрес сервера (используется для формирования коротких ссылок)
- `CLIENT_URL` — адрес фронтенда

### Пошаговая инструкция для локальной разработки

```bash
1. npm install
2. npx prisma generate
3. npx prisma migrate dev
4. npm run start:dev
```

### Docker

```bash
docker compose up --build -d
```
