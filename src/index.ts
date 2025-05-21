import cookieSession from 'cookie-session';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Database from './config/database';
import { NODE_ENV, PORT } from './config/serverConfig';
import healthRouter from './routes/health.route';
import productRouter from './routes/product.route';
import userRouter from './routes/user.route';
import { AppError } from './utils/appError';
import { getPayload } from './utils/jwtService';
import { errorResponse } from './utils/response';
const app = express();
// cors allow 5173
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    signed: false, // JWT is already signed
    secure: NODE_ENV === 'production',
    httpOnly: true,
  }),
);
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.includes('login') || req.url.includes('register')) return next();
  if (req.session?.jwt) {
    req.session.user = getPayload(req.session.jwt);
  }
  next();
});

app.use('/health', healthRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);

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
    let explanation: string[] = [];
    (err as any).errors.forEach((e: Error) => {
      explanation.push(e.message);
    });
    const errorRes = errorResponse(explanation || 'Validation failed');
    res.status(StatusCodes.BAD_REQUEST).json(errorRes);
    return;
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse('Something went wrong ' + err.message));
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
