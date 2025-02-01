import { Expose } from 'class-transformer';
import 'reflect-metadata';

export class UserViewModel {
	@Expose()
	id!: string;
}
