module.exports = {
  HOST: "trackdot.c3k2cu0gij81.ap-southeast-1.rds.amazonaws.com",
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
