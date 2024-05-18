module.exports = {
  HOST: "mysql://trackdot.c3k2cu0gij81.ap-southeast-1.rds.amazonaws.com:3306?ssl=false",
  USER: "siddhu",
  PASSWORD: "GKbZNlpsgvJWtwGcFAUp",
  DB: "trackdot",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
