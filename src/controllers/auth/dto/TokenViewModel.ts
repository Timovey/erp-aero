import { Expose } from 'class-transformer';
import 'reflect-metadata';

export class TokenViewModel {
	@Expose()
	accessToken!: string;

	@Expose()
	refreshToken!: string;
}
