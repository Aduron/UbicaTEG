var express = require('express');
var api = express.Router();
var ObjectID = require('mongodb').ObjectID;


function getAPIRoutes(db){

    var product_backlog = db.collection('UbicaTEG');

      api.get('/login',function(req,res){
      });


    api.post('/login',function(req,res){

      var datos= {
            nombre:req.body.txtNombre,
            clave:req.body.txtClave
          }

        var query = {"nombre":{$eq:datos.nombre}};
        product_backlog.find(query).toArray(function(err, doc){
            if(err){

           }else{
                res.render('perfil',datos);
          }
          console.log(doc[0].nombre);
          });
    });

    api.post('/registro',function(req,res){
       res.render("register");
    });

    api.post('/regForm',function(req,res){
      var datos={
          nombre:req.body.txtNombre,
          email:req.body.txtEmail,
          subnombre:req.body.txtnick,
          clave:req.body.txtClave
      }

      product_backlog.insertOne(datos, function(err,result){
          if(err){
              res.status(500).json({error:err});
          }else{
              res.status(200).json({resultado:result});
          }

          res.render('index');
      });


    });

    return api;
} //getAPIRoutes

module.exports = getAPIRoutes;
