import { Router } from 'express';
import { getFileValidators, getListValidators } from './guard';
import validationMiddleware from '../../middleware/validationMiddleware';
import AppDataSource from '../../db';
import { File } from '../../db/entity/File';
import { convertToJson, convertToJsonMany } from '../../helpers/convertHelper';
import { FileViewModel } from './dto/FileViewModel';
import { BadRequestError, NotFoundError, UnauthorizeError } from '../../common/errors';
import { getFileExtension, getFilePath, upload } from '../../helpers/fileHelper';
import authMiddleware from '../../middleware/authMiddleware';
import { User } from '../../db/entity/User';
import { unlink, stat } from 'fs/promises';
import path from 'path';

const router = Router();

router.use(authMiddleware);

router.get(
	'/list',
	...getListValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const page = Number(req.query?.page ?? 1);
			const list_size = Number(req.query?.list_size ?? 10);

			const user = req.user;
			if (!user) {
				throw new UnauthorizeError();
			}

			const fileRep = AppDataSource.getRepository(File);
			const files = await fileRep.find({
				where: {
					user: {
						id: user.id
					}
				},
				skip: (page - 1) * list_size,
				take: list_size
			});
			const fileViews = convertToJsonMany(FileViewModel, files);
			res.json(fileViews);
		} catch (err) {
			next(err);
		}
	}
);

router.post('/upload', upload.single('file'), async (req, res, next) => {
	try {
		const file = req.file;
		if (!file) {
			throw new BadRequestError('Нет файла в запросе');
		}

		if (!req.user) {
			throw new UnauthorizeError('Не авторизирован');
		}

		const userRep = AppDataSource.getRepository(User);

		const user = await userRep.findOne({
			where: { id: req.user.id }
		});

		if (!user) {
			throw new UnauthorizeError('Пользователь не найден');
		}

		const { originalname, size, mimetype } = file;

		const extension = getFileExtension(file);

		const path = getFilePath(file);

		const payload = {
			originalname,
			size,
			mimetype,
			extension,
			path,
			user
		};

		const fileRep = AppDataSource.getRepository(File);
		const newFile = await fileRep.save(payload);

		const resPayload = convertToJson(FileViewModel, newFile);
		res.json(resPayload);
	} catch (err) {
		next(err);
	}
});

router.get('/:id', ...getFileValidators, validationMiddleware, async (req, res, next) => {
	try {
		const id = Number(req?.params?.id ?? -1);
		const user = req.user;

		const fileRep = AppDataSource.getRepository(File);
		const file = await fileRep.findOne({
			where: {
				id,
				user: {
					id: user.id
				}
			}
		});

		if (!file) {
			throw new NotFoundError('Файл не найден');
		}
		const resPayload = convertToJson(FileViewModel, file);

		res.json(resPayload);
	} catch (err) {
		next(err);
	}
});

router.delete(
	'/delete/:id',
	...getFileValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const id = Number(req?.params?.id ?? -1);
			const user = req.user;

			const fileRep = AppDataSource.getRepository(File);
			const file = await fileRep.findOne({
				where: {
					id,
					user: {
						id: user.id
					}
				}
			});

			if (!file) {
				throw new NotFoundError('Файл не найден');
			}

			await fileRep.delete({ id });
			res.json();
		} catch (err) {
			next(err);
		}
	}
);

router.put(
	'/update/:id',
	upload.single('file'),
	...getFileValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const newFile = req.file;

			if (!newFile) {
				throw new BadRequestError('Нет файла в запросе');
			}

			const userRep = AppDataSource.getRepository(User);

			const user = await userRep.findOne({
				where: { id: req.user.id }
			});

			if (!user) {
				throw new UnauthorizeError('Пользователь не найден');
			}

			const id = Number(req?.params?.id ?? -1);

			const fileRep = AppDataSource.getRepository(File);

			const existFile = await fileRep.findOne({
				where: {
					id,
					user: {
						id: user.id
					}
				}
			});

			if (!existFile) {
				throw new NotFoundError('Обновляемый файл не найден');
			}

			const { originalname, size, mimetype } = newFile;

			const extension = getFileExtension(newFile);
			const newFilePath = getFilePath(newFile);

			const payload = {
				id,
				originalname,
				size,
				mimetype,
				extension,
				path: newFilePath,
				user
			};

			const updatedFile = await fileRep.save(payload);

			const oldPath = path.join(process.cwd(), existFile.path);
			const isExist = await stat(oldPath);
			if (isExist) {
				await unlink(oldPath);
			}

			const resPayload = convertToJson(FileViewModel, updatedFile);
			res.json(resPayload);
		} catch (err) {
			next(err);
		}
	}
);

router.get(
	'/download/:id',
	...getFileValidators,
	validationMiddleware,
	async (req, res, next) => {
		try {
			const id = Number(req?.params?.id ?? -1);
			const user = req.user;

			const fileRep = AppDataSource.getRepository(File);
			const file = await fileRep.findOne({
				where: {
					id,
					user: {
						id: user.id
					}
				}
			});

			if (!file) {
				throw new NotFoundError('Файл не найден');
			}

			const filePath = path.join(process.cwd(), file.path);
			const isExist = await stat(filePath);
			if (!isExist) {
				throw new NotFoundError('Файл в хранилище не найден');
			}
			res.sendFile(filePath);
		} catch (err) {
			next(err);
		}
	}
);
export default router;
