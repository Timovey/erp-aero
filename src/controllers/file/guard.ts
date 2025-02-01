import { param, query } from 'express-validator';
import { fileError } from './types';
const getListValidators = [
	query('page')
		.isInt({
			min: 1
		})
		.bail()
		.withMessage(fileError.invalidNumber)
		.optional({}),

	query('list_size')
		.isInt({
			min: 1
		})
		.bail()
		.withMessage(fileError.invalidNumber)
		.optional({})
];

const getFileValidators = [
	param('id')
		.notEmpty()
		.bail()
		.withMessage(fileError.invalidRequired)
		.isInt({
			min: 1
		})
		.bail()
		.withMessage(fileError.invalidNumber)
];

export { getListValidators, getFileValidators };
