// var createError = require('http-errors');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var indexRouter1 = require('./routes/index1');
var indexRouter2 = require('./routes/index2');

var app = express();
var app1 = express();
var app2 = express();

const port = 4000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');
app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({extended: false}));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'ejs');
app2.use(logger('dev'));
app2.use(express.json());
app2.use(express.urlencoded({extended: false}));
app2.use(cookieParser());
app2.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app1.use('/', indexRouter1);
app2.use('/', indexRouter2);

app.listen(4000, console.log('Server is running'));
app1.listen(4001, console.log('Server is running'));
app2.listen(4002, console.log('Server is running'));

module.exports = app;
