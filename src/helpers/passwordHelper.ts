import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt) as (
	password: string,
	salt: Buffer,
	keylen: number
) => Promise<Buffer>;

const SCHEME = 'scrypt';
const SALT_BYTES = 16;
const KEY_BYTES = 64;

/**
 * Хеширует пароль через scrypt (медленный KDF) с уникальной солью на пользователя.
 * Формат хранения: `scrypt$<соль base64>$<хеш base64>`.
 */
async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_BYTES);
	const key = await scryptAsync(password, salt, KEY_BYTES);
	return `${SCHEME}$${salt.toString('base64')}$${key.toString('base64')}`;
}

function safeEqual(a: Buffer, b: Buffer): boolean {
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Проверяет пароль за постоянное время.
 * Поддерживает старый формат (HMAC-SHA256 hex без соли), чтобы существующие пользователи могли войти:
 * для них `needsRehash = true`, и после успешного входа хеш нужно пересохранить через `hashPassword`.
 */
async function verifyPassword(
	password: string,
	stored: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
	if (stored.startsWith(`${SCHEME}$`)) {
		const [, saltB64, keyB64] = stored.split('$');
		if (!saltB64 || !keyB64) {
			return { valid: false, needsRehash: false };
		}
		const expected = Buffer.from(keyB64, 'base64');
		const actual = await scryptAsync(password, Buffer.from(saltB64, 'base64'), expected.length);
		return { valid: safeEqual(actual, expected), needsRehash: false };
	}

	// Старый формат: crypto-js HmacSHA256(password, PSD_KEY ?? 'secret').toString() — это hex того же HMAC.
	const legacy = createHmac('sha256', process.env.PSD_KEY ?? 'secret')
		.update(password)
		.digest('hex');
	const valid = safeEqual(Buffer.from(legacy), Buffer.from(stored));
	return { valid, needsRehash: valid };
}

export { hashPassword, verifyPassword };
