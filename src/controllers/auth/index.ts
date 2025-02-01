import { Request, Router } from 'express';
import validationMiddleware from '../../middleware/validationMiddleware';
import AppDataSource from '../../db';
import { refreshTokenValidators, signinValidators, signupValidators } from './guard';
import { User } from '../../db/entity/User';
import { BadRequestError, ForbiddenError, UnauthorizeError } from '../../common/errors';
import { encodePsd } from '../../helpers/passwordHelper';
import {
	generateAccessToken,
	generateTokens,
	privateKey
} from '../../helpers/authHelper';
import { TokenViewModel } from './dto/TokenViewModel';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../middleware/authMiddleware';
import { ExpiredToken } from '../../db/entity/ExpiredToken';

const router = Router();

router.post(
	'/signin/new_token',
	...refreshTokenValidators,
	validationMiddleware,
	async (req: Request, res, next) => {
		try {
			const refreshToken = req.body.refreshToken;
			if (!refreshToken) {
				throw new UnauthorizeError();
			}
			jwt.verify(refreshToken, String(privateKey));

			const payload = jwt.decode(refreshToken, { json: true });
			if (!payload?.id) {
				throw new UnauthorizeError();
			}

			const userRep = AppDataSource.getRepository(User);

			const existUser = await userRep.findOne({
				where: {
					id: payload.id
				}
			});
			if (!existUser) {
				throw new UnauthorizeError();
			}

			const accessToken = generateAccessToken(existUser);
			const resPayload: TokenViewModel = {
				refreshToken,
				accessToken
			};
			res.json(resPayload);
		} catch (err) {
			next(err);
		}
	}
);

router.post(
	'/signup',
	...signupValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const { id, password } = req.body;
			const userRep = AppDataSource.getRepository(User);
			const existUser = await userRep.findOne({
				where: {
					id
				}
			});
			if (existUser) {
				throw new BadRequestError('Пользователь с таким логином уже существует');
			}

			const payload: User = {
				id,
				password: encodePsd(password)
			};
			const newUser = await userRep.save(payload);
			const resPayload = generateTokens(newUser);

			res.json(resPayload);
		} catch (err) {
			next(err);
		}
	}
);

router.post(
	'/signin',
	...signinValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const { id, password } = req.body;
			const userRep = AppDataSource.getRepository(User);

			const existUser = await userRep.findOne({
				where: {
					id,
					password: encodePsd(password)
				}
			});
			if (!existUser) {
				throw new ForbiddenError('Неправильный логин или пароль');
			}

			const resPayload = generateTokens(existUser);
			res.json(resPayload);
		} catch (err) {
			next(err);
		}
	}
);

router.get('/logout', authMiddleware, async (req: Request, res, next) => {
	try {
		const refreshToken = req.headers['refresh-token'];

		if (!refreshToken) {
			throw new UnauthorizeError();
		}
		jwt.verify(refreshToken, String(privateKey));

		const payload = jwt.decode(refreshToken, { json: true });

		if (!payload?.id) {
			throw new UnauthorizeError();
		}

		const tokenRep = AppDataSource.getRepository(ExpiredToken);

		const existExpiredToken = await tokenRep.findOne({
			where: {
				token: refreshToken
			}
		});
		if (existExpiredToken) {
			throw new UnauthorizeError();
		}

		let expired;
		if (payload.exp) {
			const d = new Date(0);
			d.setUTCSeconds(payload.exp);
			expired = d;
		} else {
			const d = new Date();
			d.setDate(d.getDate() + 10);
			expired = d;
		}

		await tokenRep.save({
			token: refreshToken,
			expired
		});

		res.json();
	} catch (err) {
		next(err);
	}
});

router.get('/info', authMiddleware, async (req: Request, res, next) => {
	try {
		const user = req.user;
		if (!req.user) {
			throw new UnauthorizeError();
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
});
export default router;
