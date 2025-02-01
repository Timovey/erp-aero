import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import initRoutes from './router';
import handleError from './middleware/errorMiddleware';
import AppDataSource from './db';
import { initCrone } from './helpers/sheduleHelper';

async function start() {
	try {
		const app_port = Number(process.env.PORT ?? 8002);
		const app = express();

		//соединение с БД
		await AppDataSource.initialize();

		//подключаем CORS
		app.use(
			cors({
				origin: true,
				exposedHeaders: ['access-token', 'refresh-token']
			})
		);

		// app.options('*', cors());

		//конфигурация тела запроса
		app.use(bodyParser.json({ limit: '50mb' }));
		app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

		//создаем http(s) сервер
		const server = http.createServer({}, app);

		//подключаем роуты
		initRoutes(app);

		//обработчик ошибок
		app.use(handleError);

		const app_host = process.env.HOST ?? 'localhost';

		const listen_callback = () =>
			console.log(`🚀 App listening at http://${app_host}:${app_port}`);

		app_host === 'localhost'
			? server.listen(app_port, listen_callback)
			: server.listen(app_port, app_host, listen_callback);

		//удаление токенов
		initCrone();
	} catch (error: any) {
		console.log('О нет', error);
	}
}
start();
