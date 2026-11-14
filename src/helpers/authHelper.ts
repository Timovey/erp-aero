import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserViewModel } from '../controllers/auth/dto/UserViewModel';
import { TokenViewModel } from '../controllers/auth/dto/TokenViewModel';

const MIN_SECRET_LENGTH = 32;

/**
 * Без секрета сервис не должен стартовать: раньше `String(undefined)` превращался в строку "undefined",
 * и токен мог подписать кто угодно.
 */
function requireSecret(name: 'JWT_PRIVATE_KEY' | 'JWT_PUBLIC_KEY'): string {
	const value = process.env[name];
	if (!value || value.length < MIN_SECRET_LENGTH) {
		throw new Error(
			`Переменная окружения ${name} не задана или короче ${MIN_SECRET_LENGTH} символов`
		);
	}
	return value;
}

// HS256 — симметричный алгоритм: оба значения являются секретами (подпись refresh и access токенов).
export const privateKey = requireSecret('JWT_PRIVATE_KEY');
export const publicKey = requireSecret('JWT_PUBLIC_KEY');

const algorithm = 'HS256';
interface ITokenPayload {
	id: string;
}
export function generateAccessToken(user: UserViewModel): string {
	const payload: ITokenPayload = {
		id: user.id
	};
	return jwt.sign(payload, publicKey, { algorithm, expiresIn: '10min' });
}

export function generateRefreshToken(user: UserViewModel): string {
	const payload: ITokenPayload = {
		id: user.id
	};
	return jwt.sign(payload, privateKey, { algorithm, expiresIn: '10day' });
}

/** Проверяет подпись и срок жизни с явно заданным алгоритмом и возвращает payload. */
export function verifyToken(token: string, secret: string): JwtPayload {
	const payload = jwt.verify(token, secret, { algorithms: [algorithm] });
	if (typeof payload === 'string') {
		throw new Error('Неожиданный формат payload токена');
	}
	return payload;
}

export function generateTokens(user: UserViewModel): TokenViewModel {
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);
	return {
		refreshToken,
		accessToken
	};
}
