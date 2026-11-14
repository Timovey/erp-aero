import multer from 'multer';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { access, unlink } from 'fs/promises';
import path from 'path';

const baseFolder = 'temp/';

// temp/ лежит в .gitignore и на чистом клоне отсутствует, а multer с destination-функцией каталог не создаёт.
mkdirSync(path.join(process.cwd(), baseFolder), { recursive: true });

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, baseFolder);
	},
	filename: function (req, file, cb) {
		// UUID вместо Date.now(): при двух загрузках в одну миллисекунду файлы перезаписывали друг друга.
		cb(null, randomUUID() + getFileExtension(file));
	}
});

const upload = multer({
	storage
});

function getFilePath(file: Express.Multer.File) {
	return `${baseFolder}${file.filename}`;
}

/**
 * Расширение из имени файла (`.pdf`) или пустая строка, если его нет.
 * path.extname отбрасывает каталоги, поэтому в имя на диске не попадут `/` и `..`.
 */
function getFileExtension(file: Express.Multer.File) {
	const extension = path.extname(path.basename(file.originalname)).toLowerCase();
	return /^\.[a-z0-9]{1,16}$/.test(extension) ? extension : '';
}

/** Абсолютный путь к файлу по относительному пути из БД. */
function resolveStoredPath(storedPath: string) {
	return path.join(process.cwd(), storedPath);
}

/** fs.stat бросает ENOENT вместо возврата false, поэтому проверка существования через access. */
async function fileExists(storedPath: string): Promise<boolean> {
	try {
		await access(resolveStoredPath(storedPath));
		return true;
	} catch {
		return false;
	}
}

/** Удаляет файл; отсутствие файла ошибкой не считается. */
async function removeStoredFile(storedPath: string): Promise<void> {
	try {
		await unlink(resolveStoredPath(storedPath));
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
			throw err;
		}
	}
}

export {
	upload,
	getFilePath,
	getFileExtension,
	resolveStoredPath,
	fileExists,
	removeStoredFile
};
