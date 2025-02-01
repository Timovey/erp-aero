import { Type } from 'class-transformer';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { File } from './File';

@Entity()
export class User {
	@PrimaryColumn({
		type: 'varchar'
	})
	id!: string;

	@Column()
	password!: string;

	@Type(() => File)
	@OneToMany(() => File, (file) => file.user)
	files?: File[];
}
