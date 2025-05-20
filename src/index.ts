import express, { Request, Response } from 'express';
import Database from './config/database';
import { PORT } from './config/serverConfig';
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
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
