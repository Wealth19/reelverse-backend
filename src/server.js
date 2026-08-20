const express = require("express");
const cookieParser = require("cookie-parser");
const getAccessToken = require("./third-party/monnify/auth");
const dbConnection = require("./configuration/db");
const cors = require("cors");

const { notFoundRoute } = require("./middlewares/route-not-found.middleware");
const { globalErrorHandler } = require("./utils/error-handler");

require("dotenv").config();

const authRoutes = require("./route/auth.route");
const userRoutes = require("./route/user.route");
const movieRoutes = require("./route/movie.route");
const walletRoutes = require("./route/wallet.route");
const walletHistoryRoutes = require("./route/wallet-history.route");
const watchHistoryRoutes = require("./route/watch-history.route");
const purchaseRoutes = require("./route/purchase.route");
const rentalRoutes = require("./route/rental.route");
const paymentRoutes = require("./route/payment.route");
const webhookRoutes = require("./route/webhook.route");
const virtualAccountRoutes = require("./route/virtual-account.route");
// const testRoue = require("./route/webhook..route");
const sanitizeMiddleware = require("./middlewares/sanitize.middleware");

// const actionRoutes = require("./routes/actionRoutes");

// Connect to DB
dbConnection
  .query("SELECT 1")
  .then(() => {
    console.warn("Database connection successful.");
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err}`);
    process.exit(1);
  });

const app = express();

// middleware
// app.use(cors());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// app.use(express.json());

// NEWLY APP.USE

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(cookieParser());

app.use(sanitizeMiddleware);

// create API router
const apiRouter = express.Router();

// routes

apiRouter.use("/auth", authRoutes);

apiRouter.use("/users", userRoutes);

apiRouter.use("/movies", movieRoutes);

apiRouter.use("/wallet", walletRoutes);

apiRouter.use("/wallet/history", walletHistoryRoutes);

apiRouter.use("/purchases", purchaseRoutes);

apiRouter.use("/rentals", rentalRoutes);

apiRouter.use("/payments", paymentRoutes);

apiRouter.use("/webhooks", webhookRoutes);

apiRouter.use("/virtual-account", virtualAccountRoutes);

apiRouter.use("/watch", watchHistoryRoutes);

// mount router ONCE here

app.use("/api", apiRouter);

// Unknown routes
app.use("/", notFoundRoute);

// Error handler
app.use(globalErrorHandler);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION WARNING");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION WARNING");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.error("SIGTERM RECEIVED. shutting down");
  server.close(() => {
    console.error("process terminated");
    process.exit(1);
  });
});

process.on("SIGINT", async () => {
  await dbConnection.end();
  console.log("Database pool closed");
  process.exit(0);
});
