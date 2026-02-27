
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === "production";

const apisGlob = isProd
  ? [path.join(__dirname, "../routes/**/*.js"), path.join(__dirname, "../controllers/**/*.js")]
  : [path.join(__dirname, "../routes/**/*.ts"), path.join(__dirname, "../controllers/**/*.ts")];

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial Service API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: apisGlob,
};

export const swaggerSpec = swaggerJSDoc(options);