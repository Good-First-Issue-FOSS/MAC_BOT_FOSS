export const loadEnv = () => {
  if (
    !process.env.TOKEN ||
    !process.env.MONGO_URI ||
    !process.env.APPLICATION_ID ||
    !process.env.GUILD_ID
  ) {
    throw new Error("Missing environment variables.");
  }

  return {
    TOKEN: process.env.TOKEN,
    MONGO_URI: process.env.MONGO_URI,
    APPLICATION_ID: process.env.APPLICATION_ID,
    GUILD_ID: process.env.GUILD_ID,
  };
};
