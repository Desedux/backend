module.exports = {
  development: {
    username: "admin",
    password: "secretpassword",
    database: "mydatabase",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "secretpassword",
    database: process.env.POSTGRES_DB || "mydatabase",
    host: process.env.POSTGRES_HOST || "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  },
};
