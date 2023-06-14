import express from 'express';
import cors from 'cors';
import allRoutes from './routes/index.js';
import logger from './utils/logger.js';
import Boom from 'express-boom';

try {
  const app = express();

  app.use(cors());

  app.use(Boom());

  //serve static files
  app.use(express.static('public'));

  const port = process.env.PORT || 5001;

  //middlewares
  app.use(express.json());

  //routes
  app.get('/', (req, res) => {
    res.send('App is up and running');
  });

  app.use('/api', allRoutes);

  app.listen(port, () => {
    console.log(`API is working on port ${port}`);
  });
} catch (error) {
  logger.error('index.js', error);
}
