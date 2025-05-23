import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Database from './config/database';
import { NODE_ENV, PORT } from './config/serverConfig';
import { swaggerOptions } from './config/swaggerOptions';
import healthRouter from './routes/health.route';
import productRouter from './routes/product.route';
import userRouter from './routes/user.route';
import { AppError } from './utils/appError';
import { getPayload } from './utils/jwtService';
import { errorResponse } from './utils/response';

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// cors allow 5173
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

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
  if (
    req.url.includes('login') ||
    req.url.includes('register') ||
    req.url.includes('api-docs') ||
    req.url.includes('product/get') ||
    req.url.includes('health')
  )
    return next();
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
    const errorRes = errorResponse(err.message);
    res.status(err.statusCode).json(errorRes);
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

(async () => {
  try {
    new Database();
    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT}\n Swagger UI: http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
