import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

export default function (req: Request, res: Response, next: NextFunction) {
	req.body = matchedData(req, { includeOptionals: true });
	const errors = validationResult(req);

	if (!errors.isEmpty()) return res.status(418).json({ errors: errors.array() });
	next();
}
