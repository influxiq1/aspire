/**
 * Created by InfluxIQ09 on 2/7/2019.
 */
var fs = require("fs"),
    readline = require("readline");

var express = require('express');
var app = express();
var port = process.env.PORT || 7011;
var request = require('request');
var cheerio = require('cheerio');
var mailer = require("nodemailer");
var moment = require('moment');
var randomString = require('random-string');
var http = require('http').Server(app);

/*SSL*/
var https = require('https');
var keyval=fs.readFileSync('./nodessl.key','utf8');
var certval=fs.readFileSync('./4c4389f06e6cdbf.crt','utf8');
var options = {
    key: keyval,
    cert:certval
};
/*SSL*/



/*Access token JWT Verification*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
app.set('superSecret', config.secret); // secret variable

/*Access token JWT Verification*/



var bodyParser = require('body-parser');
app.use(
    bodyParser.json({
        parameterLimit: 10000000,
        limit: '90mb'
    })
);
app.use(
    bodyParser.urlencoded({
        parameterLimit: 10000000,
        limit: '90mb',
        extended: false})
);
var EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(0)
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(function(req, res, next) {
    //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mongodb = require('mongodb');
var db;
var db2;
var url = 'mongodb://localhost:27017';
var MongoClient = mongodb.MongoClient;
MongoClient.connect(url, function (err, database) {
    if(err){
        console.log(err);
    }else{
        db=database.db('aspire');
        db2=database.db('aspire');
        console.log("mongo db connected");
        //console.log(database);
    }
});

var tokenstatus='';
app.get('/t6',function(req,resp){
    resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
     return;
});

app.post('/test',function (req, resp) {
    var collection= db2.collection('test');
    var cond=req.body.data.username;
    collection.find(cond).sort({username:0}).limit(1).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });
    collection.find().toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
            return;
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
            //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()}));
            return;
        }
    });
});


app.get('/test1',function(req,resp){
    console.log('etgggggggggggeset');
    setTimeout(function () {
        var collection= db2.collection('r5');

        collection.insert([{

            // added_time: moment().unix(),
            user_id:  '1',
            username: 'Himadri',
            password: 123456,

        }], function (err, result) {
            if (err) {
                resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
            }
        });
        },1000);
    //resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
   // return;

});

var server = app.listen(port,'', function () {
    var host = server.address().address;
    var port = server.address().port;
});


/*-----Image----*/
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        //  cb(null, '../uploads/');
        // cb(null, '../src/assets/images/uploads/'); //for local
        //  cb(null, '/home/nexhealthtoday/public_html/assets/images/uploads/'); //for server
        cb(null, '../assets/uploads/'); //for server
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});
var upload = multer({
    storage: storage
}).single('file');
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();

   /* if(7==7){
        res.json({error_code:1,err_desc:'File type not supported !!',rq:req.body});
        return;
    }*/
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:req.body});
            return;
        }
        else{
            console.log(filename);
            res.send(JSON.stringify(filename));
            return;
        }
    });
});

/*-----Image----*/
var rnval;
function randomnogenerate(tablename){
    rnval = null;
    var generatecodes=randomString({
        length: 5,
        numeric: true,
        letters: false,
        special: false
    });

    var collection = db.collection(tablename);
    collection.find({unique_id:generatecodes}).toArray(function(err, items) {
        if (items.length > 0) {
            randomnogenerate();
        }
        else{
             rnval = generatecodes;
        }
    });
}

app.post('/leadsignup', function (req, resp) {
    randomnogenerate('users');
    setTimeout(function () {
    var collection = db.collection('users');
    collection.insert([{
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phoneno: req.body.phoneno,
        city: req.body.city,
        state: req.body.state,
        regionalrecruiter_id: new mongodb.ObjectID(req.body.regionalrecruiter_id),
        lead_step: req.body.lead_step,
        type: req.body.type,
        created_at: moment().unix(),
        unique_id: rnval
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            var tokenis = createjwttoken();
            if(tokenis!=null){
    /*            resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()})); return;*/
                var o_id = new mongodb.ObjectID(result.ops[0]._id);
                collection.find({_id:o_id}).toArray(function(err, items) {
                    if (err) {
                        resp.send(JSON.stringify({'status':'error','id':0}));
                        return;
                    } else {
                        resitem = items[0];
                        resp.send(JSON.stringify({'status':'success','item':resitem,token:createjwttoken()}));
                      //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()}));
                        return;
                    }
                });
            }else{
                resp.send(JSON.stringify({'status':'error','msg':'Contact to site administrator for further information!'}));
                return;
            }
        }
    });
    },100);
});


