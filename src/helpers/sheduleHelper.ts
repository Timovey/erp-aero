import nodeCron from 'node-cron';
import AppDataSource from '../db';
import { ExpiredToken } from '../db/entity/ExpiredToken';
import { LessThan } from 'typeorm';

export function initCrone() {
	//каждый час
	nodeCron.schedule('0 * * * *', async () => {
		const tokenRep = AppDataSource.getRepository(ExpiredToken);

		await tokenRep.delete({
			expired: LessThan(new Date())
		});
	});
}
