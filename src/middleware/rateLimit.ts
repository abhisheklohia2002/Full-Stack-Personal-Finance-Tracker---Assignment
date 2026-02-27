import rateLimit from "express-rate-limit";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, try again later.",
  },
});