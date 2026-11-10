# ERP-AERO

REST API авторизации и хранения файлов на Express и TypeScript: регистрация и вход по JWT (access + refresh),
отзыв токенов при выходе, загрузка, скачивание, обновление и удаление файлов с метаданными в MySQL.

**Стек:** Node.js · TypeScript · Express · TypeORM · MySQL · JWT (HS256) · Multer · node-cron

## API

| Метод и путь | Назначение |
| --- | --- |
| `POST /signup` | регистрация |
| `POST /signin` | вход, выдача access- и refresh-токенов |
| `POST /signin/new_token` | обновление access-токена по refresh-токену |
| `GET /logout` | выход: токен попадает в список отозванных |
| `GET /info` | данные текущего пользователя |
| `POST /file/upload` | загрузка файла |
| `GET /file/list?page=&list_size=` | список файлов с пагинацией |
| `GET /file/:id` | метаданные файла |
| `GET /file/download/:id` | скачивание файла |
| `PUT /file/update/:id` | замена файла |
| `DELETE /file/delete/:id` | удаление файла |

Отозванные токены хранятся в БД и раз в час очищаются по сроку действия (node-cron).

## Запуск

Описание системы:

- Node v20.12.1
- typescript v5.4.4
- npm v10.5.0
- Windows 10

Запуск:

- устанавливаем зависимости

```bash
npm install
```

- создаем базу даннных MySql: Charset - utf8mb4, Collation - utf8mb4_general_ci
- создаем и корректируем .env файл, по подобию .env.example
- применяем миграции

```bash
npm run migrate
```

- Запускаем проект

```bash
#режим разработки
npm run dev

#режим прода
npm run build
npm run start
```
