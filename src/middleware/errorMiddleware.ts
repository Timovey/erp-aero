import { NextFunction, Request, Response } from 'express';
import {
	AlreadyExistsError,
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	LockedError,
	NotFoundError,
	UnauthorizeError,
	UnprocessableEntityError,
	ormErrors
} from '../common/errors';
import { QueryFailedError } from 'typeorm';

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
	const message = err.message;
	//если ошибка в ORM
	const code = (err as any).code as string;

	if (err instanceof QueryFailedError) {
		return ormErrors[code]
			? ormErrors[code](message, res)
			: ormErrors['default'](message, res);
	}

	if (err instanceof AlreadyExistsError) {
		return res.status(409).send({ message });
	} else if (err instanceof UnauthorizeError) {
		return res.status(401).send({ message });
	} else if (err instanceof NotFoundError) {
		return res.status(404).send({ message });
	} else if (err instanceof ForbiddenError) {
		return res.status(403).send({ message });
	} else if (err instanceof BadRequestError) {
		return res.status(400).send({ message });
	} else if (err instanceof LockedError) {
		return res.status(423).send({ message });
	} else if (err instanceof InternalServerError) {
		return res.status(500).send({ message });
	} else if (err instanceof UnprocessableEntityError) {
		return res.status(422).send({ message });
	}

	return res.status(400).json({ message });
}
