export const config = {
  service: {
    privateKey: process.env.PRIVATE_KEY,
    cors: process.env.CORS || '',
    port: Number(process.env.PORT) || 9012,
  },
  database: {
    scheme: process.env.DB_SCHEME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
  },
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  messenger: {
    verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
    whitelistedDomains: process.env.WHITE_LISTED_DOMAINS,
  },
};
