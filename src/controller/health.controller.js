const catchAsync = require("../utils/catchAsync");
const { checkDatabaseHealth } = require("../services/health/health.service");

const getHealth = catchAsync(async (req, res) => {
  const database = await checkDatabaseHealth();
  const isHealthy = database.status === "ok";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "error",
    service: "backend",
    timestamp: new Date().toISOString(),
    checks: {
      database,
    },
  });
});

module.exports = {
  getHealth,
};
