var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");
// const basicAuth = require('express-basic-auth');

var app = express();

app.use(cors());

// app.use(basicAuth ({
// }));

app.use(bodyParser.json());
app.use(cookieParser());

frontendURL = process.env.VUE_APP_FRONTEND_URL || "localhost:8080"

app.get("/", (req, res) => {
  res.redirect(frontendURL);
});

// app.get('/api/v1/logout', async(req, res) => {
//   try {
//       res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//       return res.sendStatus(401);
//   } catch (error) {
//       return res.status(400).json({
//       mensaje: 'An error has occurred',
//       error
//       })
//   }
// });
app.use('/api/v1/ejercicio', require('./routes/ejercicio'));
app.use('/api/v1/musculo', require('./routes/musculo'));
app.use('/api/v1/material', require('./routes/material'));
app.use('/api/v1/categoria', require('./routes/categoria'));
module.exports = app;
