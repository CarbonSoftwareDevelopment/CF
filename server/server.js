const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  http = require('http'),
  Scheduler = require ('./cron/scheduler'),
  dotenv = require('dotenv');

dotenv.config();

console.log(process.env.NODE_ENV);

mongoose.Promise = global.Promise;
const mongooseOptions = {
  auto_reconnect: true,
  keepAlive: 1,
  connectTimeoutMS: 30000,
  socketTimeoutMS : 30000,
  useNewUrlParser: true,
  ha: true, // Make sure the high availability checks are on
  haInterval: 5000, // Run every 5 seconds
};
mongoose.connect(process.env.DB, mongooseOptions).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
const userRoutes = require('./routes/user.route');
const app = express();
const sheduler = new Scheduler(process.env.HOST);
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;
app.use((err, req, res, next) => {
  console.log(err);
  console.log('error : ;');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  })
});
app.use('/user', userRoutes);

const server = http.createServer(app);
server.listen(port, () => {
  console.log('Listening on port ' + port);
});



// RESTORE MONGODB to URI DB
// mongorestore --uri mongodb+srv://<username>:<password>@x.x.mongodb.net/convey_feed convey_feed/ -d convey_feed

