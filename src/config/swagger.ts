import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Finance Tracker API", version: "1.0.0" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.resolve(process.cwd(), "src/routes/**/*.routes.ts"),
    path.resolve(process.cwd(), "src/controllers/**/*.controller.ts"),
    path.resolve(process.cwd(), "dist/routes/**/*.routes.js"),
    path.resolve(process.cwd(), "dist/controllers/**/*.controller.js"),
  ],
});
console.log(path.resolve(process.cwd(), "src/routes/**/*.routes.ts"));