app.post('/leadsignupquestionnaireupdate',function (req,resp) {
    var collection = db.collection('users');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    else{
        var o_id = new mongodb.ObjectID(req.body.data.id);
        var crypto = require('crypto');
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
            .update('password')
            .digest('hex');
        for(var i in req.body.sourceobj){
            if(req.body.data[req.body.sourceobj[i]]!=null){
                req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
            }
        }
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.id)!='undefined')  req.body.data.id = null;
        collection.update({_id:o_id}, {$set: req.body.data}, true, true);
        resp.send(JSON.stringify({'status':'success',update:1}));
        return;
    }
});


app.post('/getregionalrecruiter',function (req,resp) {
   /* var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);*/
    var i=0;
    var tval;
    var bval;
    var ck;
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }

    var varr= req.body.condition;
    var bvarr=[];
    if(typeof (req.body.condition) !='undefined' ){

        Object.keys(varr).forEach(function (c) {
            // do something with obj[key]
            ck='_object';
            console.log("c");
            console.log(c);
            console.log(c.indexOf(ck));
            console.log(ck.indexOf(c));
            if(c.indexOf(ck)>=0){
                tavl=varr[c];
                //varr.splice(i,1);
                bval=c.replace('_object','');
                //bvarr.push({bval:tval});
                bvarr[bval]=new mongodb.ObjectID(varr[c]);
            }
            else bvarr[c]=varr[c];
            i++;
            //console.log(key);
        });

        req.body.condition=Object.assign({}, bvarr);
    }
    if(typeof (req.body.condition) !='undefined' && typeof (req.body.condition._id)!='undefined' ){
        req.body.condition._id=new mongodb.ObjectID(req.body.condition._id);
    }
    var cond=req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort({_id:-1}).limit(1).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

});


app.post('/addtraininglesson',function (req,resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    else{
        var crypto = require('crypto');
        var added_time= new Date().getTime();
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
            .update('password')
            .digest('hex');
        for(var i in req.body.sourceobj){
            req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
        }
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
        var collection = db.collection(req.body.source.toString());
        if(typeof(req.body.data.id)=='undefined'){
            req.body.data['created_at']=added_time;
            collection.insert([req.body.data], function (err, result) {
                if (err) {
                    resp.send(JSON.stringify({'status':'failed','id':0}));
                } else {
                    resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
                    return;
                }
            });
        }
    }
});

app.post('/togglestatus',function(req,resp){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    req.query=req.body;
    var collection = db.collection(req.query.source.toString());
    var o_id = new mongodb.ObjectID(req.query.id);     //[we use ObjectId to convert the data otherwise we could not get it]
    collection.update({_id:o_id}, {$set: {status:req.query.status}}, true, true);  //[_id defined that in database it is defined  _id so we used _id here to match field]

    resp.send(JSON.stringify({'status':'success'}));
});

