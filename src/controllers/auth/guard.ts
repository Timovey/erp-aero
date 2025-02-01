import { body, check, oneOf } from 'express-validator';
import { authError } from './types';

const passwordValidators = [
	body('password')
		.notEmpty()
		.bail()
		.withMessage(authError.invalidRequired)
		.isString()
		.withMessage(authError.invalidString)
];
const retypePasswordValidators = [
	...passwordValidators,
	body('rePassword')
		.notEmpty()
		.bail()
		.withMessage(authError.invalidRequired)
		.custom((value, { req }) => {
			return String(req.body.password) === String(value);
		})
		.withMessage(authError.invalidRetype)
];

const signinValidators = [
	oneOf([
		body('id')
			.notEmpty()
			.bail()
			.withMessage(authError.invalidRequired)
			.isEmail()
			.withMessage(authError.invalidEmailOrPhone),

		body('id')
			.notEmpty()
			.bail()
			.withMessage(authError.invalidRequired)
			.isMobilePhone('ru-RU')
			.withMessage(authError.invalidEmailOrPhone)
	]),
	...passwordValidators
];
const signupValidators = [...signinValidators, ...retypePasswordValidators];

const refreshTokenValidators = [
	body('refreshToken')
		.notEmpty()
		.bail()
		.withMessage(authError.invalidRequired)
		.isString()
		.withMessage(authError.invalidString)
];

export { signupValidators, signinValidators, refreshTokenValidators };
