# ERP-AERO

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