app.post('/training_category',function(req,resp){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
  var collection = db.collection('tranningcategory');
  var collection = db.collection('training_category_lesson_view');
  var collection2 = db.collection('donetraininglesson');
  var collection3 = db.collection('last_lessons');
  var cond={};
  cond={
    status:true
    /* type1: 'Rep Trainning Table'*/
  };

  collection.find(cond).sort({created_at:-1}).toArray(function(err, items){
    if (err) {
      resp.send(JSON.stringify({'res':[]}));
    } else {
      collection2.find({userid:new mongodb.ObjectID(req.body.userid)}).sort({created_at:-1}).toArray(function(err2, items2){
        if (err2) {
          resp.send(JSON.stringify({'res':[]}));
        } else {
          collection3.find().sort({_id:-1}).toArray(function(err3, items3){
            if (err3) {
              resp.send(JSON.stringify({'res':[]}));
            } else {

              resp.send(JSON.stringify({'res':items,'res2':items2,'res3':items3}));
            }
          });
          //   resp.send(JSON.stringify({'res':items,'resc':items.length,'res2':items2,'resc2':items2.length}));
        }
      });
      // resp.send(JSON.stringify({'res':items,'resc':items.length}));
    }
  });
});
app.post('/contactto', function (req, resp) {
  var crypto = require('crypto');
  var added_time= new Date().getTime();
  if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
    .update('password')
    .digest('hex');
  for(var i in req.body.sourceobj){
    if(req.body.data[req.body.sourceobj[i]]!=null && req.body.data[req.body.sourceobj[i]].length>2){
      req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
    }
  }
  if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
  var collection = db.collection(req.body.source.toString());
  req.body.data['created_at']=added_time;
  collection.insert([req.body.data], function (err, result) {
    if (err) {
      resp.send(JSON.stringify({'status':'failed','id':0}));
    } else {


      var smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
          user: "itplcc40@gmail.com",
          pass: "DevelP7@"
        }
      });
      var mail = {
        from: "NexGen<support@nexgentesting.com>",
        to: req.body.data.email,
        subject: 'Welcome to the Nexgen Testing.',
        html: 'Thank you for your interest of joining NexGen’s Sales Rep Team! We are excited to help you in this opportunity to further your career. Please go to this page to fill out additional info that is needed to complete your application process. Once you have completed the necessary steps to apply for this position you will be notified immediately on whether or not you qualify for this position.<br/><a href="http://nexgentesting.com.s3-website-us-east-1.amazonaws.com/funnel">Click Here</a>'
      }
      smtpTransport.sendMail(mail, function (error, response) {
        console.log('send');
        smtpTransport.close();
      });
      resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
      /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
             return;*/
    }
  });
});
/*COMMON FUNCTIONS*/
/*
app.post('/login',function (req, resp) {
  var collection = db.collection('test');
  cond = {
    $and: [
      {username: req.body.username},
      {password: req.body.password}
    ]
  };

  collection.find({cond}).toArray(function (err, items) {
    if (items.length == 0) {
      resp.send(JSON.stringify({'status': 'error', 'msg': 'Email id is invalid...'}));
      return;
    }
  });
});*/

  /*
  app.post('/login', function (req, resp) {
      var crypto = require('crypto');
      var secret = req.body.password;
      var hash = crypto.createHmac('sha256', secret)
          .update('password')
          .digest('hex');
      var collection = db.collection('tast');
      collection.find({ email:req.body.email}).toArray(function(err, items){
          if(items.length==0){
              resp.send(JSON.stringify({'status':'error','msg':'Email id is invalid...'}));
              return;
          }
          if(items.length>0 && items[0].password!=hash){
              resp.send(JSON.stringify({'status':'error','msg':'Password Doesnot match'}));
              return;
          }
          if(items.length>0 && items[0].status==0){
              resp.send(JSON.stringify({'status':'error','msg':'This is Inactive User'}));
              return;
          }
          if(items.length>0 && items[0].password==hash){
              var tokenis = createjwttoken();
              if(tokenis!=null){
                  resp.send(JSON.stringify({'status':'success','item':items,token:createjwttoken()}));
                  return;
              }else{
                  resp.send(JSON.stringify({'status':'error','msg':'Contact to site administrator for further information!'}));
                  return;
              }

          }
      });
  });
  */

  app.post('/datalist', function (req, resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    var i = 0;
    var tval;
    var bval;
    var ck;
    if (tokenstatus != true) {
      resp.send(JSON.stringify({'status': 'error', token: token, errormessage: tokenstatus}));
      return;
    }

    var varr = req.body.condition;
    console.log("varr");
    console.log(varr);
    var bvarr = [];
    //console.log(varr.length);
    if (typeof (req.body.condition) != 'undefined') {

      Object.keys(varr).forEach(function (c) { /*c is hold categoryid_object as string see form.component.ts 's 69 line*/
        // do something with obj[key]
        ck = '_object';/*ck only hold the _object as string*/
        console.log(c);//only show categoryid_object
        console.log(c.indexOf(ck));
        console.log(ck.indexOf(c));
        if (c.indexOf(ck) >= 0) {
          tavl = varr[c];
          //varr.splice(i,1);
          bval = c.replace('_object', '');
          //bvarr.push({bval:tval});
          bvarr[bval] = new mongodb.ObjectID(varr[c]);
        } else bvarr[c] = varr[c];
        i++;
        //console.log(key);
      });

      req.body.condition = Object.assign({}, bvarr);
    }
    if (typeof (req.body.condition) != 'undefined' && typeof (req.body.condition._id) != 'undefined') {
      req.body.condition._id = new mongodb.ObjectID(req.body.condition._id);
    }
    var cond = req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort({_id: -1}).toArray(function (err, items) {
      if (err) {
        console.log(err);
        resp.send(JSON.stringify({'res': []}));

      } else {
        resp.send(JSON.stringify({'res': items, 'resc': items.length}));
      }
    });

  });


  app.post('/getrecvalues', function (req, resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    var i = 0;
    var tval;
    var bval;
    var ck;
    if (tokenstatus != true) {
      resp.send(JSON.stringify({'status': 'error', token: token, errormessage: tokenstatus}));
      return;
    }

    var collection = db.collection('rep_recruiter_view');
    var collection2 = db.collection('donetraininglesson_view');
    collection.find({_id: new mongodb.ObjectID(req.body._id)}).sort({_id: -1}).toArray(function (err, items) {
      if (err) {
        console.log(err);
        resp.send(JSON.stringify({'res': []}));

      } else {
        collection2.find({userid: new mongodb.ObjectID(req.body._id)}).limit(1).toArray(function (err2, items2) {
          if (err2) {
            console.log(err2);
            resp.send(JSON.stringify({'res': []}));
          } else {
            resp.send(JSON.stringify({'res': items, 'res2': items2[0]}));
          }
        });
        //  resp.send(JSON.stringify({'res':items}));
      }
    });
  });

  app.post('/contactto', function (req, resp) {
    var crypto = require('crypto');
    var added_time = new Date().getTime();
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.password) != 'undefined') req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
      .update('password')
      .digest('hex');
    for (var i in req.body.sourceobj) {
      if (req.body.data[req.body.sourceobj[i]] != null && req.body.data[req.body.sourceobj[i]].length > 2) {
        req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
      }
    }
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.confirmpassword) != 'undefined') req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    req.body.data['created_at'] = added_time;
    collection.insert([req.body.data], function (err, result) {
      if (err) {
        resp.send(JSON.stringify({'status': 'failed', 'id': 0}));
      } else {


        var smtpTransport = mailer.createTransport({
          service: "Gmail",
          auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
          }
        });
        var mail = {
          from: "NexGen<support@nexgentesting.com>",
          to: req.body.email,
          subject: 'Welcome to the Nexgen Testing.',
          html: 'Thank you for your interest of joining NexGen’s Sales Rep Team! We are excited to help you in this opportunity to further your career. Please go to this page to fill out additional info that is needed to complete your application process. Once you have completed the necessary steps to apply for this position you will be notified immediately on whether or not you qualify for this position.<br/><a href="http://nexgentesting.com.s3-website-us-east-1.amazonaws.com/funnel">Click Here</a>'
        }
        smtpTransport.sendMail(mail, function (error, response) {
          console.log('send');
          smtpTransport.close();
        });
        resp.send(JSON.stringify({'status': 'success', 'id': result.ops[0]._id}));


        /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
          return;*/
      }
    });
  });


  app.post('/addorupdatedata', function (req, resp) {
    var crypto = require('crypto');
    var added_time = moment().unix();
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.password) != 'undefined') req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
      .update('password')
      .digest('hex');
    for (var i in req.body.sourceobj) {
      if (req.body.data[req.body.sourceobj[i]] != null && req.body.data[req.body.sourceobj[i]].length > 2) {
        req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
      }
    }
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.confirmpassword) != 'undefined') req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    if (typeof (req.body.data.id) == 'undefined') {
      req.body.data['created_at'] = added_time;
      collection.insert([req.body.data], function (err, result) {
        if (err) {
          resp.send(JSON.stringify({'status': 'failed', 'id': 0}));
        } else {
          resp.send(JSON.stringify({'status': 'success', 'res': result.ops[0]._id}));
          return;
        }
      });
    }

    if (typeof (req.body.data.id) != 'undefined') {
      req.body.data['updated_at'] = added_time;
      var o_id = new mongodb.ObjectID(req.body.data.id);
      collection.update({_id: o_id}, {$set: req.body.data}, true, true);
      resp.send(JSON.stringify({'status': 'success', update: 1}));
      return;
    }
  });

  app.post('/deletesingledata', function (req, resp) {
    var collection = db.collection(req.body.source.toString());
    var o_id = new mongodb.ObjectID(req.body.id);
    // collection.remove({_id:o_id}, true);
    collection.remove({_id: o_id}, function (err, results) {
      if (err) {
        resp.send(JSON.stringify({'status': 'failed'}));
      } else {
        resp.send(JSON.stringify({'status': 'success'}));
      }
    });
  });
  app.post('/filterdate', function (req, resp) {

    var first = new Date(req.body.first);                          /*.find( { qty: { $lte: 20 } } )*/
    /*var dd=first.getDate();
    var mm=first.getMonth()+2;//january is 0
    var yyyy=first.getFullYear();*/

    var last = new Date(req.body.last);


    var collection = db.collection(req.body.source.toString());
    collection.find({created_at: {$gt:newDate(first).toISOString()}} && ({created_at: {$lt:newDate(last).toISOString()}})).toArray(function (error, items) {
      if (error) {
        resp.send(JSON.stringify({'status': 'not found'}));
      }
       /* {status:'1',start_date:{$lte:new Date().toISOString().substr(0, 19)},end_date:{$gte:new Date().toISOString().substr(0, 19)}}*/


      else {
        /*if(items.created_at>first && items.created_at<last)
                 resp.send(JSON.stringify({'status':'success','item':items}));
             else {
            resp.send(JSON.stringify({'status': 'not found the records'}));
        }*/
        resp.send(JSON.stringify({'status': 'success', 'item': items}));
      }

    })

  });

  function createjwttoken() {
    var older_token = jwt.sign({
      foo: 'bar',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }, app.get('superSecret'));
    /*const payload = {
        admin: true     };
    var token = jwt.sign(payload, app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours
    });*/
    //resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
    return older_token;
  };

  function verifytoken(token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      console.log('token');
      console.log(token);
      if (err) {
        //resp.send(JSON.stringify({'status':'success',error:err}));
        console.log('in error');
        tokenstatus = err.message;
      } else {
        console.log('in success !!');
        tokenstatus = true;
      }
    });
  };





  app.get('/createtoken', function (req, resp) {
    var older_token = jwt.sign({
      foo: 'bar',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3)
    }, app.get('superSecret'));

    const payload = {
      admin: true
    };
    var token = jwt.sign(payload, app.get('superSecret'), {
      //expiresInMinutes: 1440 // expires in 24 hours
    });
    resp.send(JSON.stringify({'status': 'success', token: token, oldtoken: older_token}));
    return;
  });
  app.get('/checktoken', function (req, resp) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        resp.send(JSON.stringify({'status': 'success', error: err}));
        return;
      } else {
        resp.send(JSON.stringify({'status': 'success', token: 'success'}));
      }
    });

    return;
  });



