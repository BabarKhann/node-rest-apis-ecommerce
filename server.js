import express from 'express';
import { APP_PORT, DB_URL } from './config';
import mongoose from 'mongoose';

const app = express();

import routes from './routes';
import errorHandler from './middlewares/errorHandler';

//Database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB Connected...', db);
});

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.listen(APP_PORT, () => console.log(`Listening on ${APP_PORT}`));
