import { Type } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
export class ExpiredToken {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({})
	@Index()
	token!: string;

	@Column()
	expired!: Date;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	createdAt!: Date;
}
