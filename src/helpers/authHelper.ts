import jwt from 'jsonwebtoken';
import { UserViewModel } from '../controllers/auth/dto/UserViewModel';
import { TokenViewModel } from '../controllers/auth/dto/TokenViewModel';

export const privateKey = process.env.JWT_PRIVATE_KEY;
export const publicKey = process.env.JWT_PUBLIC_KEY;

const algorithm = 'HS256';
interface ITokenPayload {
	id: string;
}
export function generateAccessToken(user: UserViewModel): string {
	const payload: ITokenPayload = {
		id: user.id
	};
	return jwt.sign(payload, String(publicKey), { algorithm, expiresIn: '10min' });
}

export function generateRefreshToken(user: UserViewModel): string {
	const payload: ITokenPayload = {
		id: user.id
	};
	return jwt.sign(payload, String(privateKey), { algorithm, expiresIn: '10day' });
}

export function generateTokens(user: UserViewModel): TokenViewModel {
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);
	return {
		refreshToken,
		accessToken
	};
}
