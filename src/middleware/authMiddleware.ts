import { NextFunction, Request, Response } from 'express';
import { UnauthorizeError } from '../common/errors';
import AppDataSource from '../db';
import { User } from '../db/entity/User';
import { convertToClass } from '../helpers/convertHelper';
import { UserViewModel } from '../controllers/auth/dto/UserViewModel';
import { privateKey, publicKey, verifyToken } from '../helpers/authHelper';
import { ExpiredToken } from '../db/entity/ExpiredToken';

export default async function (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const accessToken = req.headers['access-token'];
		const refreshToken = req.headers['refresh-token'];

		//в любом случае должно быть 2 токена
		if (!accessToken || !refreshToken) throw new UnauthorizeError();

		//подпись, срок жизни и алгоритм (HS256) проверяются явно; payload берём из результата проверки
		const payload = verifyToken(accessToken, publicKey);
		verifyToken(refreshToken, privateKey);

		//проставляем пользователя в запрос
		if (!payload?.id) {
			throw new UnauthorizeError();
		}

		const tokenRep = AppDataSource.getRepository(ExpiredToken);
		const expiredToken = await tokenRep.findOne({
			where: {
				token: refreshToken
			}
		});
		if (expiredToken) {
			throw new UnauthorizeError();
		}

		const userRep = AppDataSource.getRepository(User);

		const existUser = await userRep.findOne({
			where: {
				id: payload.id
			}
		});
		//пользователь мог быть удалён после выдачи токена: иначе дальше req.user.id падал с TypeError
		if (!existUser) {
			throw new UnauthorizeError();
		}

		req.user = convertToClass(UserViewModel, existUser);

		next();
	} catch (err) {
		next(new UnauthorizeError());
	}
}
