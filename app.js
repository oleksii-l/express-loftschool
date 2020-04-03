var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require('connect-flash');

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(
  session({
    store: new FileStore(),
    secret: "secret of loftschool",
    resave: false,
    saveUninitialized: true
  })
);

const user = {
  id: '1',
  email: 'loft@loftschool.com',
  password: 'password'
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    (email, password, done) => {
      // Сравниваем пользователя из хранилища (в нашем случае это объект)
      // с тем что пришло с POST запроса на роутер /login
      // в полях email и password
      if (email === user.email && password === user.password) {
        // если они совпадают передаем объект user в callback функцию done
        return done(null, user);
      } else {
        // если не соответствуют то отдаем false
        return done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // здесь необходимо найти пользователя с данным id
  // но он у нас один и мы просто сравниваем
  const _user = user.id === id ? user : false;
  done(null, _user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
