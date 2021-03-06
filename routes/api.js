var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
var multer = require('multer');
var regexpt = /^((image)|(video))\/\w*$/i;
var nombre, id;
var upload = multer({dest:"public/img/",
                     limits:{
                         fileSize: (1024 * 1024 * 10)
                     },
                     fileFilter: function(req, file, cb){
                         if(regexpt.test(file.mimetype)){
                             cb(null, true);
                         }else{
                             cb(null, false);
                         }
                     }
                 });

function getAPIRoutes(db){
    //Loading MongoDB Collections
    var lugares = db.collection('lugares');
    var usuarios = db.collection('usuarios');
    var tegs = db.collection("tegs_comments");

    // Security Entries
    router.post('/register', function(req,res){
        if(req.body.reg_pwd == req.body.reg_pwd_cnf){
            var newUser={
                user : req.body.reg_user,
                name : req.body.reg_name,
                created: Date.now(),
                password:"",
                failedTries : 0,
                lastlogin: 0,
                lastChangePassword:0,
                oldPasswords:[]
            };
            var saltedPassword = "";
            if(newUser.created % 2 === 0){
                saltedPassword = newUser.user.substring(0,3) + req.body.reg_pwd;
            }else{
                saltedPassword = req.body.reg_pwd + newUser.user.substring(0,3);
            }
            newUser.password = md5(saltedPassword);
            usuarios.insertOne(newUser, function(err, result){
                if(err){
                    res.status(403).json({"error":err});
                }else{
                    res.status(200).json({"ok":true});
                }
            });
        }else{
            res.status(403).json({"error":"No validado"});
        }
    });

    router.post('/login', function(req,res){
        var useremail = req.body.lgn_user,
            password = req.body.lgn_pwd;

        usuarios.findOne({user:useremail}, function(err, doc){
            if(err){
                res.status(401).json({"error":"Log In Failed"});
            }else{
                if(doc){
                    var saltedPassword="";
                    if(doc.created%2 ===0){
                        saltedPassword = doc.user.substring(0,3) + password;
                    }else{
                        saltedPassword = password + doc.user.substring(0,3);
                    }
                    if(doc.password === md5(saltedPassword)){
                      nombre=doc.name;
                      id=doc._id;
                        req.session.user = doc.user;
                        doc.password = "";
                        req.session.userDoc = doc;
                        usuarios.updateOne({"_id":doc._id}, {"$set":{"lastlogin":Date.now(),"failedTries":0}});
                        res.status(200).json({"ok":true});
                    }else{
                        req.session.user = "";
                        req.session.userDoc = {};
                        usuarios.updateOne({"_id":doc._id}, {"$ic":{"failedTries":1}});
                        res.status(401).json({"error":"Log In Failed"});
                    }
                }else{
                    res.status(401).json({"error":"Log In Failed"});
                }
            }
        });
    });

    router.get('/logout', function(req, res){
        req.session.clear();
        noombre="";
        id="";
        res.status(200).json({"ok":true});
    });

    //Backlog Entries
    router.use(function(req,res,next){
        if((req.session.user||"")===""){
            console.log("Error checking Session");
            res.status(403).json({"error":"Session Not Set"});
        }else{
            next();
        }
    });

    router.get('/getbacklog', function(req, res) {
      console.log(id);
      console.log(nombre);
      tegs.find({id_user_ : new ObjectID(id)}).toArray(function(err, docs){
          res.status(200).json(docs);
          console.log(docs);
      });
    });

    router.get('/getrestaurante', function(req, res) {

      lugares.find({type:"restaurante"}).limit(10).toArray(function(err, docs){
          res.status(200).json(docs);
          console.log(docs);
      });
    });
    router.get('/geturismo', function(req, res) {

      lugares.find({type:"turismo"}).limit(10).toArray(function(err, docs){
          res.status(200).json(docs);
          console.log(docs);
      });
    });
    router.get('/getdiversion', function(req, res) {

      lugares.find({type:"diversion"}).limit(10).toArray(function(err, docs){
          res.status(200).json(docs);
          console.log(docs);
      });
    });
    router.get('/getfetival', function(req, res) {

      lugares.find({type:"festival"}).limit(10).toArray(function(err, docs){
          res.status(200).json(docs);
          console.log(docs);
      });
    });

    router.post('/addtobacklog',function(req,res){
        var doc = {
            code:req.body.code,
            description:req.body.description,
            owner:req.body.owner,
            storyPoints:parseInt(req.body.storypoints),
            creator: (req.body.user || "")
        };

        lugares.insertOne(doc, function(err,result){
            if(err){
                res.status(500).json({error:err});
            }else{
                res.status(200).json({resultado:result});
            }
        });
    });

    router.get("/getDetalle/:detalleID", function(req,res){
        var query = {_id: new ObjectID(req.params.detalleID)};
        lugares.find(query).toArray(function(err, docs){
          if(err){
              res.status(500).json({"error":"Error al extraer el Backlog"});
          }else{
              res.status(200).json(docs);
              console.log(docs);
          }
        });
    });

    router.post('/regTeg',function(req,res){
        var doc = {
            id_user_:new ObjectID(id),
            //id_lugar:req.params.id_usu,
            user_name:nombre,
            teg:req.body.tegsC,
        };
        console.log(doc.teg);
        console.log(doc);

        tegs.insertOne(doc, function(err,result){
            if(err){
                res.status(500).json({error:err});
            }else{
                res.status(200).json({resultado:result});
            }
        });
    });

    router.post("/upload",
                upload.single('userpic'),
                function(req,res){
                        if(req.file){
                            var query = {_id: new ObjectID(req.body.backlogid)};
                            lugares.updateOne(
                                query,
                                {"$push":{"evidences":("img/" + req.file.filename)}},
                                {w:1},
                                function(err,result){
                                    if(err){
                                        res.status(500).json({"error":err});
                                    }else{
                                        res.status(200).json({"path":("img/"+req.file.filename)});
                                    }
                                }
                            );
                        }else{
                            res.status(500).json({"error":"Filesize or Type Error"});
                        }
                });


    return router;
} //getAPIRoutes

module.exports = getAPIRoutes;
