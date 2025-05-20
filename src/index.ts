import cookieSession from 'cookie-session';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Database from './config/database';
import { NODE_ENV, PORT } from './config/serverConfig';
import healthRouter from './routes/health.route';
import userRouter from './routes/user.route';
import { AppError } from './utils/appError';
const app = express();
app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    signed: false, // JWT is already signed
    secure: NODE_ENV === 'production',
    httpOnly: true,
  }),
);

app.use('/health', healthRouter);
app.use('/user', userRouter);

// add global exception handler middleware for AppError or other errors
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  } else if (
    (err as any).name === 'SequelizeValidationError' ||
    (err as any).name === 'SequelizeUniqueConstraintError'
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: (err as any).errors?.[0]?.message || 'Validation failed',
    });
    return;
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

(async () => {
  try {
    new Database();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
