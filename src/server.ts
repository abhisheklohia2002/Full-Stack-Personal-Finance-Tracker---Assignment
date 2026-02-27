/* eslint-disable @typescript-eslint/no-floating-promises */
import "reflect-metadata";
import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";
import logger from "./config/logger.js";
import { Config } from "./config/index.js";

const dbConnection = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("DB is connected");
  } catch (error) {
    console.error("DB connection error", { error });
    throw error;
  }
};

const startServer = async () => {
  const PORT = Config.PORT;
  try {
    await dbConnection();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server", { error });
    process.exit(1);
  }
};

startServer();
