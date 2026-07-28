export default () => ({
  http: {
    port: parseInt(process.env.PORT!, 10) || 2999,
  },
  db: {
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10) || 5432,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  },
});
