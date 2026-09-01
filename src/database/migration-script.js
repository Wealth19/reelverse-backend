const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// dotenv.config({ path: "./config.env" });

const MIGRATION_DIR = path.join(__dirname, "/migration");

const waitForDatabase = async () => {
  const maxAttempts = 20;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        multipleStatements: true,
        connectTimeout: 5000,
      });

      await connection.ping();
      await connection.end();
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(
        `Database not ready yet (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelayMs / 1000}s...`,
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};

const runDBScript = async () => {
  let connection;

  try {
    await waitForDatabase();

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true,
    });

    console.log("Database connected");

    // get all sql files
    const files = fs
      .readdirSync(MIGRATION_DIR)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (!files.length) {
      console.log("No migration files found.");
      return;
    }

    for (const file of files) {
      const filePath = path.join(MIGRATION_DIR, file);

      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running: ${file}`);

      await connection.query(sql);

      console.log(`Completed: ${file}`);
    }

    console.log("All migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
};

runDBScript();
