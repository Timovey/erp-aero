declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			PORT?: string;
			HOST?: string;
			JWT_PRIVATE_KEY: string;
			JWT_PUBLIC_KEY: string;
			DB_NAME: string;
			DB_USER: string;
			DB_PSD: string;
		}
	}
}
export {};
