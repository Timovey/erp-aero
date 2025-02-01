import { Type } from 'class-transformer';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
} from 'typeorm';
import { User } from './User';

@Entity()
export class File {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	originalname!: string;

	@Column()
	path!: string;

	@Column()
	extension!: string;

	@Column()
	mimetype!: string;

	@Column()
	size!: number;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	createdAt!: Date;

	@Type(() => User)
	@ManyToOne(() => User, (user) => user.files, {
		eager: true
	})
	user!: User;
}
