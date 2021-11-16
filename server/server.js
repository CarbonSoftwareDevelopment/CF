const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  http = require('http'),
  Scheduler = require ('./cron/scheduler'),
  fallback = require('express-history-api-fallback'),
  dotenv = require('dotenv');

dotenv.config();


console.log("ENV LOADED WITH: ",
  process.env.BCC_EMAIL,
  process.env.HOST,
  process.env.SMS_API_KEY,
  process.env.EMAIL_HOST,
  process.env.FROM_EMAIL,
  process.env.EMAIL_API_KEY,
  process.env.EMAIL_USERNAME,
  process.env.DB_URI,
  process.env.SMS_API_URL,
  process.env.SMS_USERNAME,
  process.env.SMS_PASSWORD,
  process.env.PORT,
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
  );

mongoose.Promise = global.Promise;
const mongooseOptions = {
  auto_reconnect: true,
  keepAlive: 1,
  connectTimeoutMS: 30000,
  socketTimeoutMS : 30000,
  useNewUrlParser: true,
  ha: true, // Make sure the high availability checks are on
  haInterval: 5000, // Run every 5 seconds,
  useUnifiedTopology: true
};
mongoose.connect(process.env.DB_URI, mongooseOptions).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
const userRoutes = require('./routes/user.route');
const root = __dirname + '/../client/dist';
const app = express();
// new Scheduler(process.env.HOST);
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

// Error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});
app.use('/user', userRoutes);
app.use(express.static(root));
app.use(fallback('/../client/dist/index.html', { root : __dirname}));
app.all('*', (req, res, next) => {

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log('Listening on port ' + port);
});



// RESTORE MONGODB to URI DB
// mongorestore --uri mongodb+srv://<username>:<password>@x.x.mongodb.net/convey_feed convey_feed/ -d convey_feed
// docker exec -i mongodb /usr/bin/mongorestore --username username --password admin --authenticationDatabase admin --db convey_feed /dump/convey_feed
// DEV DB username = username password = admin

