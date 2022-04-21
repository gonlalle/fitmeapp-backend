var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./passport/setup");

var app = express();
const corsOptions ={
  origin:'*'
}

app.use(cors(corsOptions));
//app.use(cors());

app.use(bodyParser.json());
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
app.use(cookieParser());

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
      secret: "very secret this is",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URL || "mongodb://localhost/fitmeapp" })
  })
);

// Passport middleware
//app.use(passport.initialize());
//app.use(passport.session());

frontendURL = process.env.VUE_APP_FRONTEND_URL || "localhost:8080"

app.all('*', function(req,res,next) {
  if (req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/register')
    next();
  else {
    if (req.session) {
      next();
    } else
      return res.sendStatus(401);
  }
});

app.get("/", (req, res) => {
  res.redirect(frontendURL);
});


app.get('/api/v1/logout', async(req, res) => {
  try {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
  } catch (error) {
      return res.status(400).json({
      mensaje: 'An error has occurred',
      error
      })
  }
});

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/ejercicio_ejecuciones', require('./routes/ejercicio_ejecuciones'));
app.use('/api/v1/ejercicios', require('./routes/ejercicios'));
app.use('/api/v1/ejercicio', require('./routes/ejercicio'));
app.use('/api/v1/alimentos', require('./routes/alimentos'));
app.use('/api/v1/comidas', require('./routes/comidas'));
app.use('/api/v1/dia', require('./routes/dia'));
app.use('/api/v1/consumicion', require('./routes/consumicion'));

app.use('/api/v1/material', require('./routes/material'));
app.use('/api/v1/musculo', require('./routes/musculo'));
app.use('/api/v1/categoria', require('./routes/categoria'));
app.use('/api/v1/recetas', require('./routes/recetas'));
module.exports = app;
