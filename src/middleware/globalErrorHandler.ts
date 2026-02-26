import type { Request, Response } from "express";
import { HttpError } from "http-errors";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";

export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
) => {
    const errorId = uuidv4();
    const statusCode = err.status || 500;
    let message = "Internal server error";
    if (statusCode === 400) {
        message = err.message;
    }

    logger.error(err.message, {
        id: errorId,
        statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: err.name,
                msg: message,
                path: req.path,
                method: req.method,
                location: "server",
                stack:err.stack,
            },
        ],
    });
};
