import { Response } from 'express';

export class AlreadyExistsError extends Error {
	public constructor(message = 'Уже существует!') {
		super(message);
	}
}

export class UnauthorizeError extends Error {
	public constructor(message = 'Не авторизирован!') {
		super(message);
	}
}

export class NotFoundError extends Error {
	public constructor(message = 'Не найдено!') {
		super(message);
	}
}

export class ForbiddenError extends Error {
	public constructor(message = 'Нет доступа!') {
		super(message);
	}
}

export class UnprocessableEntityError extends Error {
	public constructor(message = 'Невалидный запрос!') {
		super(message);
	}
}

export class BadRequestError extends Error {
	public constructor(message = 'Ошибка в запросе!') {
		super(message);
	}
}

export class LockedError extends Error {
	public constructor(message = 'У Вас нет роли, обратитесь к администратору!') {
		super(message);
	}
}

export class InternalServerError extends Error {
	public constructor(message = 'Ошибка сервера') {
		super(message);
	}
}

type HandlerFunction = (message: string, res: Response) => void;

type OrmErrorType = {
	[key: string]: HandlerFunction;
};

export const ormErrors: OrmErrorType = {
	'23505': (message, res) => {
		return res.status(409).send({ message });
	},
	ER_DUP_ENTRY: (message, res) => {
		return res.status(409).send({ message });
	},
	default: (message, res) => {
		return res.status(500).send({ message });
	}
};
