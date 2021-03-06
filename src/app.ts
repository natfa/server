import express from 'express';
import path from 'path';
import session, { SessionOptions } from 'express-session';
import FileStore from 'session-file-store';

import routes from './routes';

import requestLogger from './utils/requestLogger';

// load config
import config from './config/default';

// global config
const app = express();
const secret = config.sessionSecret;
const SessionStore = FileStore(session);

// session config
const sessionConfig: SessionOptions = {
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
    // TODO: turn to true when HTTPS is enabled
    secure: false,
  },
  secret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  unset: 'destroy',
  store: new SessionStore({
    retries: 1,
    reapInterval: 43200,
  }),
};

// express config
app.use(express.json());
app.use(session(sessionConfig));
app.use(requestLogger);

routes.init(app);

// serve javascript bundles
app.use('/', express.static(path.resolve(config.clientPath)));

// serving react apps that have react-router enabled
app.get('/teacher/*', (_, res) => res.sendFile(path.resolve(config.clientPath, 'teacher/index.html')));
app.get('/student/*', (_, res) => res.sendFile(path.resolve(config.clientPath, 'student/index.html')));

app.get('/', (_, res) => res.redirect('/landing'));

app.get('*', (_, res) => {
  res.status(404).sendFile(path.resolve(config.clientPath, '404/index.html'))
});

export default app;
