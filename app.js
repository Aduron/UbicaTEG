var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

function getApp(db){
  var lugares = db.collection('lugares');
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    //app.use(cookieParser());
    app.use(require('less-middleware')(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(session({ secret: 'justanotherpbtool',resave:true,saveUninitialized:true, cookie: { maxAge: null }}));

    app.get('/',function(req, res){
        res.render("index");
    });
    //mapa estatico con layout propio
    app.get('/mapa',function(req, res){

      lugares.find({}).toArray(function(err, docs){
          if(err){
              res.status(500).json({"error":"Error al extraer los lugares"});
          }else{
            var locaciones=[];
            locaciones = JSON.stringify(docs);
            console.log(locaciones);

            res.render('mapa', { title: 'Mapa-UbicaTEG',locaciones:locaciones, layout: null });
          }
      });
  });

app.get('/mapa/seccion/:seccion',function(req, res){
    var seccion=req.params.seccion;
  lugares.find({type:seccion}).toArray(function(err, docs){
      if(err){
          res.status(500).json({"error":"Error al extraer los lugares"});
      }else{
        var locaciones=[];
        locaciones = JSON.stringify(docs);
        console.log(locaciones);

        res.render('mapa', { title: 'Mapa-UbicaTEG',locaciones:locaciones, layout: null });
      }
  });
});


  app.get('/mapa/lugares/:local',function(req, res){
      var local=req.params.local;
    lugares.find({local:local}).toArray(function(err, docs){
        if(err){
            res.status(500).json({"error":"Error al extraer el lugar"});
        }else{
          var locaciones=[];
          locaciones = JSON.stringify(docs);
          console.log(locaciones);
          res.render('mapa', { title:"UbicaTEG",locaciones:locaciones, layout: null });
        }
    });
});


    //app.use('/', routes);
    //app.use('/users', users);
    var apiRoutes = require("./routes/api")(db);
    app.use('/api', apiRoutes);

    console.log("Conected To DB" + db.databaseName);
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    return app;
}


//module.exports = app;
module.exports = getApp;
