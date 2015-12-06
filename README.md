# Node JS, Express, MongoDb, Jquery Mobile Proyecto Base

## Ambiente de Desarrollo

### Máquina Local

1. Chrome Browser con PostMan Extension instalado
2. Editor de Texto con capacidades de sync por ssh o cliente SFTP
3. Máquina Virtual con NodeJs, Mongo y express-generator instalado

## Pasos para adecuar el proyecto para conectarse a MongoDB
1. Crear el proyecto

   ```bash
   express --git --css less --hbs mejqmn
   cd mejqmn
   npm install
   npm install mongodb --save
   ```

2. Sincronizar carpeta a máquina local.
3. Modificar archivo bin/www

   ```javascript
    // /bin/www.js
    ...
    var http = require('http');
    var MongoClient = require('mongodb').MongoClient; //<--
    var mongourl = "mongodb://localhost:27017/mejqmn";//<--

    MongoClient.connect(mongourl, function(err, db){  //<--
        if(err){ onError(err);}                       //<--
        var app = require('../app')(db);              //<--
        /**
         * Get port from environment and store in Express.
         */
    ...
            : 'port ' + addr.port;
          debug('Listening on ' + bind);
        }

    });// MongoClient.connect                           <--
   ```
4. Modificar archivo app.js

   ```javascript
   // app.js
   ...
   var app = express();

   function getApp(db){                                 //<--
       // view engine setup
       app.set('views', path.join(__dirname, 'views'));
       app.set('view engine', 'hbs');
    ...
        app.use('/users', users);

        console.log("Conected To DB" + db.databaseName); //<--
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
    ...
        app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: {}
          });
        });

        return app;                                     //<--
    }                                                   //<--
    //module.exports = app;
    module.exports = getApp;                            //<--

   ```

## Pasos para integrar jquery mobile al proyecto.
1. desacargar el archivo el ditribuible estable de jqueryMobile desde su página web
https://jquerymobile.com
2. Descomprimir el archivo
3. Copiar en la carpeta ```public/javascripts``` de su proyecto los siguiente archivos de la carpeta descomprimida
   * ```jquery.mobile.x.x.x/demos/js/jquery.min.js```
   * ```jquery.mobile.x.x.x/demos/js/jquery.mobile-x.x.x.min.js ```
4. Copiar en la carpeta ```public/stylesheets``` de su proyecto los siguientes archivo de la carpeta descomprimida
   * ```jquery.mobile.x.x.x/demos/css/themes/default/jquery.mobile-x.x.x.min.css```
5. Subir a la máquina virtual la carpeta public.

## Creando Ruta para las entradas API de la aplicación
1. En la carpeta ```routes``` crear un archivo api.js
2. Editar el archivo agregando la siguientes lineas

   ```javascript
   var express = require('express');
   var router = express.Router();

   function getApi(db){
       router.get('/test', function(req, res) {
         res.status(500).json({"error":"No Implementado"});
       });

       return router;
   }

   module.exports = getApi;
   ```

3. Modificar el archivo ```app.js``` para incluir la ruta bajo la ruta api

   ```javascript
   ...
   //var routes = require('./routes/index');                <--
   //var users = require('./routes/users');                 <--

   var app = express();
   ...
   //app.use('/', routes);                                  <--
   //app.use('/users', users);                              <--

   console.log("Conected To DB" + db.databaseName);
   app.get('/',function(req,res){                           //<--
       res.render("index",{});                              //<--
   });                                                      //<--
   var apiRoute = require('/routes/api')(db);              //<--
   app.use('/api', apiRoute);                              //<--

   ...
   ```

## Insertando un Documento y Obteniendo Documentos de MongoDB por medio de la API

1. Modifique el archivo ```routes/api.js``` con

   ```javascript
   ...
   function getApi(db){
        var coleccion = db.colection('nombreColeccion');
        router.get('/test', function(req, res) {
            res.status(500).json({"error":"No Implementado"});
        });
        router.post('/insertarAColeccion', function(req,res){
            var documento = {
                "dato1": req.body.dato1,
                "dato2": req.body.dato2
            };
            coleccion.insertOne(documento, funtion(err,result){
                if(err){
                    res.status(500).json({"error":err});
                }else{
                    res.status(200).json("resultado":result);
                }
            });
        });
        router.get('/obtenerColeccion',function(req,res){
            coleccion.find({}).toArray(function(err,docs){
                if(err){
                    res.status(500).json({error:err});
                }else{
                    res.status(200).json(docs);
                }
            });
        });
    ...
   ```
   
2. En POSTMAN de Google Chrome puede establecer las entradas para probar la api de insertado y de busqueda.

## Layout y Vista para JQuery Mobile
1. Modifique el archivo ```layout.hbs``` para que quede de la siguiente forma:

   ```HTML
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>{{PageTitle}}</title>
     <link rel="stylesheet" href="/stylesheets/jquery.mobile-1.4.5.min.css">
     <script src="/javascripts/jquery.min.js"></script>
     <script src="/javascripts/jquery.mobile-1.4.5.min.js"></script>
   </head>
   <body>
    {{{body}}}
   </body>
   </html>
   ```
2. Modifique el archivo ```index.hbs``` para que su contenido sea similar a:

   ```HTML
   <div data-role="page" id="page1" data-position="fixed">
     <div data-role="header">
       <h1>Encabezado</h1>
     </div>
     <div role="main" class="ui-content">
       <h2>Contenido</h2>
       <p>Contenido de Página 1
       </p>
     </div>
     <div data-role="footer"  data-position="fixed">
         <div data-role="navbar">
         <ul>
           <li><a href="#page1">Home</a></li>
           <li><a href="#page2">Two</a></li>
         </ul>
       </div>
     </div>
   </div>
   ```
