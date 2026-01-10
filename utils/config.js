  const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = {
  JWT_SECRET: "super-strong-secret-key", // replace later with env variable
};