function createjwttoken() {
  var older_token = jwt.sign({
    foo: 'bar',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }, app.get('superSecret'));
  /*const payload = {
      admin: true     };
  var token = jwt.sign(payload, app.get('superSecret'), {
      //expiresInMinutes: 1440 // expires in 24 hours
  });*/
  //resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
  return older_token;
};

app.get('/test11', function (req, resp){
  resp.send(JSON.stringify({'status': 'dafd'}));
});



app.get('/temptoken', function (req, resp) {
  token:createjwttoken();
  resp.send(JSON.stringify({'status': 'success', token: createjwttoken()}));
});

https.createServer(options, app).listen(6011);


/*app.post('/login',function (req, resp) {

  var collection = db.collection('test');
  cond = {
    $and: [
      {username: req.body.username},
      {password: req.body.password}
    ]
  };

  collection.find({cond}).toArray(function (err, items) {
    if (items.length == 0) {
      resp.send(JSON.stringify({'status': 'error', 'msg': 'Email id is invalid...'}));
      return;
    }
  });
});*/

app.post('/login',function (req, resp) {
  var collection = db2.collection('test');
  cond = {
    $and: [
      {username: req.body.username},
      {password: req.body.password}
    ]
  };
  collection.find(cond).toArray(function (err, items) {
    if (items.length == 0) {
      resp.send(JSON.stringify({'status': 'error', 'msg': 'Password is invalid...'}));
      return;
    }else {
      resp.send(JSON.stringify({'status': 'success', "item": items}));
      return;
    }
  });
});

app.get('/te', function (req, resp) {
  resp.send(JSON.stringify({'status': 'success'}));
});
