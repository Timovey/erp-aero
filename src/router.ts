import { Express } from 'express';
import filesRoutes from './controllers/file';
import authRoutes from './controllers/auth';

export default function (app: Express) {
	app.use('/file', filesRoutes);
	app.use('/', authRoutes);
}
