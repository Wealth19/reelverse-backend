const dbConnection = require("../../configuration/db");

const checkDatabaseHealth = async () => {
  return dbConnection
    .query("SELECT 1")
    .then(() => ({ status: "ok" }))
    .catch(() => ({ status: "error" }));
};

module.exports = {
  checkDatabaseHealth,
};
