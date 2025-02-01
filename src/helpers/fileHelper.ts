import multer from 'multer';
const baseFolder = 'temp/';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, baseFolder);
	},
	filename: function (req, file, cb) {
		const extension = getFileExtension(file);

		cb(null, Date.now() + extension);
	}
});

const upload = multer({
	storage
});

function getFilePath(file: Express.Multer.File) {
	return `${baseFolder}${file.filename}`;
}

function getFileExtension(file: Express.Multer.File) {
	const extensionSplit = file.originalname.split('.');
	return extensionSplit.length - 1 >= 0
		? '.' + extensionSplit[extensionSplit.length - 1]
		: '';
}

export { upload, getFilePath, getFileExtension };
