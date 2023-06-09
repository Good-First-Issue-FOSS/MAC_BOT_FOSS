export const loadEnv = () => {
	if (!process.env.TOKEN) {
		throw new Error('Missing environment variables.');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('Missing environment variables.');
	}
	if (!process.env.APPLICATION_ID) {
		throw new Error('Missing environment variables.');
	}
	if (!process.env.GUILD_ID) {
		throw new Error('Missing environment variables.');
	}
	if (!process.env.CLIENT_SECRET) {
		throw new Error('Missing environment variables.');
	}

	return {
		TOKEN: process.env.TOKEN,
		MONGO_URI: process.env.MONGO_URI,
		APPLICATION_ID: process.env.APPLICATION_ID,
		GUILD_ID: process.env.GUILD_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET,
	};
};
