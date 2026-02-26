import winston from "winston";
const logger = winston.createLogger({
  level: "debug",
  defaultMeta: {
    serviceName: "Finance-service",
  },
  transports: [
    new winston.transports.File({
      level: "info",
      dirname: "logs",
      filename: "app-log",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: "error",
      dirname: "logs",
      filename: "error-log",
      format: winston.format.json(),
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;
