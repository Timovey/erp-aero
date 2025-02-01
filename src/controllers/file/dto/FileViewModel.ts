import { Expose, Transform, Type } from 'class-transformer';
import 'reflect-metadata';
export class FileViewModel {
	@Expose()
	id!: number;

	@Expose()
	originalname!: string;

	@Expose()
	path!: string;

	@Expose()
	extension!: string;

	@Expose()
	mimetype!: string;

	@Expose()
	size!: number;

	@Expose()
	createdAt!: Date;
}
