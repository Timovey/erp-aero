import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import 'dotenv/config';

const host = 'localhost';

const AppDataSource = new DataSource({
	type: 'mysql',
	host: host,
	port: 3306,
	username: process.env.DB_USER,
	password: process.env.DB_PSD,
	database: process.env.DB_NAME,
	entities: [path.join(__dirname, 'entity/*')],
	migrations: [path.join(__dirname, 'migrations/*')],
	charset: 'UTF8MB4_GENERAL_CI',
	logging: false,
	synchronize: false
});

export default AppDataSource;
