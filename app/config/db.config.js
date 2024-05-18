module.exports = {
  HOST: "localhost",
  USER: "trackdot_admin",
  PASSWORD: "Siddhu@8387",
  DB: "trackdot_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
