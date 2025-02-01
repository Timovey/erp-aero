import * as express from 'express';
import { UserViewModel } from '../../controllers/auth/dto/UserViewModel';

declare module 'express-serve-static-core' {
	export interface Request {
		user: UserViewModel;
		reqId: string;
	}
}
