module.exports = {
  HOST: "trackdotdb.c3k2cu0gij81.ap-southeast-1.rds.amazonaws.com:3306",
  USER: "admin",
  PASSWORD: "pKPeQ8YyiQgW8mQRqFhE",
  DB: "trackdot_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
